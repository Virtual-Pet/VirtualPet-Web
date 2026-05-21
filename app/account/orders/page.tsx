"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/api";
import ordersService from "@/lib/services/orders";
import { getToken } from "@/lib/auth";
import type { Order } from "@/lib/types";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: "Pendiente de pago", color: "#f59e0b" },
  PAID: { label: "Pago confirmado", color: "#3b82f6" },
  IN_PREPARATION: { label: "En preparación", color: "#8b5cf6" },
  PREPARED: { label: "Listo para enviar", color: "#06b6d4" },
  SHIPPED: { label: "En camino", color: "#f97316" },
  DELIVERED: { label: "Entregado", color: "#22c55e" },
  SHIPPING_FAILED: { label: "Falló el envío", color: "#ef4444" },
  CANCELED: { label: "Cancelado", color: "#6b7280" },
};

function OrderSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: "80px",
            borderRadius: "12px",
            background:
              "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
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
      // eslint-disable-next-line
      setLoading(false);
      return;
    }
    ordersService
      .listOrders(token)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .order-card {
          display: block;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .order-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transform: translateY(-1px);
        }
      `}</style>
      <section style={{ maxWidth: "720px", margin: "0 auto", padding: "2.5rem 1rem" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Mis pedidos
        </h1>
        <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
          Historial y seguimiento de tus compras
        </p>

        {loading ? (
          <OrderSkeleton />
        ) : orders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "#f9fafb",
              borderRadius: "16px",
              border: "1px dashed #d1d5db",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
            <p style={{ color: "#6b7280", fontWeight: 500 }}>
              Aún no tenés pedidos.
            </p>
            <Link
              href="/catalog"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                padding: "0.625rem 1.5rem",
                background: "#111827",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {orders.map((o) => {
              const statusCfg = STATUS_CONFIG[o.status] ?? {
                label: o.status,
                color: "#6b7280",
              };
              return (
                <li key={o.id}>
                  <Link
                    href={`/account/orders/${o.id}`}
                    className="order-card"
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontSize: "0.875rem",
                            color: "#374151",
                            fontWeight: 600,
                          }}
                        >
                          #{o.id.slice(0, 8).toUpperCase()}
                        </span>
                        {o.createdAt && (
                          <p
                            style={{
                              fontSize: "0.8125rem",
                              color: "#9ca3af",
                              marginTop: "0.25rem",
                            }}
                          >
                            {new Date(o.createdAt).toLocaleDateString("es-AR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "0.375rem",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "999px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            background: statusCfg.color + "18",
                            color: statusCfg.color,
                            border: `1px solid ${statusCfg.color}40`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background: statusCfg.color,
                              flexShrink: 0,
                            }}
                          />
                          {statusCfg.label}
                        </span>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "#111827",
                          }}
                        >
                          {formatPrice(o.total)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
