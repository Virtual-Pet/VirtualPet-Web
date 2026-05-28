/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import authService from "@/lib/services/auth";
import { saveAuth } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("cliente@demo.local");
  const [password, setPassword] = useState("cliente123");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await authService.login(email, password);
      const token = res.accessToken;
      if (token) {
        saveAuth(token, res.user as any);
        window.location.href = params.get("redirect") ?? "/";
      }
    } catch (e: unknown) {
      const err = e as { message?: string, body?: any };
      setError(err.body?.detail ?? err.message ?? "Credenciales inválidas");
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Ingresar</h1>
      {params.get("registered") && (
        <div className="mt-4 rounded-lg bg-green-50 p-4 text-green-800">
          Registro exitoso. Ya podés iniciar sesión.
        </div>
      )}
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-[var(--vp-primary)] py-2 font-medium text-white hover:bg-[var(--vp-primary-dark)]">
          Entrar
        </button>
      </form>
      <p className="mt-4 text-sm">
        ¿No tenés cuenta? <Link href="/register" className="text-[var(--vp-primary)] font-semibold hover:underline">Registrate</Link>
      </p>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
