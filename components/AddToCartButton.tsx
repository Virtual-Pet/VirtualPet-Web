"use client";

import { useState } from "react";
import cartService from "@/lib/services/cart";
import { getCartSession } from "@/lib/cart-session";
import { getToken } from "@/lib/auth";


import { AddItemPayload } from "@/lib/services/cart";

export function AddToCartButton({ item, disabled }: { item: AddItemPayload; disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function add() {
    setLoading(true);
    try {
      await cartService.addItem(item, 1);
      setDone(true);
    } catch {
      alert("No se pudo agregar al carrito");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={add}
      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
    >
      {done ? "Agregado ✓" : loading ? "..." : "Agregar al carrito"}
    </button>
  );
}
