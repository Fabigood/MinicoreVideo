// src/controllers/reporteController.js
//
// CONTROLADOR: contiene la logica de negocio del ejercicio.
// Recibe fechaInicio/fechaFin desde la vista (Vue), le pide los datos
// crudos al MODELO (Repartidor, que ya trae embebidos sus envios +
// zona via supabase-js) y devuelve el reporte calculado: para cada
// repartidor, cuantos envios tuvo en el rango, cuantos kg en total, y
// el costo total (suma de peso_kg * tarifa_por_kg de la zona de CADA
// envio, tal como pide el enunciado en 3.1).

const { supabase, Repartidor } = require("../models");

function validarFechas(fechaInicio, fechaFin) {
  if (!fechaInicio || !fechaFin) {
    return "Debes enviar fechaInicio y fechaFin (formato YYYY-MM-DD).";
  }
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
    return "Las fechas enviadas no son validas.";
  }
  if (inicio > fin) {
    return "Fecha Inicio no puede ser posterior a Fecha Fin.";
  }
  return null;
}

function calcularFilaReporte(repartidor) {
  const envios = repartidor.envios || [];

  const cantidadEnvios = envios.length;
  const totalKg = envios.reduce((acc, envio) => acc + Number(envio.peso_kg), 0);

  // Por cada envio: peso_kg * tarifa_por_kg de SU zona, y se suman.
  const costoTotal = envios.reduce(
    (acc, envio) => acc + Number(envio.peso_kg) * Number(envio.zonas.tarifa_por_kg),
    0
  );

  // Si todos los envios del repartidor en el rango son de la misma
  // zona, se muestra esa zona y su tarifa. Si tiene envios en mas de
  // una zona, se indica explicitamente (el costo total ya suma
  // correctamente cada envio con la tarifa de SU propia zona).
  const zonasUsadas = [...new Set(envios.map((e) => e.id_zona))];
  let zona = "—";
  let tarifaAplicada = null;
  if (zonasUsadas.length === 1) {
    zona = envios[0].zonas.nombre_zona;
    tarifaAplicada = Number(envios[0].zonas.tarifa_por_kg);
  } else if (zonasUsadas.length > 1) {
    zona = "Varias zonas";
  }

  return {
    id_repartidor: repartidor.id_repartidor,
    nombre: repartidor.nombre,
    cantidadEnvios,
    totalKg: Number(totalKg.toFixed(2)),
    zona,
    tarifaAplicada,
    costoTotal: Number(costoTotal.toFixed(2)),
  };
}

async function getReporte(req, res) {
  try {
    const { fechaInicio, fechaFin } = req.query;

    const errorValidacion = validarFechas(fechaInicio, fechaFin);
    if (errorValidacion) {
      return res.status(400).json({ error: errorValidacion });
    }

    const repartidores = await Repartidor.obtenerConEnviosEnRango(supabase, fechaInicio, fechaFin);
    const reporte = repartidores.map(calcularFilaReporte);

    res.json({ fechaInicio, fechaFin, reporte });
  } catch (error) {
    console.error("Error al generar el reporte:", error.message || error);
    res.status(500).json({ error: "Ocurrio un error al generar el reporte." });
  }
}

module.exports = { getReporte };
