import { OrdersService, ShipmentsService, OpenAPI } from "@/lib/api-client";
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
  const [ordersResp, shipmentsResp] = await Promise.all([
    OrdersService.getOrders(),
    ShipmentsService.getShipments("me"),
  ]);
  const orders = ordersResp.data || [];
  const shipments = shipmentsResp.data || [];

  const shipmentByOrderId = new Map(shipments.map((s) => [s.orderId, s]));

  return orders.map((o) => {
    const shipment = shipmentByOrderId.get(o.orderId);
    return {
      id: o.orderId || "",
      status: shipment?.status || o.status || "CONFIRMED",
      total: o.total ? Number(o.total) : 0,
      createdAt: o.createdAt || "",
      items: [],
    };
  });
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
    status: o.shipment?.status || o.status || "CONFIRMED",
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
      productName: (item as unknown as { productName?: string }).productName || `SKU ${(item.skuId || "").slice(0, 8).toUpperCase()}`,
      sku: (item as unknown as { sku?: string }).sku || item.skuId || "",
      quantity: item.quantity || 0,
      unitPrice: item.unitPrice ? Number(item.unitPrice) : 0,
      subtotal: item.subtotal ? Number(item.subtotal) : 0,
    })),
  };
}

export const ordersService = { listOrders, getOrder };

export default ordersService;
