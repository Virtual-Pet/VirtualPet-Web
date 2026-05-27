import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";

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

const CART_KEY = "vp_mock_cart";

function loadLocalCart(): Cart {
  if (typeof window === "undefined") return { items: [], subtotal: 0, itemCount: 0 };
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return { items: [], subtotal: 0, itemCount: 0 };
  try {
    return JSON.parse(raw);
  } catch {
    return { items: [], subtotal: 0, itemCount: 0 };
  }
}

function saveLocalCart(cart: Cart) {
  if (typeof window !== "undefined") {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
}

function recalculateTotals(cart: Cart) {
  cart.subtotal = cart.items.reduce((acc, item) => acc + item.lineTotal, 0);
  cart.itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
}

export async function getCart(): Promise<Cart> {
  return loadLocalCart();
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
  const cart = loadLocalCart();
  const existing = cart.items.find((i) => i.variantId === item.variantId);
  const newTotalQuantity = (existing?.quantity || 0) + quantity;

  const token = getToken();
  if (token) {
    try {
      await api(`/api/v1/cart/items/${item.variantId}`, {
        method: "PUT",
        token,
        body: JSON.stringify({ quantity: newTotalQuantity }),
      });
    } catch (e) {
      console.error("Failed to sync cart item to backend", e);
      throw new Error("No se pudo agregar al carrito en el servidor");
    }
  }

  if (existing) {
    existing.quantity = newTotalQuantity;
    existing.lineTotal = existing.quantity * existing.unitPrice;
  } else {
    cart.items.push({
      variantId: item.variantId,
      productName: item.productName,
      sku: item.sku,
      attributes: item.attributes,
      quantity: newTotalQuantity,
      unitPrice: item.unitPrice,
      lineTotal: item.unitPrice * newTotalQuantity,
      imageUrl: item.imageUrl ?? null,
    });
  }
  
  recalculateTotals(cart);
  saveLocalCart(cart);
  
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart_updated"));
  }
  
  return cart;
}

export async function removeItem(variantId: string): Promise<Cart> {
  const token = getToken();
  if (token) {
    try {
      await api(`/api/v1/cart/items/${variantId}`, {
        method: "DELETE",
        token,
      });
    } catch (e) {
      console.error("Failed to remove cart item from backend", e);
    }
  }

  const cart = loadLocalCart();
  cart.items = cart.items.filter((i) => i.variantId !== variantId);
  recalculateTotals(cart);
  saveLocalCart(cart);
  
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart_updated"));
  }
  
  return cart;
}

export const cartService = { getCart, addItem, removeItem };
export default cartService;
