"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      router.push("/catalog");
      return;
    }
    router.push(`/catalog?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="¿Qué estás buscando?"
        className="flex-1 rounded-full border-2 border-[var(--vp-primary)] px-5 py-3 text-base text-zinc-900 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-[var(--vp-primary)]/30"
        autoFocus
      />
      <button
        type="submit"
        className="rounded-full bg-[var(--vp-primary)] px-6 py-3 font-semibold text-white hover:bg-[var(--vp-primary-dark)] transition"
      >
        Buscar
      </button>
    </form>
  );
}
