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
  // El SDK espera `inputSchema`
  inputSchema: searchBooksSchema,
  // Función ejecutora
  async execute(input: z.infer<typeof searchBooksSchema>): Promise<GoogleBookBasic[]> {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    console.log("🛠 Ejecutando searchBooks con:", input);
    if (!apiKey) throw new Error("Falta GOOGLE_BOOKS_API_KEY");

    const results = await searchGoogleBooks({
      query: input.query,
      maxResults: input.maxResults,
      orderBy: input.orderBy,
      apiKey,
    });
    return results;
  },
};
