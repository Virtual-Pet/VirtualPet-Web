"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import checkoutService from "@/lib/services/checkout";
import { getToken, getUser } from "@/lib/auth";
import { getCartSession } from "@/lib/cart-session";

export default function CheckoutPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Shipping Address Form State
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("Mar del Plata");
  const [postalCode, setPostalCode] = useState("7600");
  const [state, setState] = useState("Buenos Aires");
  const [country, setCountry] = useState("Argentina");

  // Pre-fill address if saved in user session
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login?redirect=/checkout");
      return;
    }
    const user = getUser();
    if (user?.address) {
      setAddressLine(user.address);
    }
  }, [router]);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      router.push("/login?redirect=/checkout");
      return;
    }

    if (!addressLine.trim()) {
      setError("Por favor ingresá una dirección de entrega válida.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const addressPayload = {
        addressLine,
        city,
        state,
        country,
        postalCode,
      };

      const res = await checkoutService.createCheckout(
        token,
        addressPayload,
        getCartSession(),
        crypto.randomUUID()
      );

      if (res.paymentUrl.includes("/checkout/mock")) {
        router.push(res.paymentUrl.replace("http://localhost:3000", ""));
      } else {
        window.location.href = res.paymentUrl;
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      setError(err.message ?? "Error al procesar el checkout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-2xl border border-[var(--vp-border)] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-zinc-900">Checkout</h1>
        <p className="mt-2 text-sm text-zinc-500">Envío gratis en Mar del Plata. Delivery propio.</p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleCheckout} className="mt-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-800 border-b pb-2">Dirección de Entrega</h2>
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Calle y Número</label>
              <input
                type="text"
                placeholder="Ej. Av. Colón 1234, Piso 3 Dpto B"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--vp-border)] px-4 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--vp-primary)]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Código Postal</label>
                <input
                  type="text"
                  placeholder="Ej. 7600"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--vp-border)] px-4 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--vp-primary)]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Ciudad</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--vp-border)] px-4 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--vp-primary)]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Provincia</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--vp-border)] px-4 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--vp-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">País</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--vp-border)] px-4 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--vp-primary)]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm"
          >
            {loading ? "Procesando..." : "Confirmar y pagar"}
          </button>
        </form>
      </div>
    </section>
  );
}
