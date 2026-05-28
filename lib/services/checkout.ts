import { getCart } from "@/lib/services/cart";
import { getToken } from "@/lib/auth";
import { CheckoutService, PaymentsService, OpenAPI } from "@/lib/api-client";

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
    if (providerPaymentId) {
      try {
        // Approve the payment via the webhook endpoint (always available in all profiles).
        // This is safer than /fake-provider/payments which is @Profile("!prod") and loses
        // its in-memory state on Docker restarts.
        await PaymentsService.postPaymentsWebhook('fake', {
          providerPaymentId,
          status: 'PAID',
        });
      } catch (e) {
        console.warn("Could not send payment webhook, falling back to fake-provider: ", e);
        // Fallback: try the fake-provider endpoint (works in dev profile)
        try {
          await PaymentsService.postFakeProviderPayments(providerPaymentId, 'approve');
        } catch (e2) {
          console.warn("Could not approve via fake-provider either: ", e2);
        }
      }
    }

    // Confirm the checkout session → creates the order (always runs).
    // Retry up to 3 times with a 1 s delay in case the webhook is still processing
    // and the payment status hasn't transitioned to PAID yet (202 Accepted).
    const idempotencyKey = safeRandomUUID();
    let orderConfirmed = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      try {
        // The generated client throws on non-2xx, but 202 is 2xx — it won't throw.
        // We call confirm and if we get back a non-null body (order created) we stop.
        const result = await CheckoutService.postCheckoutSessionsConfirm(externalId, idempotencyKey);
        // result has orderId when 201 CREATED; it's null/undefined on 202 ACCEPTED
        if (result && (result as { orderId?: string }).orderId) {
          orderConfirmed = true;
          break; // Order created, done
        }
        // 202 Accepted: payment still pending, retry
      } catch (confirmErr: unknown) {
        // 4xx/5xx: the backend now falls back to DB lookup if session expired.
        // Any unrecoverable error on last attempt is re-thrown.
        console.warn(`Confirm attempt ${attempt + 1} failed:`, confirmErr);
        if (attempt === 2) throw confirmErr;
      }
    }
    if (!orderConfirmed) {
      console.warn("Payment still pending after 3 confirm attempts; order may not be visible yet.");
    }
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem("vp_mock_cart");
  }
  return Promise.resolve();
}

export const checkoutService = { createCheckout, confirmMock, safeRandomUUID };

export default checkoutService;
