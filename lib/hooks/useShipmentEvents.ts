"use client";

import { useEffect, useRef } from "react";
import { getToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type ShipmentUpdate = {
  shipmentId: string;
  orderId: string;
  status: string;
  previousStatus?: string;
  updatedAt: string;
};

type Options = {
  /** Si se pasa, el stream filtra por ese pedido (?orderId=). Si no, recibe todos. */
  orderId?: string;
  /** El stream solo se abre cuando es true (p.ej. solo si hay token). */
  enabled?: boolean;
  /** Se invoca por cada evento `shipment-update`. */
  onUpdate: (e: ShipmentUpdate) => void;
  /** Se invoca en cada (re)conexión: útil para reconciliar estado tras un gap. */
  onConnected?: () => void;
};

/**
 * Suscribe a las actualizaciones de estado de envíos vía SSE
 * (`GET /api/v1/shipments/events`). Consume el stream con fetch + ReadableStream
 * para poder enviar `Authorization: Bearer <token>` (mismo patrón que ChatWidget).
 *
 * El backend cierra la conexión cada ~5 min, por lo que el hook reabre el stream
 * automáticamente mientras el componente siga montado y `enabled`.
 */
export function useShipmentEvents({
  orderId,
  enabled = true,
  onUpdate,
  onConnected,
}: Options): void {
  // Refs para que el loop de reconexión use siempre los últimos callbacks
  // sin reabrir el stream en cada render.
  const onUpdateRef = useRef(onUpdate);
  const onConnectedRef = useRef(onConnected);
  onUpdateRef.current = onUpdate;
  onConnectedRef.current = onConnected;

  useEffect(() => {
    if (!enabled) return;

    let mounted = true;
    const controller = new AbortController();

    function dispatchEvent(eventName: string, data: string) {
      if (eventName === "connected") {
        onConnectedRef.current?.();
        return;
      }
      if (eventName === "shipment-update") {
        try {
          onUpdateRef.current(JSON.parse(data) as ShipmentUpdate);
        } catch {
          // data malformada → ignorar este evento
        }
      }
    }

    async function connect() {
      while (mounted) {
        try {
          const token = getToken();
          const params = orderId ? `?orderId=${encodeURIComponent(orderId)}` : "";
          const url = `${API_URL}/api/v1/shipments/events${params}`;

          const headers: Record<string, string> = { Accept: "text/event-stream" };
          if (token) headers["Authorization"] = `Bearer ${token}`;

          const res = await fetch(url, { headers, signal: controller.signal });
          if (!res.ok || !res.body) throw new Error(`SSE ${res.status}`);

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (mounted) {
            const { done, value } = await reader.read();
            if (done) break; // timeout del servidor → salir y reconectar

            buffer += decoder.decode(value, { stream: true });

            // Los eventos SSE se separan por línea en blanco ("\n\n").
            let sep: number;
            while ((sep = buffer.indexOf("\n\n")) !== -1) {
              const block = buffer.slice(0, sep);
              buffer = buffer.slice(sep + 2);

              let eventName = "message";
              const dataLines: string[] = [];
              for (const line of block.split("\n")) {
                if (line.startsWith("event:")) {
                  eventName = line.slice(6).trim();
                } else if (line.startsWith("data:")) {
                  dataLines.push(line.slice(5).trim());
                }
              }
              if (dataLines.length || eventName === "connected") {
                dispatchEvent(eventName, dataLines.join("\n"));
              }
            }
          }
        } catch {
          if (!mounted) return; // abort por desmontaje → no reconectar
        }

        // Backoff breve antes de reabrir el stream.
        if (mounted) {
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    }

    connect();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [orderId, enabled]);
}

export default useShipmentEvents;
