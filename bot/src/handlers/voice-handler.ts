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
