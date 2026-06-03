import { OpenAPI } from "./core/OpenAPI";
import { getToken } from "@/lib/auth";

export function setupApiClient() {
  const isServer = typeof window === "undefined";
  // Server (RSC/SSR): reach the backend directly via an internal, runtime-only URL.
  // Browser: use the front's own origin (NEXT_PUBLIC_API_URL) so the nginx /api/ proxy
  // makes cart calls same-origin and the CART_SESSION cookie is first-party.
  const raw = isServer
    ? process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const rawBase = raw.replace(/\/$/, "");
  OpenAPI.BASE = rawBase.endsWith("/api/v1") ? rawBase : `${rawBase}/api/v1`;
  // Carry the backend-set HttpOnly CART_SESSION cookie on every request so anonymous
  // carts are resolved per the spec (the cookie identifies the guest cart, not a header).
  OpenAPI.WITH_CREDENTIALS = true;
  OpenAPI.CREDENTIALS = "include";
  OpenAPI.TOKEN = async () => {
    return getToken() || "";
  };
}

setupApiClient();

