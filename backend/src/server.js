// src/server.js
//
// Punto de entrada. Al arrancar:
//   1. Siembra Supabase con datos de ejemplo (borra y reinserta), para
//      que el reporte siempre tenga datos de demo, tanto en local como
//      en el host donde se despliegue. Requiere haber corrido antes
//      backend/sql/schema.sql en el SQL Editor de Supabase.
//   2. Levanta el servidor Express.

require("dotenv").config();
const app = require("./app");
const seed = require("./seed");

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await seed();
    app.listen(PORT, () => {
      console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
      console.log(`Prueba: http://localhost:${PORT}/api/reporte?fechaInicio=2025-05-01&fechaFin=2025-05-31`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error);
    process.exit(1);
  }
}

start();
