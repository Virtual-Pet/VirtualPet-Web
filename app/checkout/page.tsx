"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import checkoutService from "@/lib/services/checkout";
import { getToken, getUser } from "@/lib/auth";
import { getCart } from "@/lib/services/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // Guest Info State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Shipping Address Form State
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("Mar del Plata");
  const [postalCode, setPostalCode] = useState("7600");
  const [state, setState] = useState("Buenos Aires");
  const [country, setCountry] = useState("Argentina");

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer" | "mobbex">("cash");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsGuest(true);
      return;
    }
    const user = getUser();
    if (user?.address) {
      setAddressLine(user.address);
    }
  }, []);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();

    if (!addressLine.trim()) {
      setError("Por favor ingresá una dirección de entrega válida.");
      return;
    }

    setLoading(true);
    setError("");

    const addressPayload = { addressLine, city, state, country, postalCode };

    try {
      if (isGuest) {
        const cart = await getCart();
        if (cart.items.length === 0) {
          setError("El carrito está vacío.");
          return;
        }
        const lineItems = cart.items.map((i) => ({ skuId: i.variantId, quantity: i.quantity }));
        const confirmation = await checkoutService.createGuestCheckout(
          { firstName, lastName, email },
          addressPayload,
          lineItems
        );
        router.push(`/checkout/success?orderId=${confirmation.orderId}&token=${confirmation.trackingToken}`);
      } else {
        const token = getToken()!;
        const res = await checkoutService.createCheckout(token, addressPayload);
        await checkoutService.placeOrder(res.checkoutSessionId);
        router.push("/account/orders");
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

        <form onSubmit={handleCheckout} className="mt-8 space-y-8">
          {isGuest && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-zinc-800 border-b pb-2">Tus datos</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Nombre</label>
                  <input
                    type="text"
                    placeholder="Juan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--vp-border)] px-4 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--vp-primary)]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Apellido</label>
                  <input
                    type="text"
                    placeholder="García"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[var(--vp-border)] px-4 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--vp-primary)]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">Email</label>
                <input
                  type="email"
                  placeholder="juan@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[var(--vp-border)] px-4 py-2 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--vp-primary)]"
                  required
                />
              </div>
              <p className="text-xs text-zinc-400">
                ¿Ya tenés cuenta?{" "}
                <a href="/login?redirect=/checkout" className="text-emerald-600 font-semibold hover:underline">
                  Iniciá sesión
                </a>
              </p>
            </div>
          )}

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

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-zinc-800 border-b pb-2">Método de Pago</h2>
            
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
                Pagás cuando nuestro repartidor te entrega los productos en tu domicilio.
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

            {/* Option 3: Mobbex */}
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
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm"
          >
            {loading ? "Procesando..." : "Finalizar compra"}
          </button>
        </form>
      </div>
    </section>
  );
}
