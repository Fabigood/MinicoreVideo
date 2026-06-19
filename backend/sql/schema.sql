-- schema.sql
--
-- Ejecuta este script UNA VEZ en Supabase: panel de tu proyecto >
-- "SQL Editor" > "New query" > pega esto > Run.
--
-- Crea las 3 tablas que pide el enunciado (Repartidor, Envios, Zonas)
-- con sus llaves foraneas. El backend (seed.js) llena los datos de
-- ejemplo despues de correr este script.

create table if not exists zonas (
  id_zona bigint generated always as identity primary key,
  nombre_zona text not null,
  tarifa_por_kg numeric(10, 2) not null
);

create table if not exists repartidores (
  id_repartidor bigint generated always as identity primary key,
  nombre text not null,
  email text
);

create table if not exists envios (
  id_envio bigint generated always as identity primary key,
  id_repartidor bigint not null references repartidores (id_repartidor) on delete cascade,
  id_zona bigint not null references zonas (id_zona) on delete restrict,
  peso_kg numeric(10, 2) not null,
  fecha_envio date not null
);

create index if not exists idx_envios_fecha on envios (fecha_envio);
create index if not exists idx_envios_repartidor on envios (id_repartidor);
create index if not exists idx_envios_zona on envios (id_zona);

-- Nota sobre RLS (Row Level Security):
-- Por defecto, las tablas creadas asi NO tienen RLS activado, asi que
-- no hace falta crear politicas para este ejercicio. El backend de
-- todas formas usa la SERVICE ROLE KEY, que siempre ignora RLS.
