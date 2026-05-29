"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/api";
import { Badge } from "@/components/Badge";
import { OpenAPI } from "@/lib/api-client";
import type { Order } from "@/lib/types";

function TrackingContent() {
  const { orderId } = useParams<{ orderId: string }>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Link de seguimiento inválido.");
      setLoading(false);
      return;
    }

    const fetchOrder = () =>
      fetch(`${OpenAPI.BASE}/orders/${orderId}/track?token=${encodeURIComponent(token)}`)
        .then(async (res) => {
          if (!res.ok) throw new Error("No se pudo cargar el pedido.");
          const data = await res.json();
          const o = data as {
            orderId?: string;
            status?: string;
            shipment?: { status?: string };
            totals?: { grandTotal?: string; shipping?: string };
            shippingAddress?: { addressLine?: string; city?: string; postalCode?: string };
            lineItems?: Array<{ skuId?: string; productName?: string; sku?: string; quantity?: number; unitPrice?: string; subtotal?: string }>;
            createdAt?: string;
          };
          setOrder({
            id: o.orderId ?? "",
            status: o.shipment?.status ?? o.status ?? "CONFIRMED",
            total: o.totals?.grandTotal ? Number(o.totals.grandTotal) : 0,
            shippingCost: o.totals?.shipping ? Number(o.totals.shipping) : 0,
            createdAt: o.createdAt ?? "",
            shippingAddress: o.shippingAddress
              ? {
                  street: o.shippingAddress.addressLine ?? "",
                  num: "",
                  city: o.shippingAddress.city ?? "",
                  zipCode: o.shippingAddress.postalCode ?? "",
                }
              : undefined,
            items: (o.lineItems ?? []).map((item) => ({
              variantId: item.skuId ?? "",
              productName: item.productName ?? `SKU ${(item.skuId ?? "").slice(0, 8).toUpperCase()}`,
              sku: item.sku ?? item.skuId ?? "",
              quantity: item.quantity ?? 0,
              unitPrice: item.unitPrice ? Number(item.unitPrice) : 0,
              subtotal: item.subtotal ? Number(item.subtotal) : 0,
            })),
          });
        })
        .catch(() => setError("No se pudo cargar el pedido. Verificá que el link sea correcto."));

    fetchOrder().finally(() => setLoading(false));
    const interval = setInterval(fetchOrder, 30_000);
    return () => clearInterval(interval);
  }, [orderId, token]);

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
        <Link href="/catalog" className="mt-4 inline-block font-semibold text-[var(--vp-primary)] hover:underline">
          ← Ir al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <p className="mb-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">
        Seguimiento de pedido
      </p>

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
        <Badge status={order.status} />
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

export default function TrackOrderPage() {
  return (
    <Suspense>
      <TrackingContent />
    </Suspense>
  );
}
