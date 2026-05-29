"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/api";
import cartService from "@/lib/services/cart";
import type { Cart } from "@/lib/types";

function QuantityStepper({
  variantId,
  quantity,
  onUpdate,
}: {
  variantId: string;
  quantity: number;
  onUpdate: () => void;
}) {
  const [busy, setBusy] = useState(false);

  async function change(delta: number) {
    setBusy(true);
    try {
      await cartService.updateQuantity(variantId, quantity + delta);
      onUpdate();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center rounded-lg border border-zinc-200 overflow-hidden">
      <button
        type="button"
        onClick={() => change(-1)}
        disabled={busy}
        className="w-9 h-9 flex items-center justify-center text-lg font-bold text-zinc-600 hover:bg-zinc-100 transition-colors disabled:opacity-40"
        aria-label="Restar uno"
      >
        −
      </button>
      <span className="w-10 text-center text-sm font-bold text-zinc-800">{quantity}</span>
      <button
        type="button"
        onClick={() => change(1)}
        disabled={busy}
        className="w-9 h-9 flex items-center justify-center text-lg font-bold text-zinc-600 hover:bg-zinc-100 transition-colors disabled:opacity-40"
        aria-label="Sumar uno"
      >
        +
      </button>
    </div>
  );
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setCart(await cartService.getCart());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  if (loading) return <p className="p-10 text-center text-zinc-500">Cargando carrito...</p>;

  if (!cart || cart.items.length === 0) {
    return (
      <section className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-2 text-zinc-500">Explorá el catálogo y encontrá lo que necesitás.</p>
        <Link
          href="/catalog"
          className="mt-6 inline-block rounded-full bg-[var(--vp-primary)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--vp-primary-dark)] transition-colors"
        >
          Ir al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-zinc-900">Carrito</h1>
      <p className="mt-1 text-sm text-zinc-500">{cart.itemCount} {cart.itemCount === 1 ? "producto" : "productos"}</p>

      <ul className="mt-6 space-y-3">
        {cart.items.map((item) => (
          <li key={item.variantId} className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}${item.imageUrl}`}
                alt={item.productName}
                className="h-20 w-20 rounded-xl object-cover flex-shrink-0 bg-zinc-100"
              />
            ) : (
              <div className="h-20 w-20 rounded-xl bg-zinc-100 flex-shrink-0 flex items-center justify-center text-zinc-400 text-xs">Sin foto</div>
            )}

            <div className="flex flex-1 min-w-0 items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-900 truncate">{item.productName}</p>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">{item.sku}</p>
                <p className="text-xs text-zinc-500 mt-1">{formatPrice(item.unitPrice)} c/u</p>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <p className="font-bold text-zinc-900 text-base">{formatPrice(item.lineTotal)}</p>
                <QuantityStepper
                  variantId={item.variantId}
                  quantity={item.quantity}
                  onUpdate={load}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
        <div className="flex justify-between text-sm text-zinc-500">
          <span>Subtotal productos</span>
          <span>{formatPrice(cart.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-zinc-500">
          <span>Envío</span>
          <span className="text-[var(--vp-primary)] font-medium">Gratis</span>
        </div>
        <div className="flex justify-between font-bold text-zinc-900 text-lg pt-3 border-t border-zinc-100">
          <span>Total</span>
          <span>{formatPrice(cart.subtotal)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="mt-5 block rounded-full bg-[var(--vp-primary)] py-3.5 text-center font-semibold text-white hover:bg-[var(--vp-primary-dark)] transition-colors shadow-sm"
      >
        Finalizar compra →
      </Link>
    </section>
  );
}
