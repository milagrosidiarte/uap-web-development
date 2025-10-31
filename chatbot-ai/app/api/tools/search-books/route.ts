import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { searchGoogleBooks } from "@/lib/googleBooks";

const schema = z.object({
  query: z.string().trim().min(1, "query es requerida").max(200),
  maxResults: z.number().int().min(1).max(40).optional(),
  orderBy: z.enum(["relevance", "newest"]).optional(),
});

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const { query, maxResults, orderBy } = schema.parse(body);

    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "Falta GOOGLE_BOOKS_API_KEY en el backend" },
        { status: 500 }
      );
    }

    const books = await searchGoogleBooks({ query, maxResults, orderBy, apiKey });
    return NextResponse.json({ ok: true, data: books });
  } catch (err: unknown) {
    let msg = "Error inesperado";
    let status = 500;

    if (err instanceof ZodError) {
      msg = err.issues.map((issue) => issue.message).join(", ");
      status = 400;
    } else if (err instanceof Error) {
      msg = err.message;
    }

    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
