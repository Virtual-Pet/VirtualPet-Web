"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { PawPrint, ShoppingCart, Search } from "lucide-react";
import { clearAuth, getUser, type User } from "@/lib/auth";

export function SiteHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getUser());
  }, []);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--vp-border)] bg-white" style={{ boxShadow: "var(--vp-shadow-sm)" }}>
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-[var(--vp-primary-dark)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--vp-primary)] text-white">
              <PawPrint size={18} strokeWidth={2.5} />
            </span>
            Virtual Pet
          </Link>

          <form onSubmit={onSearch} className="order-3 w-full flex-1 md:order-none md:max-w-md lg:max-w-xl">
            <div className="relative">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full rounded-full border border-[var(--vp-border)] bg-[var(--background)] py-2.5 pr-4 pl-10 text-sm outline-none focus:border-[var(--vp-primary)] focus:ring-2 focus:ring-[var(--vp-primary-light)]"
              />
              <Search
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--vp-muted)]"
              />
            </div>
          </form>

          <nav className="ml-auto flex items-center gap-3 text-sm font-medium text-zinc-700">
            <Link href="/catalog" className="hidden sm:inline hover:text-[var(--vp-primary)]">
              Catálogo
            </Link>
            <Link href="/about" className="hidden sm:inline hover:text-[var(--vp-primary)]">
              Nosotros
            </Link>
            <Link href="/cart" className="flex items-center gap-1.5 hover:text-[var(--vp-primary)]">
              <ShoppingCart size={17} strokeWidth={2} />
              <span className="hidden sm:inline">Carrito</span>
            </Link>
            {user ? (
              <>
                <Link href="/account/orders" className="hover:text-[var(--vp-primary)]">
                  Pedidos
                </Link>
                <span className="hidden max-w-[8rem] truncate text-[var(--vp-muted)] md:inline">{user.name}</span>
                <button
                  type="button"
                  className="text-red-600 hover:underline"
                  onClick={() => {
                    clearAuth();
                    setUser(null);
                    window.dispatchEvent(new Event("cart_updated"));
                    router.push("/");
                  }}
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-[var(--vp-primary)]">
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-[var(--vp-primary)] px-4 py-2 text-white hover:bg-[var(--vp-primary-dark)] transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </nav>
        </div>

        <nav className="mt-3 hidden gap-4 overflow-x-auto border-t border-[var(--vp-border)] pt-3 text-xs font-medium text-[var(--vp-muted)] md:flex">
          <Link href="/catalog?petType=perro" className="whitespace-nowrap hover:text-[var(--vp-primary)]">
            Perros
          </Link>
          <Link href="/catalog?petType=gato" className="whitespace-nowrap hover:text-[var(--vp-primary)]">
            Gatos
          </Link>
          <Link href="/catalog?category=alimentos" className="whitespace-nowrap hover:text-[var(--vp-primary)]">
            Alimentos
          </Link>
          <Link href="/catalog?category=juguetes" className="whitespace-nowrap hover:text-[var(--vp-primary)]">
            Juguetes
          </Link>
          <Link href="/catalog?category=higiene" className="whitespace-nowrap hover:text-[var(--vp-primary)]">
            Higiene
          </Link>
          <Link href="/catalog?category=camas" className="whitespace-nowrap hover:text-[var(--vp-primary)]">
            Camas
          </Link>
        </nav>
      </div>
    </header>
  );
}
