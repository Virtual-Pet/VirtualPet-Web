/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductCard } from "@/components/ProductCard";
import productsService from "@/lib/services/products";

import Link from "next/link";
import { Suspense } from "react";

type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    petType?: string;
    minPrice?: string;
    maxPrice?: string;
    cursor?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function CatalogPage({ searchParams }: Props) {
  const params = await searchParams;
  const cursor = params.cursor;
  const query = new URLSearchParams();
  if (cursor) query.set("cursor", cursor);
  query.set("limit", "12");
  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.petType) query.set("petType", params.petType);
  if (params.minPrice) query.set("minPrice", params.minPrice);
  if (params.maxPrice) query.set("maxPrice", params.maxPrice);

  const catalog = await productsService.list(query.toString());

  function nextHref(nextCursor: string) {
    const p = new URLSearchParams();
    Object.entries({ ...params, cursor: nextCursor }).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    return `/catalog?${p.toString()}`;
  }

  function homeHref() {
    const p = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v && k !== 'cursor') p.set(k, v);
    });
    return `/catalog?${p.toString()}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
        {/* Sidebar Filters */}
        <div className="mb-6 lg:mb-0">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-zinc-100" />}>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-6 shadow-sm">
              <div>
                <h3 className="font-semibold text-zinc-900 text-sm uppercase tracking-wider border-b pb-2">Categorías</h3>
                <div className="mt-3 flex flex-col gap-1.5">
                  <Link
                    href="/catalog"
                    className={`text-sm px-3 py-2 rounded-lg transition ${
                      !params.category
                        ? "bg-[var(--vp-primary)] text-white font-medium"
                        : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    Todos los productos
                  </Link>
                  <Link
                    href={`/catalog?category=perros${params.q ? `&q=${params.q}` : ""}`}
                    className={`text-sm px-3 py-2 rounded-lg transition ${
                      params.category === "perros"
                        ? "bg-[var(--vp-primary)] text-white font-medium"
                        : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    Perros
                  </Link>
                  <Link
                    href={`/catalog?category=gatos${params.q ? `&q=${params.q}` : ""}`}
                    className={`text-sm px-3 py-2 rounded-lg transition ${
                      params.category === "gatos"
                        ? "bg-[var(--vp-primary)] text-white font-medium"
                        : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    Gatos
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-900 text-sm uppercase tracking-wider border-b pb-2">Búsqueda rápida</h3>
                <form method="get" action="/catalog" className="mt-3">
                  {params.category && <input type="hidden" name="category" value={params.category} />}
                  <input
                    type="text"
                    name="q"
                    defaultValue={params.q || ""}
                    placeholder="Escribí para buscar..."
                    className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--vp-primary)]"
                  />
                </form>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-900 text-sm uppercase tracking-wider border-b pb-2">Rango de Precio</h3>
                <form method="get" action="/catalog" className="mt-3 space-y-3">
                  {params.category && <input type="hidden" name="category" value={params.category} />}
                  {params.q && <input type="hidden" name="q" value={params.q} />}
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      defaultValue={params.minPrice || ""}
                      placeholder="Mín ($)"
                      className="w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-2 focus:ring-[var(--vp-primary)]"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      defaultValue={params.maxPrice || ""}
                      placeholder="Máx ($)"
                      className="w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-2 focus:ring-[var(--vp-primary)]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[var(--vp-primary)] py-2 text-xs font-semibold text-white hover:bg-[var(--vp-primary-dark)] transition shadow-sm"
                  >
                    Filtrar por Precio
                  </button>
                </form>
              </div>

              {(params.category || params.q || params.minPrice || params.maxPrice) && (
                <Link
                  href="/catalog"
                  className="block text-center text-xs font-semibold text-red-500 hover:text-red-600 transition pt-2 border-t"
                >
                  Limpiar todos los filtros
                </Link>
              )}
            </div>
          </Suspense>
        </div>

        {/* Catalog Grid */}
        <div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">Catálogo de Productos</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {(catalog.data || []).length} productos encontrados en esta sección
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {(catalog.data || []).map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {(catalog.data || []).length === 0 && (
            <div className="mt-16 text-center border border-dashed rounded-2xl p-12 bg-zinc-50/50">
              <span className="text-4xl">🔍</span>
              <p className="mt-3 text-zinc-500 font-medium">No se encontraron productos con el filtro aplicado.</p>
              <Link href="/catalog" className="mt-4 inline-block text-sm text-[var(--vp-primary)] font-semibold hover:underline">
                Restablecer búsqueda
              </Link>
            </div>
          )}

          <div className="mt-10 flex justify-center gap-2">
            {cursor && (
              <Link href={homeHref()} className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-zinc-50 font-medium">
                ← Volver al inicio
              </Link>
            )}
            {catalog.hasMore && catalog.nextCursor && (
              <Link href={nextHref(catalog.nextCursor)} className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-zinc-50 font-medium">
                Siguiente →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
