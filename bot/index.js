/**
 * Agent Bot — minimal Telegram bot powered by Claude Code CLI
 * Part of jarvis-architect: personal AI agent for course students
 *
 * Features: text + voice → Claude Code → response, sessions, DNA files, typing animation
 */

import { Bot } from "grammy";
import { autoRetry } from "@grammyjs/auto-retry";
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from "node:fs";
import { createInterface } from "node:readline";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";
import https from "node:https";
import http from "node:http";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const BOT_TOKEN = process.env.BOT_TOKEN;
const AGENT_HOME = process.env.AGENT_HOME || "/home/agent";
const WORKSPACE = join(AGENT_HOME, "workspace");
const DATA_DIR = join(AGENT_HOME, ".agent");
const SESSIONS_FILE = join(DATA_DIR, "sessions.json");

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN is required");
  process.exit(1);
}

// Ensure data directory exists
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

// ─── SESSIONS ────────────────────────────────────────────────────────────────

function loadSessions() {
  try {
    return new Map(Object.entries(JSON.parse(readFileSync(SESSIONS_FILE, "utf8"))));
  } catch {
    return new Map();
  }
}

function saveSessions() {
  try {
    writeFileSync(SESSIONS_FILE, JSON.stringify(Object.fromEntries(sessions), null, 2));
  } catch (e) {
    console.error("[sessions] save error:", e.message);
  }
}

const sessions = loadSessions();

// ─── SYSTEM PROMPT ───────────────────────────────────────────────────────────

function buildSystemPrompt() {
  const parts = [];

  // DNA files — read each if exists
  const dnaFiles = ["SOUL.md", "MEMORY.md", "GOALS.md", "CLAUDE.md"];
  for (const name of dnaFiles) {
    const path = join(WORKSPACE, name);
    if (existsSync(path)) {
      try {
        parts.push(`--- ${name} ---\n${readFileSync(path, "utf8")}`);
      } catch {}
    }
  }

  // Today's diary
  const today = new Date().toISOString().split("T")[0];
  const diaryPath = join(WORKSPACE, "memory", `${today}.md`);
  if (existsSync(diaryPath)) {
    try {
      parts.push(`--- Дневник ${today} ---\n${readFileSync(diaryPath, "utf8")}`);
    } catch {}
  }

  return parts.length > 0 ? parts.join("\n\n") : "";
}

// ─── CLAUDE CODE CLI ─────────────────────────────────────────────────────────

// Sequential queue — only one Claude call at a time
let _queue = Promise.resolve();

function callClaude(prompt, sessionId) {
  const p = _queue.then(() => _callClaudeInner(prompt, sessionId));
  _queue = p.catch(() => {});
  return p;
}

function _callClaudeInner(prompt, sessionId) {
  return new Promise((resolve, reject) => {
    const args = [
      "-p", prompt,
      "--output-format", "json",
      "--max-turns", "15",
      "--model", "sonnet",
      "--dangerously-skip-permissions",
    ];

    const systemPrompt = buildSystemPrompt();
    if (systemPrompt) args.push("--append-system-prompt", systemPrompt);

    if (sessionId) args.push("--resume", sessionId);

    const child = spawn("claude", args, {
      cwd: WORKSPACE,
      env: { ...process.env, HOME: AGENT_HOME },
      timeout: 600000, // 10 min
    });
    child.stdin.end();

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));

    child.on("close", (code) => {
      if (code !== 0 && !stdout.trim()) {
        return reject(new Error(`Claude exit ${code}: ${stderr.slice(0, 300)}`));
      }
      try {
        const result = JSON.parse(stdout);
        resolve({
          text: result.result || result.text || "(пустой ответ)",
          sessionId: result.session_id || sessionId,
          cost: result.cost_usd || 0,
        });
      } catch {
        // Sometimes Claude outputs plain text
        const text = stdout.trim();
        resolve({ text: text || "(пустой ответ)", sessionId, cost: 0 });
      }
    });

    child.on("error", reject);
  });
}

// ─── VOICE HANDLING ──────────────────────────────────────────────────────────

async function downloadFile(url, destPath) {
  const proto = url.startsWith("https") ? https : http;
  const response = await new Promise((resolve, reject) => {
    proto.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      resolve(res);
    }).on("error", reject);
  });
  await pipeline(response, createWriteStream(destPath));
}

async function transcribeVoice(filePath) {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) return null;

  return new Promise((resolve, reject) => {
    const fileData = readFileSync(filePath);
    const options = {
      hostname: "api.deepgram.com",
      path: "/v1/listen?model=nova-2&language=ru&smart_format=true",
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "audio/ogg",
        "Content-Length": fileData.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (d) => (data += d));
      res.on("end", () => {
        try {
          const result = JSON.parse(data);
          resolve(result.results?.channels?.[0]?.alternatives?.[0]?.transcript || "");
        } catch {
          resolve("");
        }
      });
    });
    req.on("error", reject);
    req.write(fileData);
    req.end();
  });
}

// ─── TELEGRAM BOT ────────────────────────────────────────────────────────────

const bot = new Bot(BOT_TOKEN);
bot.api.config.use(autoRetry());

