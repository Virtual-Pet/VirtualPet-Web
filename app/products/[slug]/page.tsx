import { formatPrice } from "@/lib/api";
import productsService from "@/lib/services/products";
import type { ProductDetailResponse } from "@/lib/api-client";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";

type Props = { params: Promise<{ slug: string }> };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  let product: ProductDetailResponse | undefined;

  if (UUID_RE.test(slug)) {
    try {
      const byId = await productsService.getById(slug);
      if (byId) {
        product = byId;
        if ((byId as any).slug && (byId as any).slug !== slug && !UUID_RE.test((byId as any).slug)) {
          redirect(`/products/${(byId as any).slug}`);
        }
      }
    } catch {
      // Not found by ID, maybe it's a slug that looks like a UUID (rare but possible)
    }
  }

  if (!product) {
    try {
      product = await productsService.getBySlug(slug);
    } catch {
      notFound();
    }
  }

  const hero = (product as any).images?.[0] || product.variants?.find((v) => v.imageUrl)?.imageUrl || product.variants?.[0]?.imageUrl;
  const skus = (product as any).skus || product.variants || [];

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
          {hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero} alt={product.name ?? ""} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">Sin imagen</div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-[var(--vp-primary)]">
            {product.petType} · {product.category} · {product.brand || (product as any).category}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900">{product.name}</h1>
          <p className="mt-4 leading-relaxed text-zinc-600">{product.description}</p>

          <div className="mt-8 space-y-3">
            <h2 className="text-sm font-semibold text-zinc-900">Variantes disponibles</h2>
            {skus.map((v: any) => (
              <div key={v.id || v.skuId} className="rounded-xl border border-[var(--vp-border)] bg-white p-4">
                <p className="font-mono text-xs text-zinc-400">{v.sku || v.skuId}</p>
                <p className="mt-1 text-sm text-zinc-600">
                  {v.attributes ? Object.entries(typeof v.attributes === "string" ? JSON.parse(v.attributes) : v.attributes).map(([k, val]) => `${k}: ${val}`).join(" · ") : ""}
                </p>
                <p className="mt-2 text-xl font-bold text-[var(--vp-primary-dark)]">{formatPrice(v.price ?? 0)}</p>
                <p className="text-xs text-zinc-400">{v.available !== false && (v.stock ?? 1) > 0 ? "En stock" : "Sin stock"}</p>
                <div className="mt-4">
                  <AddToCartButton 
                    item={{
                      variantId: v.id || v.skuId,
                      productName: product.name ?? "",
                      sku: v.sku || v.skuId,
                      attributes: typeof v.attributes === "string" ? JSON.parse(v.attributes) : (v.attributes ?? {}),
                      unitPrice: v.price ?? 0,
                      imageUrl: v.imageUrl ?? hero ?? ""
                    }} 
                    disabled={v.available === false || (v.stock !== undefined && v.stock <= 0)} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
