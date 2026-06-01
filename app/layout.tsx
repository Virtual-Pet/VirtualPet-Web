import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { ApiClientInit } from "@/components/ApiClientInit";
import { setupApiClient } from "@/lib/api-client/setup";
import "./globals.css";

// Configure the server-side copy of the generated client (for RSC/SSR fetches).
// ApiClientInit does the same for the browser copy — both are required.
setupApiClient();

export const metadata: Metadata = {
  title: "Virtual Pet — E-commerce de mascotas",
  description: "Virtual Pet nunca defraudará a su mascota. Tienda online en Mar del Plata.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full">
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
        <ApiClientInit />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="mt-auto border-t border-[var(--vp-border)] bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-[var(--vp-muted)]">
            <p className="font-semibold text-[var(--vp-primary-dark)]">Virtual Pet</p>
            <p className="mt-1">© {new Date().getFullYear()} — Mar del Plata. Cuidamos a tu mascota.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
