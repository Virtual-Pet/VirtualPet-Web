/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Dog, Cat, Beef, Gamepad2 } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import productsService from "@/lib/services/products";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { label: "Perros",    Icon: Dog,      href: "/catalog?category=perros" },
  { label: "Gatos",     Icon: Cat,      href: "/catalog?category=gatos"  },
  { label: "Alimentos", Icon: Beef,     href: "/catalog?q=alimento"      },
  { label: "Juguetes",  Icon: Gamepad2, href: "/catalog?q=juguete"       },
];

export default async function HomePage() {
  const catalog = await productsService.list("limit=8");

  return (
    <>
      {/* Hero */}
      <section className="flex min-h-[75vh] flex-col items-center justify-center bg-white px-4 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--vp-accent)]">
          Mar del Plata
        </p>
        <h1 className="mt-4 text-5xl font-bold text-zinc-900 md:text-6xl">
          Virtual Pet
        </h1>
        <p className="mt-4 max-w-md text-lg text-[var(--vp-muted)]">
          Virtual Pet nunca defraudará a su mascota
        </p>
        <div className="mt-10 w-full max-w-xl">
          <SearchBar />
        </div>
      </section>

      {/* Categorías */}
      <section className="bg-[var(--background)] px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-zinc-900">
            ¿Qué necesita tu mascota?
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CATEGORIES.map(({ label, Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--vp-border)] bg-white p-6 transition hover:border-[var(--vp-primary)] hover:scale-105"
                style={{ boxShadow: "var(--vp-shadow-sm)" }}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--vp-primary-light)] text-[var(--vp-primary)]">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <span className="text-sm font-semibold text-zinc-700">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Más vendidos */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-zinc-900">Más vendidos</h2>
          <Link
            href="/catalog"
            className="text-sm font-medium text-[var(--vp-primary)] hover:underline"
          >
            Ver todos →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(catalog.data || []).map((p: any) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </section>
    </>
  );
}
