import { NextResponse } from "next/server";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { tool } from "ai";
import { searchBooksTool } from "@/lib/tools/searchBooksTool";
import { getBookDetailsTool } from "@/lib/tools/getBookDetailsTool";

export const maxDuration = 30;

// Rate Limit
const rateLimit = new Map<string, { count: number; last: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const limit = 10;
  const minDelay = 3_000;
  const record = rateLimit.get(ip);

  if (!record) {
    rateLimit.set(ip, { count: 1, last: now });
    return true;
  }

  if (now - record.last < minDelay) return false;
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
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Espera unos segundos." },
        { status: 429 }
      );
    }

    const body = await req.json();
    if (!body || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "Formato de mensaje inválido." },
        { status: 400 }
      );
    }

    const messages: UIMessage[] = body.messages.map((m: IncomingMessage) => ({
      role: m.role,
      parts: m.parts ?? [{ type: "text", text: m.content ?? "" }],
    }));

    const modelMessages = convertToModelMessages(messages);

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY!,
      baseURL:
        process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
    });

   const result = await streamText({
      model: openrouter.languageModel(
        process.env.OPENROUTER_MODEL || "anthropic/claude-3-5-haiku"
      ),
      messages: modelMessages,
      system:
        "Eres un asistente experto en libros. Si el usuario pide recomendaciones o busca libros, usa la herramienta searchBooks. Siempre responde en español, con buena gramática y tono natural.",
      tools: {
        searchBooks: tool(searchBooksTool),
        getBookDetails: tool(getBookDetailsTool),
      },
      toolChoice: "auto",
      temperature: 0.7,
    });

    // Streaming SSE
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          let buffer = "";
          for await (const chunk of result.textStream) {
            if (!chunk) continue;

            // Normalizamos saltos y espacios sin cortar caracteres
            buffer += chunk;
            buffer = buffer
              .replace(/\uFFFD/g, "") // elimina caracteres inválidos
              .replace(/\n+/g, " ")
              .replace(/\s{2,}/g, " ");

            controller.enqueue(encoder.encode(`data: ${buffer}\n\n`));
            buffer = ""; // limpiar para próximo fragmento
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          console.error("Error en stream:", err);
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
    console.error("Error en /api/chat:", error);
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
