/**
 * Agent Bot TypeScript Version
 * Telegram bot powered by Claude Code CLI with voice support
 */

import { Bot } from "grammy";
import { handleVoiceMessage } from "./handlers/voice-handler.js";

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN is required");
  process.exit(1);
}

// ─── TELEGRAM BOT ────────────────────────────────────────────────────────────

const bot = new Bot(BOT_TOKEN);

// ─── MESSAGE HANDLERS ───────────────────────────────────────────────────────

// Register voice message handler
bot.on("message:voice", handleVoiceMessage);

// ─── START ────────────────────────────────────────────────────────────────────

bot.catch((err) => {
  console.error("[bot-error]", err.message);
});

bot.start({
  onStart: async () => {
    await bot.api.setMyCommands([
      { command: "start", description: "Меню" },
      { command: "stop", description: "Остановить задачу" },
      { command: "reset", description: "Новая сессия" },
      { command: "settings", description: "Настройки" },
      { command: "status", description: "Статус системы" },
    ]);

    console.log("Agent bot started with voice support enabled");
  },
  drop_pending_updates: true,
});
