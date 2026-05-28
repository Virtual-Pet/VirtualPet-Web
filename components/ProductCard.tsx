import Link from "next/link";
import { formatPrice } from "@/lib/api";
import { ProductSummary } from "@/lib/api-client";

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
    >
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
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs uppercase tracking-wide text-[var(--vp-primary)]">
          {product.petType} · {product.brand || product.category}
        </p>
        <h3 className="font-semibold text-zinc-900">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-zinc-500">{product.description}</p>
        <p className="mt-auto pt-2 text-lg font-bold text-[var(--vp-primary-dark)]">
          desde {formatPrice(Number(product.basePrice ?? product.basePrice ?? "0"))}
        </p>
      </div>
    </Link>
  );
}

