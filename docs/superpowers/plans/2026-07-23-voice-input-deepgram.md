# Голосовой ввод через Deepgram для Telegram-бота

> **Для agentов:** Используйте superpowers:subagent-driven-development или superpowers:executing-plans для выполнения плана пошагово.

**Цель:** Telegram-бот принимает голосовые сообщения, транскрибирует их через Deepgram и отправляет текст для обработки.

**Архитектура:** Пользователь отправляет голосовое сообщение в бота → бот загружает аудиофайл → отправляет в Deepgram API → получает текст → обрабатывает как обычный текстовый запрос → отвечает пользователю.

**Tech Stack:** Deepgram API v1, Grammy (Telegram бот), Node.js (или Python), dotenv для ключей

## Global Constraints

- Язык транскрибации: русский
- Модель Deepgram: nova-2
- Обработчик голоса должен быть в `bot/src/handlers/voice-handler.ts`
- Сервис Deepgram должен быть в `bot/src/services/deepgram-service.ts`
- API ключ хранится в `DEEPGRAM_API_KEY` в `.env`
- Каждый коммит должен содержать рабочее состояние

---

## Файлы которые изменятся/создадутся

- **`.env`** — добавить `DEEPGRAM_API_KEY`
- **`bot/.env.example`** — документировать переменную
- **`bot/src/handlers/voice-handler.ts`** (новый) — обработка голосовых сообщений
- **`bot/src/services/deepgram-service.ts`** (новый) — интеграция с Deepgram API
- **`bot/src/main.ts`** — подключить обработчик голоса
- **`bot/package.json`** — добавить зависимость `@deepgram/sdk`

---

## Task 1: Регистрация и получение ключа Deepgram

**Интерфейсы:**
- Produces: `DEEPGRAM_API_KEY` в `.env`

- [ ] Зайти на https://console.deepgram.com/signup
- [ ] Зарегистрироваться или войти
- [ ] Создать новый API Key (Console → API Keys → Create New)
- [ ] Скопировать ключ и добавить в `.env`:
```
DEEPGRAM_API_KEY=your_key_here
```
- [ ] Проверить что ключ не залился в git:
```bash
git check-ignore .env
```
Expected: `.env is ignored`

---

## Task 2: Установить зависимость Deepgram SDK

**Files:**
- Modify: `bot/package.json`

**Интерфейсы:**
- Produces: Deepgram SDK доступен в проекте

- [ ] Открыть `bot/package.json`
- [ ] Добавить в `dependencies`:
```json
"@deepgram/sdk": "^3.5.0"
```
- [ ] Сохранить файл
- [ ] Установить зависимости:
```bash
cd bot
npm install
```
Expected: `npm notice create-lockfile bot/package-lock.json` или `up to date`

- [ ] Коммит:
```bash
git add bot/package.json bot/package-lock.json
git commit -m "feat: add deepgram sdk for voice transcription"
```

---

## Task 3: Создать Deepgram сервис

**Files:**
- Create: `bot/src/services/deepgram-service.ts`

**Интерфейсы:**
- Produces: `transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<string>`

- [ ] Создать файл `bot/src/services/deepgram-service.ts`:

```typescript
import { Deepgram } from "@deepgram/sdk";

const deepgram = new Deepgram({
  apiKey: process.env.DEEPGRAM_API_KEY,
});

export async function transcribeAudio(
  audioBuffer: Buffer,
  mimeType: string
): Promise<string> {
  try {
    const result = await deepgram.listen.prerecorded.transcribeBuffer(
      audioBuffer,
      {
        model: "nova-2",
        language: "ru",
        smart_format: true,
      }
    );

    const transcript =
      result.result.results?.channels[0]?.alternatives[0]?.transcript || "";

    if (!transcript) {
      throw new Error("No transcript received from Deepgram");
    }

    return transcript;
  } catch (error) {
    console.error("Deepgram transcription error:", error);
    throw error;
  }
}
```

- [ ] Коммит:
```bash
git add bot/src/services/deepgram-service.ts
git commit -m "feat: add deepgram transcription service"
```

---

## Task 4: Создать обработчик голосовых сообщений

**Files:**
- Create: `bot/src/handlers/voice-handler.ts`

**Интерфейсы:**
- Consumes: `transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<string>`
- Produces: обработчик для Grammy `bot.on("message:voice", ...)`

- [ ] Создать файл `bot/src/handlers/voice-handler.ts`:

```typescript
import { Context } from "grammy";
import { transcribeAudio } from "../services/deepgram-service.js";

export async function handleVoiceMessage(ctx: Context): Promise<void> {
  const voice = ctx.message?.voice;

  if (!voice) {
    await ctx.reply("Голосовое сообщение не найдено.");
    return;
  }

  // Отправить статус "печатает"
  await ctx.sendChatAction("typing");

  try {
    // Скачать аудиофайл
    const file = await ctx.getFile();
    const audioBuffer = await file.download();

    // Транскрибировать
    await ctx.sendChatAction("typing");
    const transcript = await transcribeAudio(audioBuffer, "audio/ogg");

    // Ответить с транскрибированным текстом
    await ctx.reply(`📝 Вы сказали:\n\n<code>${transcript}</code>`, {
      parse_mode: "HTML",
    });

    // Обработать как обычный текстовый запрос (если нужно)
    // await processUserMessage(ctx, transcript);
  } catch (error) {
    console.error("Voice processing error:", error);
    await ctx.reply(
      "❌ Ошибка при обработке голоса. Попробуйте ещё раз."
    );
  }
}
```

- [ ] Коммит:
```bash
git add bot/src/handlers/voice-handler.ts
git commit -m "feat: add voice message handler with deepgram transcription"
```

---

## Task 5: Подключить обработчик в главный файл бота

**Files:**
- Modify: `bot/src/main.ts`

**Интерфейсы:**
- Consumes: `handleVoiceMessage(ctx: Context): Promise<void>`

- [ ] Открыть `bot/src/main.ts`
- [ ] Добавить импорт в начало файла:
```typescript
import { handleVoiceMessage } from "./handlers/voice-handler.js";
```

- [ ] Добавить регистрацию обработчика (перед `bot.start()`):
```typescript
bot.on("message:voice", handleVoiceMessage);
```

- [ ] Сохранить файл
- [ ] Коммит:
```bash
git add bot/src/main.ts
git commit -m "feat: register voice message handler in bot"
```

---

## Task 6: Обновить .env.example

**Files:**
- Modify: `bot/.env.example`

- [ ] Открыть `bot/.env.example`
- [ ] Добавить:
```
DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

- [ ] Сохранить и коммит:
```bash
git add bot/.env.example
git commit -m "docs: add deepgram api key to env example"
```

---

## Task 7: Тестирование

**Интерфейсы:**
- Consumes: Работающий бот с голосовым обработчиком

- [ ] Запустить бота:
```bash
cd bot
npm start
```
Expected: `Bot is running` в консоли

- [ ] Отправить голосовое сообщение боту в Telegram
- [ ] Ожидаемо: бот ответит с транскрибированным текстом
- [ ] Если ошибка — проверить:
  - `DEEPGRAM_API_KEY` установлен
  - Интернет работает
  - API ключ валидный (зайти в console.deepgram.com и проверить)
