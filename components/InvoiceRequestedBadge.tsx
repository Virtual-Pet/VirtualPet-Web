import { Receipt } from "lucide-react";

export function InvoiceRequestedBadge({ cuit }: { cuit?: string }) {
  const color = "#7c3aed";

  return (
    <span
      title={cuit ? `Factura solicitada — CUIT ${cuit}` : "Factura solicitada"}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap"
      style={{
        background: color + "18",
        color,
        border: `1px solid ${color}40`,
      }}
    >
      <Receipt size={12} strokeWidth={2.2} className="shrink-0" />
      Factura solicitada
    </span>
  );
}
