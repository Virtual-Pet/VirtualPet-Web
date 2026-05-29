"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";
import { CheckCircle } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId") ?? "";
  const token = params.get("token") ?? "";
  const [copied, setCopied] = useState(false);

  const trackingUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/track/${orderId}?token=${token}`
      : `/track/${orderId}?token=${token}`;

  function copyLink() {
    navigator.clipboard.writeText(trackingUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--vp-primary-light)] text-[var(--vp-primary)]">
        <CheckCircle size={32} strokeWidth={2} />
      </div>

      <h1 className="text-3xl font-bold text-zinc-900">¡Pedido confirmado!</h1>
      <p className="mt-2 text-[var(--vp-muted)]">
        Tu pedido fue registrado correctamente. Guardá el siguiente link para seguir el estado del envío.
      </p>

      <div
        className="mt-8 rounded-2xl border border-[var(--vp-border)] bg-zinc-50 p-5 text-left"
        style={{ boxShadow: "var(--vp-shadow-sm)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Link de seguimiento
        </p>
        <p className="mt-2 break-all font-mono text-sm text-zinc-700">
          {trackingUrl}
        </p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={copyLink}
            className="flex-1 rounded-lg py-2 text-sm font-semibold text-white transition-colors"
            style={{ background: copied ? "var(--vp-accent)" : "#111827" }}
          >
            {copied ? "¡Copiado!" : "Copiar link"}
          </button>
          <Link
            href={`/track/${orderId}?token=${token}`}
            className="flex flex-1 items-center justify-center rounded-lg border border-[var(--vp-border)] bg-white py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 transition-colors"
          >
            Ver pedido
          </Link>
        </div>
      </div>

      <p className="mt-4 text-xs text-zinc-400">
        Guardá este link — es la única forma de ver el estado de tu pedido sin una cuenta.
      </p>

      <Link
        href="/catalog"
        className="mt-8 inline-block text-sm text-[var(--vp-muted)] hover:text-[var(--vp-primary)]"
      >
        ← Seguir comprando
      </Link>
    </section>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
