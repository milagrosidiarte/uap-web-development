import { NextResponse } from "next/server";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const maxDuration = 30;

// Rate Limiter
const rateLimit = new Map<string, { count: number; last: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000; // 1 minuto
  const limit = 10; // máximo 10 requests/min
  const minDelay = 3_000; // al menos 3 seg entre requests

  const record = rateLimit.get(ip);

  if (!record) {
    rateLimit.set(ip, { count: 1, last: now });
    return true;
  }

  if (now - record.last < minDelay) return false; // demasiado rápido
  if (now - record.last > windowMs) {
    rateLimit.set(ip, { count: 1, last: now });
    return true;
  }

  record.count++;
  record.last = now;
  if (record.count > limit) return false;
  return true;
}


interface IncomingMessage {
  role: "user" | "assistant" | "system";
  content?: string;
  parts?: { type: "text"; text: string }[];
}

export async function POST(req: Request) {
  try {
    // Protección contra abuso por IP
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Espera unos segundos." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Validar que haya mensajes
    if (!body || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Formato de mensaje inválido." },
        { status: 400 }
      );
    }

    // Convertir mensajes al formato UIMessage sin usar any
    const messages: UIMessage[] = body.messages.map((m: IncomingMessage) => ({
      role: m.role,
      parts: m.parts ?? [{ type: "text", text: m.content ?? "" }],
    }));

    const modelMessages = convertToModelMessages(messages);

    // Configurar proveedor OpenRouter
    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY!,
      baseURL:
        process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    });

    const result = await streamText({
      model: openrouter.chat(
        process.env.OPENROUTER_MODEL || "anthropic/claude-3-haiku"
      ),
      messages: modelMessages,
      system:
        "Eres un asistente útil, seguro y educativo. No reveles información sensible ni privada.",
    });

    // Stream SSE seguro
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            if (!chunk) continue;
            controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          console.error("❌ Error en el stream:", err);
          try {
            controller.error(err);
          } catch {}
        }
      },
    });

    return new Response(readable, {
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
