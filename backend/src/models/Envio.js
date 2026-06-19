// src/models/Envio.js
//
// MODELO: acceso a datos de la tabla "envios" via supabase-js.
// El costo de un envio nunca se guarda en esta tabla: se calcula en
// el controlador como peso_kg * tarifa_por_kg de la zona, leyendo
// siempre la tarifa vigente (ver Repartidor.obtenerConEnviosEnRango,
// que ya trae la zona de cada envio embebida).

async function insertarMuchos(supabase, envios) {
  const { data, error } = await supabase.from("envios").insert(envios).select();
  if (error) throw error;
  return data;
}

module.exports = { insertarMuchos };
