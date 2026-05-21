import { OrderControllerService } from "@/lib/api-client";
import { getCart } from "@/lib/services/cart";
import { getUser } from "@/lib/auth";

export type CheckoutResponse = { checkoutSessionId: string; paymentUrl: string; status: string; orderId: string | null };

export async function createCheckout(token: string, cartSession?: string, idempotencyKey?: string): Promise<CheckoutResponse> {
  const cart = await getCart();
  const user = getUser();
  
  if (cart.items.length === 0) {
     throw new Error("El carrito está vacío");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...(cartSession ? { "X-Cart-Session": cartSession } : {})
    },
    body: JSON.stringify({
      contactName: user?.name || "Invitado",
      contactLastname: "",
      contactEmail: user?.email || "guest@example.com",
      contactPhone: "2230000000",
      shippingAddress: {
        street: user?.address || "Direccion",
        number: "123",
        city: "Mar del Plata",
        zipCode: "7600",
      }
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Checkout failed:", res.status, errorText);
    throw new Error(`No se pudo completar el checkout: ${res.status}`);
  }

  const order = await res.json();

  return {
    checkoutSessionId: order.orderId ?? "",
    paymentUrl: order.paymentUrl ?? `/checkout/mock?externalId=${order.orderId ?? ""}`,
    status: order.status ?? "PENDING",
    orderId: order.orderId ?? null
  };
}

export async function confirmMock(externalId: string): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("vp_mock_cart");
  }
  return Promise.resolve();
}

export const checkoutService = { createCheckout, confirmMock };

export default checkoutService;
