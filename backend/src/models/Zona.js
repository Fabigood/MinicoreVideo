// src/models/Zona.js
//
// MODELO: acceso a datos de la tabla "zonas" via supabase-js.
// La tabla se crea con el script backend/sql/schema.sql (Supabase no
// permite crear tablas desde el cliente JS, solo desde el SQL Editor
// del panel o via migraciones).

async function insertar(supabase, { nombre_zona, tarifa_por_kg }) {
  const { data, error } = await supabase
    .from("zonas")
    .insert({ nombre_zona, tarifa_por_kg })
    .select()
    .single();

  if (error) throw error;
  return data;
}

module.exports = { insertar };
