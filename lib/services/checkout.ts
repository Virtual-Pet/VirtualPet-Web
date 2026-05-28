import { getCart } from "@/lib/services/cart";
import { getUser, getToken } from "@/lib/auth";
import { CheckoutService, PaymentsService, OpenAPI } from "@/lib/api-client";

export type CheckoutResponse = { checkoutSessionId: string; paymentUrl: string; status: string; orderId: string | null };

export async function createCheckout(token: string, cartSession?: string, idempotencyKey?: string): Promise<CheckoutResponse> {
  const cart = await getCart();
  const user = getUser();
  
  if (cart.items.length === 0) {
     throw new Error("El carrito está vacío");
  }

  OpenAPI.TOKEN = token;

  // 1. Start Checkout Session
  const session = await CheckoutService.postCartCheckout();
  const sessionId = session.checkoutSessionId;

  // 2. Set Shipping Address
  await CheckoutService.putCheckoutSessionsShippingAddress(sessionId!, {
    addressLine: user?.address || "Direccion 123",
    city: "Mar del Plata",
    state: "Buenos Aires",
    country: "Argentina",
    postalCode: "7600",
  });

  // 3. Create Payment Intent
  const key = idempotencyKey || crypto.randomUUID();
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

  if (providerPaymentId && token) {
    // 1. Tell fake provider the payment was successful
    await PaymentsService.postFakeProviderPayments(providerPaymentId, 'approve');
    
    // 2. Confirm the checkout session to create the order
    const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString();
    await CheckoutService.postCheckoutSessionsConfirm(externalId, idempotencyKey);
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem("vp_mock_cart");
  }
  return Promise.resolve();
}

export const checkoutService = { createCheckout, confirmMock };

export default checkoutService;
