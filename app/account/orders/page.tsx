"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { formatPrice } from "@/lib/api";
import { Badge } from "@/components/Badge";
import ordersService from "@/lib/services/orders";
import { getToken } from "@/lib/auth";
import type { Order } from "@/lib/types";

function OrderSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-20 rounded-2xl"
          style={{
            background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    const fetchOrders = () =>
      ordersService.listOrders(token).then(setOrders).catch(() => setOrders([]));

    fetchOrders().finally(() => setLoading(false));
    const interval = setInterval(fetchOrders, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold text-zinc-900">Mis pedidos</h1>
      <p className="mt-1 text-[var(--vp-muted)]">Historial y seguimiento de tus compras</p>

      <div className="mt-8">
        {loading ? (
          <OrderSkeleton />
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-8 py-16 text-center">
            <Package size={40} className="text-zinc-300" strokeWidth={1.5} />
            <p className="mt-4 font-medium text-[var(--vp-muted)]">Aún no tenés pedidos.</p>
            <Link
              href="/catalog"
              className="mt-4 inline-block rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
            >
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/account/orders/${o.id}`}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-[var(--vp-border)] bg-white p-5 transition-shadow hover:-translate-y-px"
                  style={{ boxShadow: "var(--vp-shadow-sm)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--vp-shadow)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "var(--vp-shadow-sm)")}
                >
                  <div>
                    <span className="font-mono text-sm font-semibold text-zinc-700">
                      #{o.id.slice(0, 8).toUpperCase()}
                    </span>
                    {o.createdAt && (
                      <p className="mt-1 text-xs text-zinc-400">
                        {new Date(o.createdAt).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <Badge status={o.status} />
                    <span className="text-base font-bold text-zinc-900">{formatPrice(o.total)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
