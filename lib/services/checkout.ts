import { getCart } from "@/lib/services/cart";
import { getToken } from "@/lib/auth";
import { CheckoutService, OpenAPI } from "@/lib/api-client";

export function safeRandomUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Creates a checkout session and sets the shipping address.
 * Does NOT create a payment intent — payment is handled externally
 * (cash on delivery, bank transfer, in-home card payment, etc.).
 */
export async function createCheckout(
  token: string,
  shippingAddress: {
    addressLine: string;
    city: string;
    state?: string;
    country?: string;
    postalCode: string;
  }
): Promise<{ checkoutSessionId: string }> {
  const cart = await getCart();
  if (cart.items.length === 0) {
    throw new Error("El carrito está vacío");
  }

  OpenAPI.TOKEN = token;

  // 1. Create checkout session from current cart
  const session = await CheckoutService.postCartCheckout();
  const sessionId = session.checkoutSessionId!;

  // 2. Set the shipping address
  await CheckoutService.putCheckoutSessionsShippingAddress(sessionId, shippingAddress);

  return { checkoutSessionId: sessionId };
}

/**
 * Places the order by confirming the checkout session.
 * The backend creates the order immediately — no payment verification needed.
 */
export async function placeOrder(sessionId: string): Promise<void> {
  const token = getToken();
  OpenAPI.TOKEN = token || "";

  if (token) {
    const idempotencyKey = safeRandomUUID();
    await CheckoutService.postCheckoutSessionsConfirm(sessionId, idempotencyKey);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cart_updated"));
  }
}

export async function createGuestCheckout(
  guest: { firstName: string; lastName: string; email: string },
  shippingAddress: {
    addressLine: string;
    city: string;
    state?: string;
    country?: string;
    postalCode: string;
  },
  lineItems: Array<{ skuId: string; quantity: number }>
): Promise<{ orderId: string; shipmentId: string; trackingToken: string }> {
  if (lineItems.length === 0) {
    throw new Error("El carrito está vacío");
  }

  const res = await fetch(`${OpenAPI.BASE}/checkout/guest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guest, lineItems, shippingAddress }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { detail?: string }).detail ?? "Error al procesar el pedido");
  }

  return res.json();
}

export const checkoutService = { createCheckout, placeOrder, safeRandomUUID, createGuestCheckout };
export default checkoutService;
