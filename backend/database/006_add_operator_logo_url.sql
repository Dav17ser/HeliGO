-- HeliGO · 006
-- Alinea el esquema versionado con producción: el backend ya consulta
-- operators.logo_url, pero la columna no estaba en 001_create_operators.sql.
-- Idempotente: no hace nada si la columna ya existe.
--
-- ESTADO: propuesta para revisión. NO ejecutada.

ALTER TABLE public.operators
    ADD COLUMN IF NOT EXISTS logo_url TEXT;
