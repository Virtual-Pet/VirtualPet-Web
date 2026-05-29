import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { getCartSession } from "@/lib/cart-session";

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

type BackendCartItem = {
  skuId: string;
  sku: string;
  productId: string;
  productName: string;
  brand: string;
  attributes: Record<string, string>;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  available: boolean;
};

type BackendCart = {
  items: BackendCartItem[];
  totals: { items: number; shipping: number; grandTotal: number };
  currency: string;
};

function toCart(backend: BackendCart): Cart {
  const items: CartItem[] = backend.items.map((i) => ({
    variantId: i.skuId,
    productName: i.productName,
    sku: i.sku,
    attributes: i.attributes ?? {},
    quantity: i.quantity,
    unitPrice: i.unitPrice,
    lineTotal: i.subtotal,
    imageUrl: i.imageUrl,
  }));
  const subtotal = backend.totals.grandTotal;
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  return { items, subtotal, itemCount };
}

function emitCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart_updated"));
  }
}

export async function getCart(): Promise<Cart> {
  const token = getToken();
  if (token) {
    const backend = await api<BackendCart>("/cart", { token });
    return toCart(backend);
  }
  const sessionId = getCartSession();
  if (!sessionId) return { items: [], subtotal: 0, itemCount: 0 };
  const backend = await api<BackendCart>(`/cart/session/${sessionId}`);
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
  const token = getToken();

  const cart = await getCart();
  const existing = cart.items.find((i) => i.variantId === item.variantId);
  const newTotalQuantity = (existing?.quantity ?? 0) + quantity;

  if (token) {
    await api(`/cart/items/${item.variantId}`, {
      method: "PUT",
      token,
      body: JSON.stringify({ quantity: newTotalQuantity }),
    });
  } else {
    const sessionId = getCartSession();
    await api(`/cart/session/${sessionId}/items/${item.variantId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity: newTotalQuantity }),
    });
  }

  const updated = await getCart();
  emitCartUpdated();
  return updated;
}

export async function removeItem(variantId: string): Promise<Cart> {
  const token = getToken();

  if (token) {
    await api(`/cart/items/${variantId}`, { method: "DELETE", token });
  } else {
    const sessionId = getCartSession();
    await api(`/cart/session/${sessionId}/items/${variantId}`, { method: "DELETE" });
  }

  const updated = await getCart();
  emitCartUpdated();
  return updated;
}

export async function updateQuantity(variantId: string, newQuantity: number): Promise<Cart> {
  if (newQuantity <= 0) {
    return removeItem(variantId);
  }

  const token = getToken();

  if (token) {
    await api(`/cart/items/${variantId}`, {
      method: "PUT",
      token,
      body: JSON.stringify({ quantity: newQuantity }),
    });
  } else {
    const sessionId = getCartSession();
    await api(`/cart/session/${sessionId}/items/${variantId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity: newQuantity }),
    });
  }

  const updated = await getCart();
  emitCartUpdated();
  return updated;
}

export const cartService = { getCart, addItem, removeItem, updateQuantity };
export default cartService;
