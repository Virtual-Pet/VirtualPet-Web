import { OpenAPI } from "./core/OpenAPI";
import { getToken } from "@/lib/auth";

export function setupApiClient() {
  OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  OpenAPI.TOKEN = async () => {
    return getToken() || "";
  };
}
