import type { Cart, CartItem } from "@/lib/types";

const STORAGE_KEY = "vp_mock_cart";

function defaultCart(): Cart {
  return { items: [], subtotal: 0, itemCount: 0 } as Cart;
}

function isClient() {
  return typeof window !== "undefined";
}

function readCart(): Cart {
  if (!isClient()) return defaultCart();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Cart) : defaultCart();
  } catch {
    return defaultCart();
  }
}

function writeCart(cart: Cart) {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export async function getCart(): Promise<Cart> {
  return Promise.resolve(readCart());
}

export async function addItem(variantId: string, quantity = 1): Promise<Cart> {
  const cart = readCart();
  const existing = cart.items.find((i) => i.variantId === variantId);
  if (existing) existing.quantity += quantity;
  else
    cart.items.push({ variantId, productName: "Producto agregado", sku: variantId, quantity, unitPrice: 0, lineTotal: 0, imageUrl: null } as CartItem);
  
  cart.subtotal = cart.items.reduce((s, it) => s + it.lineTotal, 0);
  writeCart(cart);
  return Promise.resolve(cart);
}

export async function removeItem(variantId: string): Promise<Cart> {
  const cart = readCart();
  cart.items = cart.items.filter((i) => i.variantId !== variantId);
  cart.subtotal = cart.items.reduce((s, it) => s + it.lineTotal, 0);
  writeCart(cart);
  return Promise.resolve(cart);
}

export const cartService = { getCart, addItem, removeItem };

export default cartService;
