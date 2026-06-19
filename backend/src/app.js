// src/app.js
//
// Configura la aplicacion Express: middlewares y montaje de rutas.
// Separado de server.js para poder testear/importar la app sin
// necesariamente levantar un puerto.

const express = require("express");
const cors = require("cors");
const reporteRoutes = require("./routes/reporteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", reporteRoutes);

module.exports = app;
