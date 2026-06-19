// src/services/api.js
//
// Capa delgada de comunicacion con el backend (Controlador en Express).
// Centralizar el fetch aqui evita repetir URLs/headers en los componentes.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function obtenerReporte(fechaInicio, fechaFin) {
  const params = new URLSearchParams({ fechaInicio, fechaFin });
  const response = await fetch(`${API_URL}/reporte?${params.toString()}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "No se pudo obtener el reporte.");
  }

  return data;
}
