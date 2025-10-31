import { z } from "zod";

/** Esquema de entrada: requiere el ID del libro */
const getBookDetailsSchema = z.object({
  bookId: z.string().min(1).describe("ID único del libro en Google Books."),
});

/** Tipo para los detalles del libro */
export interface GoogleBookDetails {
  id: string;
  title: string;
  authors: string[];
  description?: string;
  pageCount?: number;
  categories?: string[];
  publisher?: string;
  publishedDate?: string;
  averageRating?: number;
  ratingsCount?: number;
  thumbnail?: string;
  language?: string;
}

/** Tool: obtiene información detallada de un libro por su ID */
export const getBookDetailsTool = {
  name: "getBookDetails",
  description: "Obtiene información detallada de un libro a partir de su Google Books ID.",
  inputSchema: getBookDetailsSchema,
  async execute(input: z.infer<typeof getBookDetailsSchema>): Promise<GoogleBookDetails> {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    if (!apiKey) throw new Error("Falta GOOGLE_BOOKS_API_KEY");

    const url = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(input.bookId)}?key=${apiKey}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Error al obtener detalles del libro: ${res.statusText}`);
    }

    const data = await res.json();

    const info = data?.volumeInfo ?? {};
    const images = info?.imageLinks ?? {};

    return {
      id: data?.id ?? input.bookId,
      title: info?.title ?? "Título desconocido",
      authors: Array.isArray(info.authors) ? info.authors : [],
      description: info?.description,
      pageCount: info?.pageCount,
      categories: Array.isArray(info.categories) ? info.categories : [],
      publisher: info?.publisher,
      publishedDate: info?.publishedDate,
      averageRating: info?.averageRating,
      ratingsCount: info?.ratingsCount,
      thumbnail: images.thumbnail || images.smallThumbnail,
      language: info?.language,
    };
  },
};
