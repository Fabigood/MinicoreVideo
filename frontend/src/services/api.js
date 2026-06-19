const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function obtenerReporte(fechaInicio, fechaFin) {
  const response = await fetch(
    `${API_URL}/reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al obtener el reporte");
  }

  return response.json();
}