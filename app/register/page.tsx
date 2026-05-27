/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import authService from "@/lib/services/auth";
import { saveAuth } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    lastname: "",
    dni: "",
    phone: "",
  });
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // client-side validation for DNI
    const dni = form.dni?.trim();
    if (!/^[0-9]{7,8}$/.test(dni || "")) {
      setError("DNI inválido: debe contener 7 u 8 dígitos");
      return;
    }

    try {
      const res = await authService.register(form as any);
      if (res.token) {
        saveAuth(res.token as string, res.user as any);
        window.location.href = "/";
      }
    } catch (e: unknown) {
      const err = e as { message?: string };
      setError(err.message ?? "Error");
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Crear cuenta</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          placeholder="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
        <input
          placeholder="lastname"
          value={form.lastname}
          onChange={(e) => setForm({ ...form, lastname: e.target.value })}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
        <input
          type="email"
          placeholder="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
        <input
          placeholder="dni (7-8 dígitos)"
          value={form.dni}
          onChange={(e) => setForm({ ...form, dni: e.target.value })}
          className="w-full rounded-lg border px-3 py-2"
          pattern="^[0-9]{7,8}$"
          title="DNI debe tener 7 u 8 dígitos"
          inputMode="numeric"
          minLength={7}
          maxLength={8}
          required
        />
        <input
          placeholder="phone (opcional)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full rounded-lg border px-3 py-2"
        />
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-emerald-600 py-2 text-white">
          Registrarse
        </button>
      </form>
      <p className="mt-4 text-sm">
        ¿Ya tenés cuenta? <Link href="/login">Ingresá</Link>
      </p>
    </section>
  );
}
