'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { nanoid } from 'nanoid';

export default function Home() {
  // 🟢 Versión básica y 100 % compatible con AI SDK v5/v4
  const { messages, sendMessage, status, error } = useChat();

  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
    console.log('📩 Mensajes actualizados:', messages);
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    // Formato correcto en tu versión → usa "parts"
    await sendMessage({
      id: nanoid(),
      role: 'user',
      parts: [{ type: 'text', text: trimmed }],
    });

    setInput('');
  };

  return (
    <main className="min-h-screen flex flex-col max-w-3xl mx-auto p-4 gap-4">
      <h1 className="text-2xl font-semibold">Chatbot (AI SDK v5)</h1>

      {/* 💬 Mensajes */}
      <section className="flex-1 overflow-y-auto rounded-xl border p-3 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.role === 'user' ? 'text-right' : 'text-left'}
          >
            <div
              className={`inline-block px-3 py-2 rounded-lg whitespace-pre-wrap ${
                m.role === 'user' ? 'bg-slate-200' : 'bg-slate-100'
              }`}
            >
              <strong>{m.role === 'user' ? 'Tú' : 'Asistente'}:</strong>{' '}
              {m.parts
                ?.filter((p) => p.type === 'text')
                .map((p, i) => (
                  <span key={i}>{p.text}</span>
                ))}
            </div>
          </div>
        ))}

        {status === 'streaming' && (
          <p className="italic text-slate-500">Asistente escribiendo…</p>
        )}
        {error && <p className="text-red-600">{(error as Error).message}</p>}

        <div ref={endRef} />
      </section>

      {/* 🧾 Formulario */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribí tu mensaje…"
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          disabled={status === 'streaming'}
          className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </main>
  );
}
