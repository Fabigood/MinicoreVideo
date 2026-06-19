// src/models/index.js
//
// Punto de entrada unico al MODELO: expone el cliente de Supabase y
// los 3 modelos (Repartidor, Zona, Envio).

const supabase = require("../config/database");
const Repartidor = require("./Repartidor");
const Zona = require("./Zona");
const Envio = require("./Envio");

module.exports = { supabase, Repartidor, Zona, Envio };
