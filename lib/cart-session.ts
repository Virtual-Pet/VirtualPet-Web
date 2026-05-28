"use client";

import { safeRandomUUID } from "@/lib/services/checkout";

const KEY = "vp_cart_session";

export function getCartSession(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = safeRandomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
