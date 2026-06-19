// src/seed.js
//
// Siembra (seed) las tablas de Supabase con datos de ejemplo. Requiere
// que ya hayas corrido backend/sql/schema.sql en el SQL Editor de
// Supabase (este script NO crea tablas, solo datos).
//
// Borra los datos previos y vuelve a insertar, asi siempre queda en
// un estado conocido sin duplicar filas en cada arranque.
//
// Los envios de Andres y Camila reproducen EXACTAMENTE el ejemplo del
// enunciado al filtrar 01/05/2025 - 31/05/2025:
//   Andres -> 5 envios, 32 kg, Zona Norte ($1.50/kg) -> costo $48.00
//   Camila -> 3 envios, 18 kg, Zona Sur   ($2.00/kg) -> costo $36.00
//   Luis   -> 0 envios en el rango (tiene envios en abril, fuera de rango)
// Sofia se agrega con envios en DOS zonas dentro del mismo rango, para
// mostrar el caso "varias zonas" que menciona la nota del enunciado.

const { supabase, Repartidor, Zona, Envio } = require("./models");

async function limpiarTablas() {
  // El orden importa por las llaves foraneas: primero envios, luego
  // repartidores y zonas. ".neq(id, 0)" es el truco usual de Supabase
  // para poder hacer DELETE de todas las filas (siempre exige un
  // filtro de seguridad).
  await supabase.from("envios").delete().neq("id_envio", 0);
  await supabase.from("repartidores").delete().neq("id_repartidor", 0);
  await supabase.from("zonas").delete().neq("id_zona", 0);
}

async function seed() {
  await limpiarTablas();

  const norte = await Zona.insertar(supabase, { nombre_zona: "Norte", tarifa_por_kg: 1.5 });
  const sur = await Zona.insertar(supabase, { nombre_zona: "Sur", tarifa_por_kg: 2.0 });
  const centro = await Zona.insertar(supabase, { nombre_zona: "Centro", tarifa_por_kg: 1.75 });

  const andres = await Repartidor.insertar(supabase, {
    nombre: "Andrés Pérez",
    email: "andres.perez@example.com",
  });
  const camila = await Repartidor.insertar(supabase, {
    nombre: "Camila Torres",
    email: "camila.torres@example.com",
  });
  const luis = await Repartidor.insertar(supabase, {
    nombre: "Luis Fernández",
    email: "luis.fernandez@example.com",
  });
  const sofia = await Repartidor.insertar(supabase, {
    nombre: "Sofía Ramírez",
    email: "sofia.ramirez@example.com",
  });

  await Envio.insertarMuchos(supabase, [
    // Andrés - Zona Norte - 5 envios - 32 kg total (dentro de mayo 2025)
    { id_repartidor: andres.id_repartidor, id_zona: norte.id_zona, peso_kg: 6, fecha_envio: "2025-05-03" },
    { id_repartidor: andres.id_repartidor, id_zona: norte.id_zona, peso_kg: 7, fecha_envio: "2025-05-08" },
    { id_repartidor: andres.id_repartidor, id_zona: norte.id_zona, peso_kg: 5, fecha_envio: "2025-05-12" },
    { id_repartidor: andres.id_repartidor, id_zona: norte.id_zona, peso_kg: 8, fecha_envio: "2025-05-20" },
    { id_repartidor: andres.id_repartidor, id_zona: norte.id_zona, peso_kg: 6, fecha_envio: "2025-05-27" },

    // Camila - Zona Sur - 3 envios - 18 kg total (dentro de mayo 2025)
    { id_repartidor: camila.id_repartidor, id_zona: sur.id_zona, peso_kg: 5, fecha_envio: "2025-05-05" },
    { id_repartidor: camila.id_repartidor, id_zona: sur.id_zona, peso_kg: 6, fecha_envio: "2025-05-15" },
    { id_repartidor: camila.id_repartidor, id_zona: sur.id_zona, peso_kg: 7, fecha_envio: "2025-05-25" },

    // Luis - envios en ABRIL 2025 (fuera del rango de ejemplo) -> 0 envios en mayo
    { id_repartidor: luis.id_repartidor, id_zona: centro.id_zona, peso_kg: 4, fecha_envio: "2025-04-10" },
    { id_repartidor: luis.id_repartidor, id_zona: centro.id_zona, peso_kg: 3, fecha_envio: "2025-04-20" },

    // Sofía - envios en DOS zonas distintas dentro de mayo 2025 (caso "varias zonas")
    { id_repartidor: sofia.id_repartidor, id_zona: norte.id_zona, peso_kg: 4, fecha_envio: "2025-05-02" },
    { id_repartidor: sofia.id_repartidor, id_zona: centro.id_zona, peso_kg: 5, fecha_envio: "2025-05-18" },
  ]);

  console.log("Base de datos (Supabase) sembrada correctamente.");
  console.log("Prueba el reporte con el rango 2025-05-01 a 2025-05-31 para ver el ejemplo del enunciado.");
}

// Permite ejecutar "npm run seed" de forma independiente, y tambien se
// reusa desde server.js para sembrar automaticamente al arrancar.
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Error al sembrar Supabase:", err.message || err);
      process.exit(1);
    });
}

module.exports = seed;
