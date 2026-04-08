"use client";

import { useEffect, useRef } from "react";

export default function VisitTracker() {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Evitamos tracking doble en modo estricto de React
    if (hasTracked.current) return;
    hasTracked.current = true;

    // Ejecutamos la petición de fondo sin bloquear nada
    fetch("/api/visit", {
      method: "POST",
    }).catch(() => {
      // Ignoramos errores silenciosamente
    });
  }, []);

  return null;
}
