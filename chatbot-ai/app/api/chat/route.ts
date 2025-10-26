import { NextResponse } from "next/server";
import { streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY!,
      baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    });

    const { textStream } = await streamText({
      model: openrouter.chat(
        process.env.OPENROUTER_MODEL || "anthropic/claude-3-haiku"
      ),
      messages,
      system: "Eres un asistente útil y seguro. No reveles claves ni información privada.",
    });

    // ✅ Devolvemos el stream correctamente
    return new Response(textStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("❌ Error en /api/chat:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Error procesando el mensaje" },
      { status: 500 }
    );
  }
}
