export type GoogleBookBasic = {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  publishedYear?: string;
};

const GOOGLE_BOOKS_BASE = "https://www.googleapis.com/books/v1/volumes";

export async function searchGoogleBooks(params: {
  query: string;
  maxResults?: number;
  orderBy?: "relevance" | "newest";
  apiKey: string;
}): Promise<GoogleBookBasic[]> {
  const { query, maxResults = 10, orderBy = "relevance", apiKey } = params;

  const url = new URL(GOOGLE_BOOKS_BASE);
  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", String(Math.min(Math.max(maxResults, 1), 40)));
  url.searchParams.set("orderBy", orderBy);
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Google Books error ${res.status}: ${text}`);
  }

  const data: unknown = await res.json();
  if (
    typeof data !== "object" ||
    data === null ||
    !("items" in data) ||
    !Array.isArray((data as { items: unknown }).items)
  ) {
    return [];
  }

  const items = (data as { items: unknown[] }).items;

  return items.map((it): GoogleBookBasic => {
    const item = it as Record<string, unknown>;
    const info = (item.volumeInfo ?? {}) as Record<string, unknown>;
    const images = (info.imageLinks ?? {}) as Record<string, string>;

    return {
      id: String(item.id ?? ""),
      title: String(info.title ?? "Sin título"),
      authors: Array.isArray(info.authors)
        ? (info.authors as string[])
        : [],
      thumbnail: images.thumbnail || images.smallThumbnail,
      publishedYear:
        typeof info.publishedDate === "string"
          ? info.publishedDate.slice(0, 4)
          : undefined,
    };
  });
}
