"use client";

import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

function getOrCreateSessionId(): string {
  const key = "chatSessionId";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

function getAuthToken(): string | null {
  return localStorage.getItem("vp_token");
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || streaming) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setStreaming(true);

    const sessionId = getOrCreateSessionId();
    const token = getAuthToken();

    const params = new URLSearchParams({ sessionId, message: text });
    const url = `${API_URL}/api/v1/chat/stream?${params.toString()}`;

    const headers: Record<string, string> = { Accept: "text/event-stream" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    setMessages((prev) => [...prev, { role: "assistant", text: "" }]);

    try {
      const res = await fetch(url, { headers });
      if (!res.ok || !res.body) throw new Error("Error en la respuesta del servidor");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // SSE chunks: "data: <text>\n\n"
        const raw = decoder.decode(value, { stream: true });
        const lines = raw.split("\n");
        for (const line of lines) {
          if (line.startsWith("data:")) {
            const chunk = line.slice(5).trim();
            if (chunk && chunk !== "[DONE]") {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  text: updated[updated.length - 1].text + chunk,
                };
                return updated;
              });
            }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          text: "Hubo un error al procesar tu consulta. Intentá nuevamente.",
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir chat de soporte"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[var(--vp-primary)] hover:bg-[var(--vp-primary-dark)] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        )}
      </button>

      {/* Panel de chat */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl border border-[var(--vp-border)] flex flex-col overflow-hidden"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.15)", maxHeight: "520px" }}>

          {/* Header */}
          <div className="px-5 py-4 bg-[var(--vp-primary)] text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm">Soporte Virtual Pet</p>
              <p className="text-xs text-white/70">Respondemos al instante</p>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm" style={{ minHeight: "280px" }}>
            {messages.length === 0 && (
              <p className="text-center text-[var(--vp-muted)] text-xs mt-8">
                Hola! Podés consultarme sobre entregas, horarios o solicitar factura para tus órdenes.
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[var(--vp-primary)] text-white rounded-tr-sm"
                      : "bg-slate-100 text-slate-800 rounded-tl-sm"
                  }`}
                >
                  {msg.text}
                  {msg.role === "assistant" && streaming && i === messages.length - 1 && (
                    <span className="inline-block w-1.5 h-4 bg-slate-400 ml-0.5 animate-pulse align-middle" />
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-[var(--vp-border)] flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribí tu consulta..."
              rows={1}
              disabled={streaming}
              className="flex-1 resize-none rounded-xl border border-[var(--vp-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--vp-primary)] disabled:opacity-50"
              style={{ maxHeight: "96px" }}
            />
            <button
              onClick={sendMessage}
              disabled={streaming || !input.trim()}
              className="px-3 py-2 rounded-xl bg-[var(--vp-primary)] hover:bg-[var(--vp-primary-dark)] text-white disabled:opacity-40 transition-colors flex-shrink-0"
              aria-label="Enviar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
