// src/models/Repartidor.js
//
// MODELO: acceso a datos de la tabla "repartidores" via supabase-js.

async function insertar(supabase, { nombre, email }) {
  const { data, error } = await supabase
    .from("repartidores")
    .insert({ nombre, email: email ?? null })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Trae TODOS los repartidores junto con sus envios DENTRO del rango de
// fechas, usando un "embed" de supabase-js (left join por la relacion
// definida con la llave foranea id_repartidor). Un repartidor sin
// envios en el rango llega igual, con envios: [] — asi se cumple el
// requisito 3 del enunciado de mostrarlo con costo $0 / "No aplica" en
// vez de omitirlo. Cada envio trae embebidos los datos de su zona.
//
// Nota: filtrar sobre una relacion embebida (.gte/.lte en "envios.…")
// NO convierte el join en INNER; solo limita que envios aparecen
// dentro de cada repartidor. Eso es justamente lo que necesitamos.
async function obtenerConEnviosEnRango(supabase, fechaInicio, fechaFin) {
  const { data, error } = await supabase
    .from("repartidores")
    .select(
      `
      id_repartidor,
      nombre,
      email,
      envios (
        id_envio,
        peso_kg,
        fecha_envio,
        id_zona,
        zonas ( id_zona, nombre_zona, tarifa_por_kg )
      )
    `
    )
    .gte("envios.fecha_envio", fechaInicio)
    .lte("envios.fecha_envio", fechaFin)
    .order("nombre", { ascending: true });

  if (error) throw error;
  return data;
}

module.exports = { insertar, obtenerConEnviosEnRango };
