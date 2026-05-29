"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import cartService from "@/lib/services/cart";
import productsService from "@/lib/services/products";
import type { CartItem } from "@/lib/types";

interface ProductCardActionsProps {
  productId: string;
  productName: string;
}

export function ProductCardActions({ productId, productName }: ProductCardActionsProps) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [busy, setBusy] = useState(false);

  function readCart() {
    cartService.getCart().then((c) => setCartItems(c.items));
  }

  useEffect(() => {
    readCart();
    window.addEventListener("cart_updated", readCart);
    return () => window.removeEventListener("cart_updated", readCart);
  }, []);

  const matching = cartItems.filter((i) => i.productName === productName);
  const totalQty = matching.reduce((acc, i) => acc + i.quantity, 0);
  const firstMatch = matching[0];

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (totalQty === 0) {
      setBusy(true);
      try {
        const product = await productsService.getById(productId);
        const skus = product.skus ?? [];
        if (skus.length !== 1) {
          router.push(`/products/${productId}`);
          return;
        }
        const sku = skus[0];
        await cartService.addItem({
          variantId: sku.skuId!,
          productName: product.name ?? productName,
          sku: sku.skuId!,
          attributes: sku.attributes ?? {},
          unitPrice: Number(sku.price) ?? 0,
          imageUrl: product.images?.[0] ?? null,
        }, 1);
      } finally {
        setBusy(false);
      }
      return;
    }
    if (!firstMatch) return;
    setBusy(true);
    try {
      await cartService.updateQuantity(firstMatch.variantId, firstMatch.quantity + 1);
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    if (!firstMatch) return;
    setBusy(true);
    try {
      await cartService.updateQuantity(firstMatch.variantId, firstMatch.quantity - 1);
    } finally {
      setBusy(false);
    }
  }

  if (totalQty === 0) {
    return (
      <button
        type="button"
        onClick={handleAdd}
        disabled={busy}
        className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg border border-[var(--vp-primary)] py-2 text-sm font-semibold text-[var(--vp-primary)] hover:bg-[var(--vp-primary)] hover:text-white transition-colors disabled:opacity-50"
      >
        {busy ? "..." : <><span className="text-base leading-none">+</span> Agregar al carrito</>}
      </button>
    );
  }

  return (
    <div
      className="mt-3 flex items-center justify-between overflow-hidden rounded-lg border border-[var(--vp-primary)]"
      onClick={(e) => e.preventDefault()}
    >
      <button
        type="button"
        onClick={handleRemove}
        disabled={busy}
        className="flex-1 py-2 text-lg font-bold text-[var(--vp-primary)] hover:bg-[var(--vp-primary-light)] transition-colors disabled:opacity-50"
        aria-label="Restar uno"
      >
        −
      </button>
      <span className="min-w-[2.5rem] px-4 text-center text-sm font-bold text-[var(--vp-primary-dark)]">
        {totalQty}
      </span>
      <button
        type="button"
        onClick={handleAdd}
        disabled={busy}
        className="flex-1 py-2 text-lg font-bold text-[var(--vp-primary)] hover:bg-[var(--vp-primary-light)] transition-colors disabled:opacity-50"
        aria-label="Sumar uno"
      >
        +
      </button>
    </div>
  );
}
