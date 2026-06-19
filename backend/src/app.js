const express = require("express");
const reporteRoutes = require("./routes/reporteRoutes");

const app = express();

/* CORS */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

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