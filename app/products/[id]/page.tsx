import { formatPrice } from "@/lib/api";
import productsService from "@/lib/services/products";
import type { Product, Sku } from "@/lib/api-client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  let product: Product | undefined;

  try {
    product = await productsService.getById(id);
  } catch {
    notFound();
  }

  if (!product) {
    notFound();
  }

  const hero = product.images?.[0] || "";
  const skus: Sku[] = product.skus || [];

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
            {product.petType} · {product.category}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900">{product.name}</h1>
          <p className="mt-4 leading-relaxed text-zinc-600">{product.description}</p>

          <div className="mt-8 space-y-3">
            <h2 className="text-sm font-semibold text-zinc-900">Variantes disponibles</h2>
            {skus.map((v) => (
              <div key={v.skuId} className="rounded-xl border border-[var(--vp-border)] bg-white p-4">
                <p className="mt-1 text-sm text-zinc-600">

                  {v.attributes ? Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(" · ") : ""}
                </p>
                <p className="mt-2 text-xl font-bold text-[var(--vp-primary-dark)]">{formatPrice(Number(v.price) ?? 0)}</p>
                <p className="text-xs text-zinc-400">{v.available ? "En stock" : "Sin stock"}</p>
                <div className="mt-4">
                  <AddToCartButton 
                    item={{
                      variantId: v.skuId!,
                      productName: product!.name ?? "",
                      sku: v.skuId!,
                      attributes: v.attributes ?? {},
                      unitPrice: Number(v.price) ?? 0,
                      imageUrl: hero
                    }} 
                    disabled={!v.available} 
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
