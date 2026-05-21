"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/api";
import ordersService from "@/lib/services/orders";
import { getToken } from "@/lib/auth";
import type { Order } from "@/lib/types";
import Link from "next/link";

const STEPS = [
  { key: "PAID", label: "Pago confirmado", icon: "✅" },
  { key: "IN_PREPARATION", label: "En preparación", icon: "📦" },
  { key: "PREPARED", label: "Listo para enviar", icon: "🏷️" },
  { key: "SHIPPED", label: "En camino", icon: "🚚" },
  { key: "DELIVERED", label: "Entregado", icon: "🎉" },
] as const;

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAID: "Pago confirmado",
  IN_PREPARATION: "En preparación",
  PREPARED: "Listo para enviar",
  SHIPPED: "En camino",
  DELIVERED: "Entregado",
  SHIPPING_FAILED: "Falló el envío",
  CANCELED: "Cancelado",
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token || !id) {
      // eslint-disable-next-line
      setLoading(false);
      return;
    }
    ordersService
      .getOrder(id, token)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "2.5rem 1rem" }}>
        <div
          style={{
            height: "32px",
            width: "200px",
            background: "#e5e7eb",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        />
        <div
          style={{ height: "200px", background: "#e5e7eb", borderRadius: "16px" }}
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "2.5rem 1rem",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#6b7280" }}>Pedido no encontrado.</p>
        <Link href="/account/orders" style={{ color: "#3b82f6" }}>
          ← Volver a mis pedidos
        </Link>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.key === order.status);
  const isCanceled =
    order.status === "CANCELED" || order.status === "SHIPPING_FAILED";

  return (
    <>
      <style>{`
        .tracker-step {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          position: relative;
          padding-bottom: 1.5rem;
        }
        .tracker-step:not(:last-child)::after {
          content: '';
          position: absolute;
          left: 19px;
          top: 40px;
          width: 2px;
          bottom: 0;
          background: #e5e7eb;
        }
        .tracker-step.done::after { background: #22c55e; }
      `}</style>
      <section style={{ maxWidth: "720px", margin: "0 auto", padding: "2.5rem 1rem" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          <Link
            href="/account/orders"
            style={{
              color: "#6b7280",
              textDecoration: "none",
              fontSize: "0.875rem",
            }}
          >
            ← Mis pedidos
          </Link>
        </div>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.375rem",
          }}
        >
          Pedido #{order.id.slice(0, 8).toUpperCase()}
        </h1>
        {order.createdAt && (
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.875rem",
              marginBottom: "2rem",
            }}
          >
            Realizado el{" "}
            {new Date(order.createdAt).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}

        {/* Tracker */}
        {!isCanceled ? (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.75rem",
              border: "1px solid #e5e7eb",
              marginBottom: "1.5rem",
            }}
          >
            <h2
              style={{
                fontWeight: 600,
                fontSize: "1rem",
                marginBottom: "1.5rem",
                color: "#374151",
              }}
            >
              Estado del envío
            </h2>
            {STEPS.map((step, idx) => {
              const done = idx <= currentIdx;
              const active = idx === currentIdx;
              return (
                <div
                  key={step.key}
                  className={`tracker-step${done ? " done" : ""}`}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.125rem",
                      flexShrink: 0,
                      zIndex: 1,
                      background: done ? "#dcfce7" : "#f3f4f6",
                      border: active
                        ? "2px solid #22c55e"
                        : "2px solid transparent",
                      boxShadow: active ? "0 0 0 4px #dcfce780" : "none",
                      transition: "all 0.3s",
                    }}
                  >
                    {step.icon}
                  </div>
                  <div style={{ paddingTop: "0.5rem" }}>
                    <p
                      style={{
                        fontWeight: active ? 700 : 500,
                        color: done ? "#15803d" : "#9ca3af",
                        margin: 0,
                        fontSize: "0.9375rem",
                      }}
                    >
                      {step.label}
                    </p>
                    {active && (
                      <p
                        style={{
                          color: "#22c55e",
                          fontSize: "0.8125rem",
                          marginTop: "0.125rem",
                        }}
                      >
                        Estado actual
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              background: "#fef2f2",
              borderRadius: "16px",
              padding: "1.5rem",
              border: "1px solid #fecaca",
              marginBottom: "1.5rem",
            }}
          >
            <p style={{ fontWeight: 600, color: "#dc2626" }}>
              {STATUS_LABELS[order.status] ?? order.status}
            </p>
          </div>
        )}

        {/* Items */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "1.75rem",
            border: "1px solid #e5e7eb",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontWeight: 600,
              fontSize: "1rem",
              marginBottom: "1.25rem",
              color: "#374151",
            }}
          >
            Productos
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {order.items.map((item, idx) => (
              <li
                key={item.variantId ?? idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.75rem 0",
                  borderBottom:
                    idx < order.items.length - 1
                      ? "1px solid #f3f4f6"
                      : "none",
                }}
              >
                <div>
                  <p
                    style={{
                      fontWeight: 500,
                      margin: 0,
                      fontSize: "0.9375rem",
                    }}
                  >
                    {item.productName}
                  </p>
                  <p
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.8125rem",
                      marginTop: "0.125rem",
                    }}
                  >
                    {item.sku} · x{item.quantity}
                  </p>
                </div>
                <p
                  style={{ fontWeight: 600, margin: 0, whiteSpace: "nowrap" }}
                >
                  {formatPrice(item.unitPrice * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "1rem",
              borderTop: "2px solid #f3f4f6",
              marginTop: "0.5rem",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: "1.0625rem" }}>
              Total
            </span>
            <span style={{ fontWeight: 700, fontSize: "1.25rem" }}>
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Address */}
        {order.shippingAddress && (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.75rem",
              border: "1px solid #e5e7eb",
            }}
          >
            <h2
              style={{
                fontWeight: 600,
                fontSize: "1rem",
                marginBottom: "0.75rem",
                color: "#374151",
              }}
            >
              Dirección de entrega
            </h2>
            <p style={{ color: "#374151", margin: 0 }}>
              {order.shippingAddress.street} {order.shippingAddress.num},{" "}
              {order.shippingAddress.city} ({order.shippingAddress.zipCode})
            </p>
          </div>
        )}
      </section>
    </>
  );
}
