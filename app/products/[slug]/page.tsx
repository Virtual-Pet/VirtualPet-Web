import { formatPrice } from "@/lib/api";
import productsService from "@/lib/services/products";
import type { ProductDetailResponse } from "@/lib/api-client";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";

type Props = { params: Promise<{ slug: string }> };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  if (UUID_RE.test(slug)) {
    const byId = await productsService.getById(slug);
    redirect(`/products/${byId.slug}`);
  }

  let product: ProductDetailResponse;
  try {
    product = await productsService.getBySlug(slug);
  } catch {
    notFound();
  }

  const hero = product.variants?.find((v) => v.imageUrl) ?? product.variants?.[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/catalog" className="hover:text-[var(--vp-primary)]">
          Catálogo
        </Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-800">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-[var(--vp-border)] bg-white">
          {hero?.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero.imageUrl} alt={product.name ?? ""} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">Sin imagen</div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-[var(--vp-primary)]">
            {product.petType} · {product.category} · {product.brand}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900">{product.name}</h1>
          <p className="mt-4 leading-relaxed text-zinc-600">{product.description}</p>

          <div className="mt-8 space-y-3">
            <h2 className="text-sm font-semibold text-zinc-900">Variantes disponibles</h2>
            {product.variants?.map((v) => (
              <div key={v.id} className="rounded-xl border border-[var(--vp-border)] bg-white p-4">
                <p className="font-mono text-xs text-zinc-400">{v.sku}</p>
                <p className="mt-1 text-sm text-zinc-600">
                  {v.attributes ? Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(" · ") : ""}
                </p>
                <p className="mt-2 text-xl font-bold text-[var(--vp-primary-dark)]">{formatPrice(v.price ?? 0)}</p>
                <p className="text-xs text-zinc-400">{(v.stock ?? 0) > 0 ? `${v.stock} en stock` : "Sin stock"}</p>
                <div className="mt-4">
                  <AddToCartButton variantId={v.id ?? ""} disabled={(v.stock ?? 0) <= 0} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
