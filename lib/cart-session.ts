"use client";

import { safeRandomUUID } from "@/lib/services/checkout";

const COOKIE_NAME = "vp_cart_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getCartSession(): string {
  if (typeof document === "undefined") return "";

  const existing = getCookie(COOKIE_NAME);
  if (existing) return existing;

  const id = safeRandomUUID();
  document.cookie = `${COOKIE_NAME}=${id}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  return id;
}

export function clearCartSession(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
