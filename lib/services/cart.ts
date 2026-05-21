import { api } from "@/lib/api";
import { getCartSession } from "@/lib/cart-session";

export type CartItem = {
  variantId: string;
  productName: string;
  sku: string;
  attributes: any;
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

export async function getCart(): Promise<Cart> {
  const sessionId = getCartSession();
  try {
    return await api<Cart>("/api/v1/cart", { cartSession: sessionId });
  } catch {
    return { items: [], subtotal: 0, itemCount: 0 };
  }
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
  const sessionId = getCartSession();
  return await api<Cart>("/api/v1/cart/items", {
    method: "POST",
    cartSession: sessionId,
    body: JSON.stringify({
      variantId: item.variantId,
      productName: item.productName,
      sku: item.sku,
      attributes: item.attributes,
      quantity,
      unitPrice: item.unitPrice,
      imageUrl: item.imageUrl,
    }),
  });
}

export async function removeItem(variantId: string): Promise<Cart> {
  const sessionId = getCartSession();
  return await api<Cart>(`/api/v1/cart/items/${variantId}`, {
    method: "DELETE",
    cartSession: sessionId,
  });
}

export const cartService = { getCart, addItem, removeItem };
export default cartService;
