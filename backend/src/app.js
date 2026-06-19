const express = require("express");
const cors = require("cors");
const reporteRoutes = require("./routes/reporteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "Backend funcionando",
    endpoints: [
      "/api/health",
      "/api/reporte?fechaInicio=2025-05-01&fechaFin=2025-05-31"
    ]
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", reporteRoutes);

module.exports = app;