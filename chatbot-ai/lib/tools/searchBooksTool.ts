import { z } from "zod";
import { searchGoogleBooks } from "@/lib/googleBooks";

/** Tipo de resultado simplificado de Google Books */
export interface GoogleBookBasic {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  publishedYear?: string;
}

/** Esquema de entrada */
const searchBooksSchema = z.object({
  query: z
    .string()
    .min(1)
    .describe("Término de búsqueda (título, autor o tema)."),
  maxResults: z
    .number()
    .int()
    .min(1)
    .max(40)
    .optional()
    .describe("Cantidad de resultados (1 a 40)."),
  orderBy: z
    .enum(["relevance", "newest"])
    .optional()
    .describe("Orden de resultados."),
});

export const searchBooksTool = {
  name: "searchBooks",
  description: "Busca libros en Google Books por título, autor o tema.",
  inputSchema: searchBooksSchema,

  async execute(input: z.infer<typeof searchBooksSchema>): Promise<string> {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    console.log("🚀 [searchBooks] Iniciando ejecución...");
    console.log("🔹 Parámetros recibidos:", input);

    if (!apiKey) throw new Error("❌ Falta GOOGLE_BOOKS_API_KEY");

    const results = await searchGoogleBooks({
      query: input.query,
      maxResults: input.maxResults ?? 5,
      orderBy: input.orderBy,
      apiKey,
    });

    console.log(`📚 [searchBooks] Resultados obtenidos (${results.length}):`);
    results.slice(0, 5).forEach((b, i) => {
      console.log(
        `   ${i + 1}. ${b.title} — ${b.authors.join(", ") || "Autor desconocido"} (${b.publishedYear ?? "Año N/D"})`
      );
    });

    if (results.length === 0) {
      console.log("⚠️ [searchBooks] No se encontraron libros.");
      return `No se encontraron libros sobre "${input.query}".`;
    }

    const lista = results
      .slice(0, 5)
      .map(
        (b, i) =>
          `${i + 1}. ${b.title} — ${b.authors.join(", ") || "Autor desconocido"} (${b.publishedYear ?? "Año N/D"})`
      )
      .join("\n");

    const salida = `📚 Libros encontrados sobre "${input.query}":\n${lista}`;
    console.log("✅ [searchBooks] Texto final generado:\n", salida);
    return salida;
  },
};
