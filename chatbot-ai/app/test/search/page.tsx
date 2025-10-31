"use client";

import { useState } from "react";
import Image from "next/image";

type Book = {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  publishedYear?: string;
};

export default function TestSearchPage() {
  const [q, setQ] = useState("ciencia ficción");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools/search-books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, maxResults: 8, orderBy: "relevance" }),
      });

      const json: { ok: boolean; data?: Book[]; error?: string } = await res.json();
      if (!json.ok) throw new Error(json.error || "Error desconocido");
      setData(json.data || []);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Probar searchBooks</h1>

      <form onSubmit={onSearch} className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          placeholder="Buscar libros…"
        />
        <button
          className="rounded px-4 py-2 border"
          disabled={loading}
          type="submit"
        >
          {loading ? "Buscando…" : "Buscar"}
        </button>
      </form>

      {error && <p className="text-red-600">Error: {error}</p>}

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.map((b) => (
          <li key={b.id} className="border rounded p-3 flex gap-3">
            {b.thumbnail && (
              <Image
                src={b.thumbnail}
                alt={b.title}
                width={80}
                height={120}
                quality={90}
                className="object-cover rounded"
              />
            )}
            <div>
              <div className="font-medium">{b.title}</div>
              <div className="text-sm text-gray-600">
                {b.authors?.join(", ") || "Autor desconocido"}
              </div>
              <div className="text-xs text-gray-500">
                {b.publishedYear || ""}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
