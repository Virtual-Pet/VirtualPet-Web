import { getCart } from "@/lib/services/cart";
import { getUser, getToken } from "@/lib/auth";

export type CheckoutResponse = { checkoutSessionId: string; paymentUrl: string; status: string; orderId: string | null };

export async function createCheckout(token: string, cartSession?: string, idempotencyKey?: string): Promise<CheckoutResponse> {
  const cart = await getCart();
  const user = getUser();
  
  if (cart.items.length === 0) {
     throw new Error("El carrito está vacío");
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // 1. Start Checkout Session
  const startRes = await fetch(`${baseUrl}/api/v1/cart/checkout`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!startRes.ok) {
    const errorText = await startRes.text();
    console.error("Start Checkout failed:", startRes.status, errorText);
    throw new Error(`No se pudo iniciar el checkout: ${startRes.status}`);
  }
  const session = await startRes.json();
  const sessionId = session.checkoutSessionId;

  // 2. Set Shipping Address
  const addrRes = await fetch(`${baseUrl}/api/v1/checkout/sessions/${sessionId}/shipping-address`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({
      addressLine: user?.address || "Direccion 123",
      city: "Mar del Plata",
      state: "Buenos Aires",
      country: "Argentina",
      postalCode: "7600"
    })
  });
  if (!addrRes.ok) {
    const errorText = await addrRes.text();
    console.error("Set Shipping Address failed:", addrRes.status, errorText);
    throw new Error(`No se pudo establecer la dirección de envío: ${addrRes.status}`);
  }

  // 3. Create Payment Intent
  const key = idempotencyKey || crypto.randomUUID();
  const payRes = await fetch(`${baseUrl}/api/v1/checkout/sessions/${sessionId}/payment-intents`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Idempotency-Key": key }
  });
  if (!payRes.ok) {
    const errorText = await payRes.text();
    console.error("Create Payment Intent failed:", payRes.status, errorText);
    throw new Error(`No se pudo crear el intento de pago: ${payRes.status}`);
  }
  
  const payment = await payRes.json();

  let paymentUrl = payment.checkoutUrl ?? `/checkout/mock?externalId=${sessionId}`;
  if (paymentUrl.includes("/fake-checkout")) {
    paymentUrl = paymentUrl.replace("/fake-checkout", "/checkout/mock");
    if (!paymentUrl.includes("externalId=")) {
      paymentUrl += `&externalId=${sessionId}`;
    }
  }

  return {
    checkoutSessionId: sessionId,
    paymentUrl,
    status: payment.status ?? "PENDING",
    orderId: sessionId
  };
}

export async function confirmMock(externalId: string, providerPaymentId?: string | null): Promise<void> {
  const token = getToken();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  if (providerPaymentId && token) {
    // 1. Tell fake provider the payment was successful
    const pRes = await fetch(`${baseUrl}/api/v1/fake-provider/payments/${providerPaymentId}/approve`, {
      method: "POST"
    });
    if (!pRes.ok) {
      const txt = await pRes.text();
      throw new Error(`Fake Provider error ${pRes.status}: ${txt}`);
    }
    
    // 2. Confirm the checkout session to create the order
    const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString();
    const cRes = await fetch(`${baseUrl}/api/v1/checkout/sessions/${externalId}/confirm`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Idempotency-Key": idempotencyKey }
    });
    if (!cRes.ok) {
      const txt = await cRes.text();
      throw new Error(`Confirm error ${cRes.status}: ${txt}`);
    }
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem("vp_mock_cart");
  }
  return Promise.resolve();
}

export const checkoutService = { createCheckout, confirmMock };

export default checkoutService;
