"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/api";
import { ProductSummary } from "@/lib/api-client";
import { ProductCardActions } from "@/components/ProductCardActions";

export function ProductCard({ product }: { product: ProductSummary }) {
  const hasVariants = (product.skuCount ?? 0) > 1;

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--vp-border)] bg-white transition-shadow"
      style={{ boxShadow: "var(--vp-shadow-sm)" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--vp-shadow)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--vp-shadow-sm)")}
    >
      <Link href={`/products/${product.id}`} className="flex flex-col flex-1">
        <div className="aspect-square bg-zinc-100">
          {product.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}${product.thumbnail}`}
              alt={product.name ?? ""}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">Sin imagen</div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4 pb-0">
          <p className="text-xs uppercase tracking-wide text-[var(--vp-accent)]">
            {product.petType} · {product.brand || product.category}
          </p>
          <h3 className="font-semibold text-zinc-900">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-[var(--vp-muted)]">{product.description}</p>
          <p className="mt-auto pt-2 text-lg font-bold text-[var(--vp-primary-dark)]">
            {hasVariants ? "desde " : ""}{formatPrice(Number(product.basePrice ?? "0"))}
          </p>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <ProductCardActions productId={String(product.id)} productName={product.name ?? ""} />
      </div>
    </div>
  );
}
