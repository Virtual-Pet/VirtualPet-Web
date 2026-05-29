const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: "Pendiente de pago", color: "#f59e0b" },
  PAID:            { label: "Pago confirmado",    color: "#3b82f6" },
  CONFIRMED:       { label: "Confirmado",          color: "#3b82f6" },
  IN_PREPARATION:  { label: "En preparación",      color: "#8b5cf6" },
  PREPARED:        { label: "Listo para enviar",   color: "#06b6d4" },
  IN_TRANSIT:      { label: "En camino",            color: "#f97316" },
  DELIVERED:       { label: "Entregado",            color: "#22c55e" },
  SHIPPING_FAILED: { label: "Falló el envío",       color: "#ef4444" },
  CANCELLED:       { label: "Cancelado",            color: "#6b7280" },
  CANCELED:        { label: "Cancelado",            color: "#6b7280" },
};

export function Badge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "#6b7280" };

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap"
      style={{
        background: cfg.color + "18",
        color: cfg.color,
        border: `1px solid ${cfg.color}40`,
      }}
    >
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: cfg.color }}
      />
      {cfg.label}
    </span>
  );
}
