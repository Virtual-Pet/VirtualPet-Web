import { CartService } from "@/lib/api-client";
import type { Cart as ApiCart } from "@/lib/api-client";

export type CartItem = {
  variantId: string;
  productName: string;
  sku: string;
  attributes: Record<string, string>;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl: string | null;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
};

function toCart(backend: ApiCart): Cart {
  const items: CartItem[] = (backend.items ?? []).map((i) => ({
    variantId: i.skuId ?? "",
    productName: i.productName ?? "",
    sku: i.sku ?? "",
    attributes: i.attributes ?? {},
    quantity: i.quantity ?? 0,
    unitPrice: i.unitPrice ? Number(i.unitPrice) : 0,
    lineTotal: i.subtotal ? Number(i.subtotal) : 0,
    imageUrl: i.imageUrl ?? null,
  }));
  const subtotal = backend.totals?.grandTotal ? Number(backend.totals.grandTotal) : 0;
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  return { items, subtotal, itemCount };
}

function emitCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart_updated"));
  }
}

// The cart is resolved per request: the bearer token (injected by the API client) identifies
// an authenticated user's cart, and otherwise the backend-set HttpOnly CART_SESSION cookie
// (carried via credentials: "include") identifies the anonymous cart. No client-side session id.
export async function getCart(): Promise<Cart> {
  const backend = await CartService.getCart();
  return toCart(backend);
}

export type AddItemPayload = {
  variantId: string;
  productName: string;
  sku: string;
  attributes: Record<string, string>;
  unitPrice: number;
  imageUrl?: string | null;
};

export async function addItem(item: AddItemPayload, quantity = 1): Promise<Cart> {
  const cart = await getCart();
  const existing = cart.items.find((i) => i.variantId === item.variantId);
  const newTotalQuantity = (existing?.quantity ?? 0) + quantity;

  await CartService.putCartItems(item.variantId, { quantity: newTotalQuantity });

  const updated = await getCart();
  emitCartUpdated();
  return updated;
}

export async function removeItem(variantId: string): Promise<Cart> {
  await CartService.deleteCartItems(variantId);

  const updated = await getCart();
  emitCartUpdated();
  return updated;
}

export async function updateQuantity(variantId: string, newQuantity: number): Promise<Cart> {
  if (newQuantity <= 0) {
    return removeItem(variantId);
  }

  await CartService.putCartItems(variantId, { quantity: newQuantity });

  const updated = await getCart();
  emitCartUpdated();
  return updated;
}

export const cartService = { getCart, addItem, removeItem, updateQuantity };
export default cartService;
