import { OpenAPI } from "./core/OpenAPI";
import { getToken } from "@/lib/auth";

export function setupApiClient() {
  const rawBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");
  OpenAPI.BASE = rawBase.endsWith("/api/v1") ? rawBase : `${rawBase}/api/v1`;
  OpenAPI.TOKEN = async () => {
    return getToken() || "";
  };
}

setupApiClient();

