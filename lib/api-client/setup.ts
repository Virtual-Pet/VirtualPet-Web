import { OpenAPI } from "./core/OpenAPI";
import { getToken } from "@/lib/auth";

export function setupApiClient() {
  const rawBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");
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

