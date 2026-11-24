-- HeliGO · 007
-- Permite registrar experiencias con información pendiente de confirmación.
--
--   price IS NULL               -> precio por confirmar con el operador.
--   duration_minutes IS NULL    -> duración por confirmar.
--   service_location_id IS NULL -> sin ubicación validada: el tour NO se
--                                  considera georreferenciado.
--
-- Los CHECK existentes se conservan: PostgreSQL acepta NULL en un CHECK,
-- pero sigue rechazando precios negativos y duraciones <= 0.
-- La llave foránea a service_locations se conserva.
--
-- Compatibilidad: el backend (tour.repository.ts) usa LEFT JOIN y funciona
-- antes y después de aplicar esta migración.
--
-- ESTADO: propuesta para revisión. NO ejecutada.

BEGIN;

ALTER TABLE public.tours ALTER COLUMN price DROP NOT NULL;
ALTER TABLE public.tours ALTER COLUMN duration_minutes DROP NOT NULL;
ALTER TABLE public.tours ALTER COLUMN service_location_id DROP NOT NULL;

COMMENT ON COLUMN public.tours.price IS
    'NULL = precio pendiente de confirmación con el operador';
COMMENT ON COLUMN public.tours.duration_minutes IS
    'NULL = duración pendiente de confirmación';
COMMENT ON COLUMN public.tours.service_location_id IS
    'NULL = sin ubicación validada; el tour no se georreferencia';

COMMIT;

-- Reversión (solo si ningún tour tiene valores NULL en estas columnas):
-- ALTER TABLE public.tours ALTER COLUMN price SET NOT NULL;
-- ALTER TABLE public.tours ALTER COLUMN duration_minutes SET NOT NULL;
-- ALTER TABLE public.tours ALTER COLUMN service_location_id SET NOT NULL;
