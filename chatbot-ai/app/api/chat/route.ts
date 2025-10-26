import { NextResponse } from "next/server";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages as UIMessage[];
    const modelMessages = convertToModelMessages(messages);

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY!,
      baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    });

    // Generamos el stream
    const { textStream } = await streamText({
      model: openrouter.chat(
        process.env.OPENROUTER_MODEL || "anthropic/claude-3-haiku"
      ),
      messages: modelMessages,
      system:
        "Eres un asistente útil y seguro. No reveles claves ni información privada.",
    });

    // 🔥 devolvemos el stream con tipo SSE
    return new Response(textStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    const err =
      error instanceof Error
        ? error
        : new Error("Error desconocido en /api/chat");

    console.error("❌ Error en /api/chat:", err);

    return NextResponse.json(
      { error: err.message || "Error procesando el mensaje" },
      { status: 500 }
    );
  }
}
