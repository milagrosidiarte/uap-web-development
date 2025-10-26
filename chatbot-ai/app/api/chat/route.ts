import { NextResponse } from "next/server";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 1️⃣ Leer body y convertir mensajes
    const body = await req.json();
    const messages = body.messages as UIMessage[];
    const modelMessages = convertToModelMessages(messages);

    // 2️⃣ Crear cliente de OpenRouter
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY!,
      baseURL:
        process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    });

    // 3️⃣ Generar stream de texto del modelo
    const result = await streamText({
      model: openrouter.chat(
        process.env.OPENROUTER_MODEL || "anthropic/claude-3-haiku"
      ),
      messages: modelMessages,
      system:
        "Eres un asistente útil y seguro. No reveles información privada ni claves.",
    });

    // 4️⃣ Devolver stream SSE correcto (v5 usa toTextStreamResponse)
    return result.toTextStreamResponse({
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("❌ Error en /api/chat:", error);

    const err =
      error instanceof Error
        ? error
        : new Error("Error desconocido en /api/chat");

    return NextResponse.json(
      { error: err.message || "Error procesando el mensaje" },
      { status: 500 }
    );
  }
}
