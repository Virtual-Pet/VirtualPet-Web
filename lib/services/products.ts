import { CatalogService } from "@/lib/api-client";

export const productsService = {
  list: (query = "") => {
    const params = new URLSearchParams(query);
    return CatalogService.getProducts(
      params.get("q") ?? undefined,
      params.get("category") ?? undefined,
      params.get("petType") ?? undefined,
      params.get("minPrice") ?? undefined,
      params.get("maxPrice") ?? undefined,
      params.get("cursor") ?? undefined,
      params.has("limit") ? Number(params.get("limit")) : 20
    );
  },
  getById: (id: string) => CatalogService.getProducts1(id),
};

export default productsService;
