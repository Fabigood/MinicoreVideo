const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000/api"
).replace(/\/$/, "");

export async function obtenerReporte(fechaInicio, fechaFin) {
  const url = `${API_URL}/reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;

  const response = await fetch(url);

  if (!response.ok) {
    let mensaje = "Error al obtener el reporte";

    try {
      const error = await response.json();
      mensaje = error.message || mensaje;
    } catch {
      mensaje = `Error ${response.status}`;
    }

    throw new Error(mensaje);
  }

  return response.json();
}