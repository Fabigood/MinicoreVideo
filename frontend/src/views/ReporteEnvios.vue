<template>
  <main class="page">
    <section class="header">
      <h1>Costo de envíos por repartidor</h1>
      <p>
        Selecciona un rango de fechas para calcular el costo total de envíos.
      </p>
    </section>

    <section class="card">
      <form class="form" @submit.prevent="buscarReporte">
        <div class="field">
          <label for="fechaInicio">Fecha inicio</label>
          <input id="fechaInicio" v-model="fechaInicio" type="date" required />
        </div>

        <div class="field">
          <label for="fechaFin">Fecha fin</label>
          <input id="fechaFin" v-model="fechaFin" type="date" required />
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? "Calculando..." : "Calcular costos" }}
        </button>
      </form>

      <p v-if="error" class="error">
        {{ error }}
      </p>
    </section>

    <section v-if="reporte.length" class="card">
      <div class="result-header">
        <h2>Resultado</h2>
        <p>
          {{ formatearFecha(fechaInicioConsultada) }}
          -
          {{ formatearFecha(fechaFinConsultada) }}
        </p>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Repartidor</th>
              <th>Envíos</th>
              <th>Total kg</th>
              <th>Zona</th>
              <th>Tarifa/kg</th>
              <th>Costo total</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="fila in reporte"
              :key="fila.id_repartidor"
              :class="{ inactive: fila.cantidadEnvios === 0 }"
            >
              <td>{{ fila.nombre }}</td>

              <td class="number">
                {{ fila.cantidadEnvios }}
              </td>

              <td class="number">
                {{ fila.cantidadEnvios ? `${fila.totalKg} kg` : "-" }}
              </td>

              <td>
                {{ fila.cantidadEnvios ? fila.zona : "-" }}
              </td>

              <td class="number">
                {{
                  fila.tarifaAplicada !== null
                    ? `$${fila.tarifaAplicada.toFixed(2)}`
                    : "-"
                }}
              </td>

              <td class="number">
                {{
                  fila.cantidadEnvios
                    ? `$${fila.costoTotal.toFixed(2)}`
                    : "No aplica"
                }}
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td colspan="5">Total general del período</td>
              <td class="number total">
                ${{ totalGeneral.toFixed(2) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>

    <section
      v-else-if="buscoAlMenosUnaVez && !loading && !error"
      class="card empty"
    >
      <p>No hay repartidores registrados.</p>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { obtenerReporte } from "../services/api";

const fechaInicio = ref("2025-05-01");
const fechaFin = ref("2025-05-31");

const fechaInicioConsultada = ref("");
const fechaFinConsultada = ref("");

const reporte = ref([]);
const loading = ref(false);
const error = ref("");
const buscoAlMenosUnaVez = ref(false);

const totalGeneral = computed(() =>
  reporte.value.reduce((total, fila) => total + fila.costoTotal, 0)
);

function formatearFecha(fechaISO) {
  if (!fechaISO) return "";

  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
}

async function buscarReporte() {
  loading.value = true;
  error.value = "";

  try {
    const data = await obtenerReporte(fechaInicio.value, fechaFin.value);

    reporte.value = data.reporte;
    fechaInicioConsultada.value = data.fechaInicio;
    fechaFinConsultada.value = data.fechaFin;
  } catch (err) {
    error.value = err.message || "No se pudo obtener el reporte.";
    reporte.value = [];
  } finally {
    loading.value = false;
    buscoAlMenosUnaVez.value = true;
  }
}

onMounted(buscarReporte);
</script>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: Arial, Helvetica, sans-serif;
  color: #222;
}

.header {
  margin-bottom: 24px;
}

.header h1 {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 700;
}

.header p {
  margin: 0;
  font-size: 15px;
  color: #555;
}

.card {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 22px;
  margin-bottom: 24px;
}

.form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: end;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 14px;
  font-weight: 600;
}

.field input {
  height: 40px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
}

button {
  height: 40px;
  padding: 0 18px;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
}

button:hover:not(:disabled) {
  background: #1d4ed8;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin-top: 16px;
  padding: 10px 12px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 6px;
  font-size: 14px;
}

.result-header {
  margin-bottom: 16px;
}

.result-header h2 {
  margin: 0 0 4px;
  font-size: 20px;
}

.result-header p {
  margin: 0;
  color: #555;
  font-size: 14px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 650px;
}

th,
td {
  padding: 12px 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  font-size: 14px;
}

th {
  background: #f5f5f5;
  font-weight: 700;
}

.number {
  text-align: right;
}

.inactive {
  color: #777;
}

tfoot td {
  font-weight: 700;
  border-top: 2px solid #222;
  border-bottom: none;
}

.total {
  color: #111;
}

.empty p {
  margin: 0;
  color: #555;
}

@media (max-width: 600px) {
  .page {
    padding: 24px 14px;
  }

  .header h1 {
    font-size: 26px;
  }

  .form {
    flex-direction: column;
    align-items: stretch;
  }

  button {
    width: 100%;
  }
}
</style>