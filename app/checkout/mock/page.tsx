"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import checkoutService from "@/lib/services/checkout";


function MockCheckoutInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const externalId = params.get("orderId") ?? params.get("externalId") ?? "";
  const providerPaymentId = params.get("providerPaymentId");

  async function confirm() {
    setLoading(true);
    try {
      await checkoutService.confirmMock(externalId, providerPaymentId);
      router.push("/account/orders");
    } catch (e: unknown) {
      console.error(e);
      alert("Error al confirmar pago: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Pago simulado</h1>
      <p className="mt-4 text-zinc-600">Modo demo — sin pasarela real.</p>
      <button
        type="button"
        onClick={confirm}
        disabled={loading || !externalId}
        className="mt-8 rounded-full bg-emerald-600 px-8 py-3 font-semibold text-white"
      >
        {loading ? "Confirmando..." : "Simular pago exitoso"}
      </button>
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
