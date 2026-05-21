import { CatalogControllerService } from "@/lib/api-client";

export const productsService = {
  list: (query = "") => {
    const params = new URLSearchParams(query);
    return CatalogControllerService.list(
      params.get("q") ?? undefined,
      params.get("category") ?? undefined,
      params.get("petType") ?? undefined,
      params.get("brand") ?? undefined,
      params.has("minPrice") ? Number(params.get("minPrice")) : undefined,
      params.has("maxPrice") ? Number(params.get("maxPrice")) : undefined,
      params.get("sort") ?? undefined,
      params.has("page") ? Number(params.get("page")) : undefined,
      params.has("size") ? Number(params.get("size")) : undefined
    );
  },
  facets: () => CatalogControllerService.facets(),
  getById: (id: string) => CatalogControllerService.get(id),
  getBySlug: (slug: string) => CatalogControllerService.getBySlug(slug),
};

export default productsService;
