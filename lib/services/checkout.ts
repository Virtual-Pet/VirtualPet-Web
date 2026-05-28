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

export type CheckoutResponse = { checkoutSessionId: string; paymentUrl: string; status: string; orderId: string | null };

export async function createCheckout(
  token: string,
  shippingAddress: {
    addressLine: string;
    city: string;
    state?: string;
    country?: string;
    postalCode: string;
  },
  cartSession?: string,
  idempotencyKey?: string
): Promise<CheckoutResponse> {
  const cart = await getCart();
  
  if (cart.items.length === 0) {
     throw new Error("El carrito está vacío");
  }

  OpenAPI.TOKEN = token;

  // 1. Start Checkout Session
  const session = await CheckoutService.postCartCheckout();
  const sessionId = session.checkoutSessionId;

  // 2. Set Shipping Address
  await CheckoutService.putCheckoutSessionsShippingAddress(sessionId!, shippingAddress);

  // 3. Create Payment Intent
  const key = idempotencyKey || safeRandomUUID();
  const payment = await CheckoutService.postCheckoutSessionsPaymentIntents(sessionId!, key);

  let paymentUrl = payment.checkoutUrl ?? `/checkout/mock?externalId=${sessionId}`;
  if (paymentUrl.includes("/fake-checkout")) {
    paymentUrl = paymentUrl.replace("/fake-checkout", "/checkout/mock");
    if (!paymentUrl.includes("externalId=")) {
      paymentUrl += `&externalId=${sessionId}`;
    }
  }

  return {
    checkoutSessionId: sessionId!,
    paymentUrl,
    status: payment.status ?? "PENDING",
    orderId: sessionId!
  };
}

export async function confirmMock(externalId: string, providerPaymentId?: string | null): Promise<void> {
  const token = getToken();
  OpenAPI.TOKEN = token || "";

  if (token) {
    // The backend auto-approves the fake payment and creates the order in a single call.
    // No webhook or fake-provider interaction needed.
    const idempotencyKey = safeRandomUUID();
    await CheckoutService.postCheckoutSessionsConfirm(externalId, idempotencyKey);
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem("vp_mock_cart");
  }
}

export const checkoutService = { createCheckout, confirmMock, safeRandomUUID };

export default checkoutService;
