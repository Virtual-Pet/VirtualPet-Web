"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatPrice } from "@/lib/api";
import { Badge } from "@/components/Badge";
import { InvoiceRequestedBadge } from "@/components/InvoiceRequestedBadge";
import ordersService from "@/lib/services/orders";
import { getToken } from "@/lib/auth";
import { useShipmentEvents } from "@/lib/hooks/useShipmentEvents";
import type { Order } from "@/lib/types";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = getToken();

  const fetchOrder = useCallback(
    () =>
      ordersService
        .getOrder(id, token ?? undefined)
        .then(setOrder)
        .catch(() => setError("No se pudo cargar el pedido.")),
    [id, token],
  );

  useEffect(() => {
    if (!token) {
      router.push("/login?redirect=/account/orders");
      return;
    }
    fetchOrder().finally(() => setLoading(false));
    const interval = setInterval(fetchOrder, 30_000);
    return () => clearInterval(interval);
  }, [token, router, fetchOrder]);

  // Actualización en tiempo real vía SSE (estado del envío de este pedido).
  useShipmentEvents({
    orderId: id,
    enabled: !!token,
    onUpdate: (e) => {
      if (e.orderId !== id) return;
      setOrder((prev) => (prev ? { ...prev, status: e.status } : prev));
    },
    onConnected: () => {
      // Reconciliar estado tras (re)conexión por si se perdieron eventos.
      fetchOrder();
    },
  });

  if (loading) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-10">
        <div
          className="h-48 rounded-2xl"
          style={{
            background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-[var(--vp-muted)]">{error || "Pedido no encontrado."}</p>
        <Link href="/account/orders" className="mt-4 inline-block font-semibold text-[var(--vp-primary)] hover:underline">
          ← Volver a mis pedidos
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--vp-muted)] hover:text-[var(--vp-primary)] mb-6"
      >
        ← Mis pedidos
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">
            Pedido{" "}
            <span className="font-mono text-[var(--vp-primary)]">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
          </h1>
          {order.createdAt && (
            <p className="mt-1 text-sm text-zinc-400">
              {new Date(order.createdAt).toLocaleString("es-AR", {
                day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge status={order.status} />
          {order.requiresInvoice && <InvoiceRequestedBadge cuit={order.billingCuit} />}
        </div>
      </div>

      {/* Productos */}
      <div
        className="mb-4 overflow-hidden rounded-2xl border border-[var(--vp-border)] bg-white"
        style={{ boxShadow: "var(--vp-shadow-sm)" }}
      >
        <div className="border-b border-zinc-100 px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Productos</p>
        </div>
        {order.items.map((item, i) => (
          <div
            key={item.variantId + i}
            className={`flex items-center justify-between gap-4 px-6 py-4 ${i < order.items.length - 1 ? "border-b border-zinc-100" : ""}`}
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-zinc-900">{item.productName}</p>
              <p className="mt-0.5 font-mono text-xs text-zinc-400">{item.sku}</p>
            </div>
            <div className="flex shrink-0 items-center gap-8">
              <div className="text-center">
                <p className="text-xs text-zinc-400">Cant.</p>
                <p className="font-bold text-zinc-700">×{item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-400">Subtotal</p>
                <p className="font-bold text-zinc-900">{formatPrice(item.subtotal ?? item.unitPrice * item.quantity)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen + dirección */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          className="rounded-2xl border border-[var(--vp-border)] bg-white p-5"
          style={{ boxShadow: "var(--vp-shadow-sm)" }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Resumen</p>
          <div className="flex flex-col gap-2 text-sm">
            {order.shippingCost !== undefined && (
              <div className="flex justify-between text-[var(--vp-muted)]">
                <span>Envío</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-zinc-100 pt-2 font-bold text-zinc-900">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {order.shippingAddress && (
          <div
            className="rounded-2xl border border-[var(--vp-border)] bg-white p-5"
            style={{ boxShadow: "var(--vp-shadow-sm)" }}
          >
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Entrega</p>
            <div className="text-sm leading-relaxed text-zinc-700">
              <p className="font-semibold">{order.shippingAddress.street}</p>
              <p className="text-[var(--vp-muted)]">{order.shippingAddress.city}</p>
              {order.shippingAddress.zipCode && (
                <p className="text-xs text-zinc-400">CP {order.shippingAddress.zipCode}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
