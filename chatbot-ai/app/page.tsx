'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Sanitiza el texto de entrada ---
  function sanitize(text: string) {
    return text
      .replace(/[<>]/g, '')
      .replace(/script/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  // --- Normaliza texto final (puntuación y espacios) ---
  function normalizeText(text: string) {
    return text
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+([.,;!?])/g, '$1')
      .replace(/([.,;!?])([A-Za-zÁÉÍÓÚáéíóúÑñ])/g, '$1 $2')
      .trim();
  }

  // --- Envío del mensaje ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const sanitized = sanitize(trimmed);

    setMessages((prev) => [...prev, { role: 'user', text: sanitized }]);
    setInput('');
    setIsLoading(true);

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: sanitized }],
      }),
    });

    if (!response.body) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Error en el stream.' },
      ]);
      setIsLoading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let assistantText = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Procesar bloques SSE
      const events = buffer.split('\n\n');
      buffer = events.pop() || '';

      for (const event of events) {
        if (!event.startsWith('data:')) continue;
        const data = event.replace(/^data:\s*/, '');

        if (data === '[DONE]') continue;

        // 🔧 Nueva forma: no eliminamos espacios legítimos
        const cleanData = data
          .replace(/\n+/g, ' ')
          .replace(/\s{2,}/g, ' ');

        assistantText += cleanData.endsWith(' ') ? cleanData : cleanData + ' ';

        // Actualiza el texto mientras se genera
        setMessages((prev) => [
          ...prev.filter((m) => m.role !== 'assistant'),
          { role: 'assistant', text: assistantText },
        ]);
      }
    }

    // Limpieza final del texto
    assistantText = normalizeText(assistantText);
    setMessages((prev) => [
      ...prev.filter((m) => m.role !== 'assistant'),
      { role: 'assistant', text: assistantText },
    ]);

    decoder.decode();
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col max-w-3xl mx-auto p-4 gap-4">
      <h1 className="text-2xl font-semibold text-center mb-2">
        Chatbot con Next.js + AI SDK
      </h1>

      {/* Área de conversación */}
      <section className="flex-1 overflow-y-auto rounded-xl border p-3 space-y-3 bg-slate-50 shadow-inner">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl whitespace-pre-wrap leading-relaxed shadow ${
                m.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              {m.role === 'user' ? '' : <strong>Asistente: </strong>}
              {m.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <p className="italic text-gray-500 text-sm pl-2">
            Asistente escribiendo…
          </p>
        )}
        <div ref={endRef} />
      </section>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribí tu mensaje…"
          className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition"
        >
          Enviar
        </button>
      </form>
    </main>
  );
}
