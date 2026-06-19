// src/config/database.js
//
// Cliente de Supabase (API REST sobre PostgreSQL) usado por el backend.
//
// Se usa la SERVICE ROLE KEY (no la "anon key") porque este cliente
// corre en el backend, un entorno de confianza, y necesita poder leer
// e insertar en las 3 tablas sin depender de politicas de Row Level
// Security (RLS). Esta llave tiene acceso total a la base de datos:
// NUNCA debe usarse en el frontend ni subirse a un repositorio publico.

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Faltan SUPABASE_URL y/o SUPABASE_SECRET_KEY. " +
      "Copia backend/.env.example a backend/.env y completa los valores " +
      "desde tu proyecto de Supabase (Project Settings > API)."
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

module.exports = supabase;
