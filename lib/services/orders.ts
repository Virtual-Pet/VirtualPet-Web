import { OrdersService, OpenAPI } from "@/lib/api-client";
import type { Order } from "@/lib/types";

const useMock = ["1", "true"].includes(process.env.NEXT_PUBLIC_USE_MOCK_SERVICES ?? "");
const ORDERS_KEY = "vp_mock_orders";

function isClient() {
  return typeof window !== "undefined";
}

function readOrders(): Order[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

export async function listOrders(token?: string): Promise<Order[]> {
  if (useMock) return Promise.resolve(readOrders());
  
  if (token) OpenAPI.TOKEN = token;
  const response = await OrdersService.getOrders();
  const data = response.data || [];
  
  return data.map((o) => ({
    id: o.orderId || "",
    status: o.status || "PENDING_PAYMENT",
    total: o.total ? Number(o.total) : 0,
    createdAt: o.createdAt || "",
    items: [],
  }));
}

export async function getOrder(id: string, token?: string): Promise<Order> {
  if (useMock) {
    const orders = readOrders();
    const o = orders.find((x) => x.id === id) ?? orders[0];
    return Promise.resolve(o);
  }
  
  if (token) OpenAPI.TOKEN = token;
  const o = await OrdersService.getOrders1(id);
  
  return {
    id: o.orderId || "",
    status: o.status || "PENDING_PAYMENT",
    total: o.totals?.grandTotal ? Number(o.totals.grandTotal) : 0,
    shippingCost: o.totals?.shipping ? Number(o.totals.shipping) : 0,
    createdAt: o.createdAt || "",
    shippingAddress: o.shippingAddress ? {
      street: o.shippingAddress.addressLine || "",
      num: "",
      city: o.shippingAddress.city || "",
      zipCode: o.shippingAddress.postalCode || "",
    } : undefined,
    items: (o.lineItems || []).map((item) => ({
      variantId: item.skuId || "",
      productName: `Producto #${(item.skuId || "").slice(0, 8)}`,
      sku: item.skuId || "",
      quantity: item.quantity || 0,
      unitPrice: item.unitPrice ? Number(item.unitPrice) : 0,
      subtotal: item.subtotal ? Number(item.subtotal) : 0,
    })),
  };
}

export const ordersService = { listOrders, getOrder };

export default ordersService;
