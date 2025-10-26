import { NextResponse } from "next/server";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Tipamos explícitamente el arreglo de mensajes
    const messages = body.messages as UIMessage[];

    // Convertimos los mensajes de UIMessage[] → ModelMessage[]
    const modelMessages = convertToModelMessages(messages);

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY!,
      baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    });

    const { textStream } = await streamText({
      model: openrouter.chat(
        process.env.OPENROUTER_MODEL || "anthropic/claude-3-haiku"
      ),
      messages: modelMessages,
      system: "Eres un asistente útil y seguro. No reveles claves ni información privada.",
    });

    return new Response(textStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error: unknown) {
    // ✅ Tipado estricto del error
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
