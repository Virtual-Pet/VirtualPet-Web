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
      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
        <div className="mb-6 lg:mb-0">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-zinc-100" />}>
             <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold text-zinc-900">Filtros (Deshabilitados)</h3>
              <p className="text-sm text-zinc-500 mt-2">Los filtros por facetas no están disponibles en la nueva API.</p>
             </div>
          </Suspense>
        </div>

        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">Catálogo</h1>
              <p className="mt-1 text-sm text-zinc-500">{(catalog.data || []).length} productos en esta página</p>
            </div>
            <form method="get" className="flex flex-wrap items-center gap-2">
              {params.q && <input type="hidden" name="q" value={params.q} />}
              {params.category && <input type="hidden" name="category" value={params.category} />}
              {params.petType && <input type="hidden" name="petType" value={params.petType} />}
              {params.minPrice && <input type="hidden" name="minPrice" value={params.minPrice} />}
              {params.maxPrice && <input type="hidden" name="maxPrice" value={params.maxPrice} />}
              
              <button type="submit" className="rounded-lg bg-[var(--vp-primary)] px-3 py-1.5 text-sm text-white">
                Aplicar
              </button>
            </form>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {(catalog.data || []).map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {(catalog.data || []).length === 0 && (
            <p className="mt-12 text-center text-zinc-500">No hay productos con esos filtros.</p>
          )}

          <div className="mt-10 flex justify-center gap-2">
            {cursor && (
              <Link href={homeHref()} className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-zinc-50">
                ← Volver al inicio
              </Link>
            )}
            {catalog.hasMore && catalog.nextCursor && (
              <Link href={nextHref(catalog.nextCursor)} className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-zinc-50">
                Siguiente →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
