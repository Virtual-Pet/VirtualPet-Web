"use client";

import { useEffect, useState } from "react";
import cartService from "@/lib/services/cart";
import type { AddItemPayload } from "@/lib/services/cart";

export function AddToCartButton({ item, disabled }: { item: AddItemPayload; disabled?: boolean }) {
  const [qty, setQty] = useState(0);
  const [busy, setBusy] = useState(false);

  function readCart() {
    cartService.getCart().then((c) => {
      const found = c.items.find((i) => i.variantId === item.variantId);
      setQty(found?.quantity ?? 0);
    });
  }

  useEffect(() => {
    readCart();
    window.addEventListener("cart_updated", readCart);
    return () => window.removeEventListener("cart_updated", readCart);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.variantId]);

  async function handleAdd() {
    setBusy(true);
    try {
      await cartService.addItem(item, 1);
    } catch {
      alert("No se pudo agregar al carrito");
    } finally {
      setBusy(false);
    }
  }

  async function handleInc() {
    setBusy(true);
    try {
      await cartService.updateQuantity(item.variantId, qty + 1);
    } finally {
      setBusy(false);
    }
  }

  async function handleDec() {
    setBusy(true);
    try {
      await cartService.updateQuantity(item.variantId, qty - 1);
    } finally {
      setBusy(false);
    }
  }

  if (disabled) {
    return (
      <button disabled className="rounded-lg bg-[var(--vp-primary)] px-4 py-2 text-sm font-medium text-white opacity-50">
        Sin stock
      </button>
    );
  }

  if (qty === 0) {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={handleAdd}
        className="rounded-lg bg-[var(--vp-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--vp-primary-dark)] transition-colors disabled:opacity-50"
      >
        {busy ? "..." : "Agregar al carrito"}
      </button>
    );
  }

  return (
    <div className="flex w-fit items-center overflow-hidden rounded-lg border border-[var(--vp-primary)]">
      <button
        type="button"
        onClick={handleDec}
        disabled={busy}
        className="px-3 py-2 text-lg font-bold text-[var(--vp-primary)] hover:bg-[var(--vp-primary-light)] transition-colors disabled:opacity-50"
        aria-label="Restar uno"
      >
        −
      </button>
      <span className="min-w-[2.5rem] px-4 text-center text-sm font-bold text-[var(--vp-primary-dark)]">
        {qty}
      </span>
      <button
        type="button"
        onClick={handleInc}
        disabled={busy}
        className="px-3 py-2 text-lg font-bold text-[var(--vp-primary)] hover:bg-[var(--vp-primary-light)] transition-colors disabled:opacity-50"
        aria-label="Sumar uno"
      >
        +
      </button>
    </div>
  );
}