// /start
bot.command("start", async (ctx) => {
  await ctx.reply(
    "Привет! Я твой персональный AI-агент.\n\n" +
    "Пиши мне текстом или отправляй голосовые — я помогу с любыми задачами.\n\n" +
    "Команды:\n/reset — начать новый диалог\n/status — проверить статус"
  );
});

// /reset — clear session
bot.command("reset", async (ctx) => {
  const userId = String(ctx.from.id);
  sessions.delete(userId);
  saveSessions();
  await ctx.reply("Сессия сброшена. Начинаем с чистого листа.");
});

// /status
bot.command("status", async (ctx) => {
  const userId = String(ctx.from.id);
  const hasSession = sessions.has(userId);
  const dnaFiles = ["SOUL.md", "MEMORY.md", "GOALS.md", "CLAUDE.md"];
  const found = dnaFiles.filter((f) => existsSync(join(WORKSPACE, f)));
  await ctx.reply(
    `Статус:\n` +
    `- Сессия: ${hasSession ? "активна" : "новая"}\n` +
    `- DNA-файлы: ${found.join(", ") || "не найдены"}\n` +
    `- Workspace: ${WORKSPACE}`
  );
});

// Handle text messages
bot.on("message:text", async (ctx) => {
  const userId = String(ctx.from.id);
  const text = ctx.message.text;

  // Show typing
  const thinkingMsg = await ctx.reply("Думаю... ⏳");
  const typingInterval = setInterval(() => {
    ctx.api.sendChatAction(ctx.chat.id, "typing").catch(() => {});
  }, 4000);

  try {
    const sessionId = sessions.get(userId) || null;
    const result = await callClaude(text, sessionId);

    // Save session
    if (result.sessionId) {
      sessions.set(userId, result.sessionId);
      saveSessions();
    }

    // Delete thinking message and send response
    clearInterval(typingInterval);
    await ctx.api.deleteMessage(ctx.chat.id, thinkingMsg.message_id).catch(() => {});

    // Split long messages (Telegram limit 4096)
    const response = result.text;
    if (response.length <= 4096) {
      await ctx.reply(response);
    } else {
      for (let i = 0; i < response.length; i += 4096) {
        await ctx.reply(response.slice(i, i + 4096));
      }
    }
  } catch (err) {
    clearInterval(typingInterval);
    await ctx.api.deleteMessage(ctx.chat.id, thinkingMsg.message_id).catch(() => {});
    console.error("[error]", err.message);
    await ctx.reply("Произошла ошибка. Попробуй ещё раз или /reset для сброса сессии.");
  }
});

// Handle voice messages
bot.on("message:voice", async (ctx) => {
  if (!process.env.DEEPGRAM_API_KEY) {
    return ctx.reply("Голосовые сообщения пока не поддерживаются. Добавь DEEPGRAM_API_KEY в .env");
  }

  const thinkingMsg = await ctx.reply("Слушаю голосовое... 🎤");
  const typingInterval = setInterval(() => {
    ctx.api.sendChatAction(ctx.chat.id, "typing").catch(() => {});
  }, 4000);

  try {
    // Download voice file
    const file = await ctx.getFile();
    const tmpPath = `/tmp/voice_${ctx.from.id}_${Date.now()}.ogg`;
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
    await downloadFile(fileUrl, tmpPath);

    // Transcribe
    const transcript = await transcribeVoice(tmpPath);
    unlinkSync(tmpPath);

    if (!transcript) {
      clearInterval(typingInterval);
      await ctx.api.deleteMessage(ctx.chat.id, thinkingMsg.message_id).catch(() => {});
      return ctx.reply("Не удалось распознать голосовое. Попробуй ещё раз.");
    }

    // Show what was recognized
    await ctx.api.editMessageText(ctx.chat.id, thinkingMsg.message_id, `Распознано: "${transcript.slice(0, 100)}${transcript.length > 100 ? "..." : ""}"\n\nДумаю... ⏳`);

    // Process with Claude
    const userId = String(ctx.from.id);
    const sessionId = sessions.get(userId) || null;
    const result = await callClaude(transcript, sessionId);

    if (result.sessionId) {
      sessions.set(userId, result.sessionId);
      saveSessions();
    }

    clearInterval(typingInterval);
    await ctx.api.deleteMessage(ctx.chat.id, thinkingMsg.message_id).catch(() => {});

    const response = result.text;
    if (response.length <= 4096) {
      await ctx.reply(response);
    } else {
      for (let i = 0; i < response.length; i += 4096) {
        await ctx.reply(response.slice(i, i + 4096));
      }
    }
  } catch (err) {
    clearInterval(typingInterval);
    await ctx.api.deleteMessage(ctx.chat.id, thinkingMsg.message_id).catch(() => {});
    console.error("[voice-error]", err.message);
    await ctx.reply("Ошибка обработки голосового. Попробуй текстом или /reset.");
  }
});

// ─── START ────────────────────────────────────────────────────────────────────

bot.catch((err) => console.error("[bot-error]", err.message));

bot.start({
  onStart: () => console.log(`Agent bot started (workspace: ${WORKSPACE})`),
  drop_pending_updates: true,
});
