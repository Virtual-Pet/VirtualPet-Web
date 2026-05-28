"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import checkoutService from "@/lib/services/checkout";

function MockCheckoutInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer" | "mobbex">("cash");
  const externalId = params.get("orderId") ?? params.get("externalId") ?? "";
  const providerPaymentId = params.get("providerPaymentId");

  async function confirm() {
    setLoading(true);
    try {
      await checkoutService.confirmMock(externalId, providerPaymentId);
      router.push("/account/orders");
    } catch (e: unknown) {
      console.error(e);
      alert("Error al confirmar la compra: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-2xl border border-[var(--vp-border)] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900 text-center">Método de Pago</h1>
        <p className="mt-2 text-sm text-zinc-500 text-center">Seleccioná cómo querés pagar tu pedido local.</p>

        <div className="mt-8 space-y-4">
          {/* Option 1: Cash */}
          <label
            className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-all ${
              paymentMethod === "cash"
                ? "border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/20"
                : "border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
                className="h-4 w-4 text-emerald-600 border-zinc-300 focus:ring-emerald-500"
              />
              <span className="font-semibold text-zinc-800 text-sm">Pago en efectivo al recibir</span>
            </div>
            <p className="mt-2 text-xs text-zinc-500 ml-7">
              Pagás cuando nuestro repartidor te entrega los productos en tu domicilio en Mar del Plata.
            </p>
          </label>

          {/* Option 2: Bank Transfer */}
          <label
            className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-all ${
              paymentMethod === "transfer"
                ? "border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/20"
                : "border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="transfer"
                checked={paymentMethod === "transfer"}
                onChange={() => setPaymentMethod("transfer")}
                className="h-4 w-4 text-emerald-600 border-zinc-300 focus:ring-emerald-500"
              />
              <span className="font-semibold text-zinc-800 text-sm">Transferencia Bancaria</span>
            </div>
            <p className="mt-2 text-xs text-zinc-500 ml-7">
              Realizá la transferencia desde tu home banking y envianos el comprobante.
            </p>
            {paymentMethod === "transfer" && (
              <div className="mt-4 rounded-lg bg-zinc-50 p-3 ml-7 text-xs text-zinc-700 space-y-1.5 border border-zinc-200 font-mono">
                <p className="font-semibold text-zinc-900 font-sans">Banco Credicoop</p>
                <p>CBU: <span className="font-bold text-zinc-900">1910001855100012345678</span></p>
                <p>Alias: <span className="font-bold text-zinc-900 text-emerald-700">virtualpet.coop</span></p>
              </div>
            )}
          </label>

          {/* Option 3: Mobbex (Fictional Card) */}
          <label
            className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-all ${
              paymentMethod === "mobbex"
                ? "border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/20"
                : "border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                value="mobbex"
                checked={paymentMethod === "mobbex"}
                onChange={() => setPaymentMethod("mobbex")}
                className="h-4 w-4 text-emerald-600 border-zinc-300 focus:ring-emerald-500"
              />
              <span className="font-semibold text-zinc-800 text-sm">Pago online con Tarjeta (Mobbex)</span>
            </div>
            <p className="mt-2 text-xs text-zinc-500 ml-7">
              Pagá de forma segura en cuotas con tarjeta de crédito o débito a través de Mobbex (Simulación).
            </p>
          </label>
        </div>

        <button
          type="button"
          onClick={confirm}
          disabled={loading || !externalId}
          className="mt-8 w-full rounded-full bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Finalizar compra"}
        </button>
      </div>
    </section>
  );
}

export default function MockCheckoutPage() {
  return (
    <Suspense>
      <MockCheckoutInner />
    </Suspense>
  );
}
