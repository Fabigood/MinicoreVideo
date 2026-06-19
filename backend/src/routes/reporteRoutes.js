// src/routes/reporteRoutes.js
//
// Define el endpoint que consume la vista de Vue.
//   GET /api/reporte?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD

const express = require("express");
const { getReporte } = require("../controllers/reporteController");

const router = express.Router();

router.get("/reporte", getReporte);

module.exports = router;
