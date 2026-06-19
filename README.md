# Costo de envíos por repartidor — Mini Core MVC

**Stack:** Vue 3 (Vista) · Node.js / Express (Controlador) · Supabase / PostgreSQL vía `supabase-js` (Modelo)

Aplicación mínima que resuelve el ejercicio de logística: dado un rango
de fechas, calcula cuánto generó cada repartidor sumando, por cada uno
de sus envíos, `peso_kg × tarifa_por_kg` de la zona de entrega.

## 1. Qué resuelve

Una sola pantalla con un formulario de **Fecha Inicio / Fecha Fin**. Al
enviarlo, el backend filtra los envíos de ese rango y devuelve, por
repartidor: cantidad de envíos, total de kg, zona, tarifa aplicada y
costo total. Si un repartidor no tuvo envíos en el rango, se muestra
con costo "No aplica" en vez de ocultarlo.

## 2. Cómo se aplicó el patrón MVC

```
envios-mvc/
├── backend/                  # Modelo + Controlador
│   ├── sql/schema.sql              # Script para crear las 3 tablas en Supabase
│   ├── src/
│   │   ├── config/database.js      # Cliente de Supabase (supabase-js)
│   │   ├── models/                 # MODELO: acceso a datos
│   │   │   ├── Repartidor.js          # incluye la consulta con JOIN embebido
│   │   │   ├── Zona.js
│   │   │   ├── Envio.js
│   │   │   └── index.js
│   │   ├── controllers/
│   │   │   └── reporteController.js   # CONTROLADOR: valida fechas,
│   │   │                                # pide datos al modelo y
│   │   │                                # calcula el reporte
│   │   ├── routes/reporteRoutes.js    # Mapea la URL al controlador
│   │   ├── seed.js                    # Datos de ejemplo (seed data)
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
└── frontend/                 # Vista
    ├── src/
    │   ├── views/ReporteEnvios.vue   # VISTA: formulario + tabla
    │   ├── services/api.js           # Llama al backend (fetch)
    │   ├── App.vue
    │   └── main.js
    └── package.json
```

- **Modelo** (`backend/src/models`): usa el cliente oficial **`supabase-js`**
  para hablar con la base de datos de Supabase (Postgres) via su API REST.
  `Repartidor.obtenerConEnviosEnRango` hace un único query que trae todos
  los repartidores junto con sus envíos del rango (embebidos via la
  relación de llave foránea), y cada envío trae embebida su zona —
  todo en una sola llamada, sin N+1 queries.
- **Controlador** (`backend/src/controllers/reporteController.js`):
  valida las fechas recibidas, le pide al modelo el dato ya anidado y
  aplica la regla de negocio: `costoTotal = Σ (peso_kg × tarifa_por_kg)`.
- **Vista** (`frontend/src/views/ReporteEnvios.vue`): componente Vue 3
  con el formulario de fechas y la tabla de resultados; solo conoce el
  endpoint HTTP del controlador, no la base de datos.

## 3. Modelo de datos (3 tablas)

`repartidores(id_repartidor, nombre, email)` · `zonas(id_zona, nombre_zona, tarifa_por_kg)` · `envios(id_envio, id_repartidor, id_zona, peso_kg, fecha_envio)`, tal como las define el enunciado. Se crean con `backend/sql/schema.sql` y se siembran automáticamente (no hay CRUD ni formulario de ingreso, según lo permite el enunciado).

## 4. Configurar Supabase (una sola vez)

1. Crea un proyecto en [supabase.com](https://supabase.com) (plan gratuito).
2. Ve a **SQL Editor** → **New query**, pega el contenido de
   `backend/sql/schema.sql` y dale **Run**. Esto crea las 3 tablas.
3. Ve a **Project Settings → API** y copia:
   - **Project URL** → será tu `SUPABASE_URL`
   - **service_role key** (no la `anon public`) → será tu `SUPABASE_SERVICE_ROLE_KEY`

   ⚠️ La `service_role key` tiene acceso total a la base de datos.
   Úsala solo en el backend (`.env`), nunca en el frontend ni la subas
   a un repositorio público.

## 5. Cómo correrlo en local

### Backend

```bash
cd backend
cp .env.example .env     # y completa SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY
npm install
npm run dev               # http://localhost:4000
```

Al arrancar, el servidor siembra automáticamente Supabase con datos de
ejemplo (borra y reinserta, para no duplicar filas en cada arranque).

Para reproducir el ejemplo exacto del enunciado, prueba:
`http://localhost:4000/api/reporte?fechaInicio=2025-05-01&fechaFin=2025-05-31`

### Frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

La vista ya viene precargada con el rango `01/05/2025 – 31/05/2025`
(el mismo ejemplo del enunciado), así que al abrirla vas a ver de
inmediato: Andrés ($48.00), Camila ($36.00) y Luis sin envíos en el
período.

Si el backend corre en otra URL, copia `frontend/.env.example` a
`frontend/.env` y ajusta `VITE_API_URL`.

## 6. Despliegue

- **Backend**: cualquier host de Node (Railway, Render, etc.).
  Comando de build: `npm install`. Comando de inicio: `npm start`.
  Configura las variables de entorno `SUPABASE_URL` y
  `SUPABASE_SERVICE_ROLE_KEY` en el panel del host (las mismas del
  paso 4). El host asigna `PORT` automáticamente.
- **Frontend**: `npm run build` genera `frontend/dist` (sitio estático).
  Antes de compilar, define `VITE_API_URL` con la URL pública del
  backend ya desplegado.
- **Supabase**: no se despliega nada, ya es un servicio en la nube;
  solo asegúrate de haber corrido `schema.sql` en el proyecto correcto.
  ## 7.Link Video
  https://youtu.be/5HsApc8ABmg

