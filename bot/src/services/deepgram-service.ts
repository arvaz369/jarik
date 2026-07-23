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
