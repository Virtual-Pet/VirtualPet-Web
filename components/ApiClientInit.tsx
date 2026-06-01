"use client";

import { setupApiClient } from "@/lib/api-client/setup";

// Server and client get separate module instances of the generated `OpenAPI` config.
// layout.tsx (a server component) only configures the server copy, so the browser would
// otherwise keep the production default BASE baked into core/OpenAPI.ts and CORS-fail
// every client-side call. Running setup here — in a client module, at load time, before
// any client fetch — points the browser at NEXT_PUBLIC_API_URL (inlined at build).
setupApiClient();

export function ApiClientInit() {
  return null;
}
