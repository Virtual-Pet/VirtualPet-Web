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

  const order = await OrderControllerService.createOrder({
      contactName: user?.name || "Invitado",
      contactLastname: "",
      contactEmail: user?.email || "guest@example.com",
      contactPhone: "2230000000",
      shippingAddress: {
        street: user?.address || "Direccion",
        number: "123",
        city: "Mar del Plata",
        zipCode: "7600",
      },
      items: cart.items.map((i) => ({
        productVariantId: i.variantId,
        sku: i.sku,
        name: i.productName,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
      })),
  });

  return {
    checkoutSessionId: order.orderId ?? "",
    paymentUrl: `/checkout/mock?externalId=${order.orderId ?? ""}`,
    status: "PENDING",
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
