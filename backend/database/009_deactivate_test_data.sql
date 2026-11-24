-- HeliGO · 009
-- Desactiva (sin borrar) los registros de prueba para que no se mezclen
-- con los operadores reales de 008 en el catálogo ni en el mapa.
-- La API ya filtra por is_active = TRUE.
--
-- ESTADO: propuesta para revisión. NO ejecutada.
-- Aplicar después de 008 y de verificar que los operadores reales se ven.
--
-- Seguridad: cada UPDATE exige que coincidan el id y el nombre exacto que
-- devolvía producción el 24/11/2026. Si un id fue reutilizado por un
-- registro real, no coincide el nombre y no se modifica.
--
-- Registros de prueba:
--   operators         2 'Operador de prueba HeliGO'   (creado fuera de 005)
--                     5 'HeliGO Operador Bogotá'      (005)
--                     6 'HeliGO Operador Cartagena'   (005)
--   service_locations 2 'Base de pruebas HeliGO'      (creada fuera de 005)
--                     3 'Base de pruebas Bogotá'      (005)
--                     4 'Base de pruebas Bogotá'      (DUPLICADO exacto de 3:
--                                                      mismo operador, nombre,
--                                                      dirección y coordenadas)
--                     5 'Base de pruebas Cartagena'   (005)
--   tours             1 'Experiencia de prueba HeliGO'
--                     2 'Experiencia de prueba Bogotá'
--                     3 'Experiencia de prueba Cartagena'
--
-- El duplicado de Bogotá (3 y 4) se documenta y se desactiva junto con el
-- resto; no se borra ningún registro.

BEGIN;

UPDATE public.tours
SET is_active = FALSE, updated_at = NOW()
WHERE (id, name) IN (
    (1, 'Experiencia de prueba HeliGO'),
    (2, 'Experiencia de prueba Bogotá'),
    (3, 'Experiencia de prueba Cartagena')
);

UPDATE public.service_locations
SET is_active = FALSE, updated_at = NOW()
WHERE (id, name) IN (
    (2, 'Base de pruebas HeliGO'),
    (3, 'Base de pruebas Bogotá'),
    (4, 'Base de pruebas Bogotá'),
    (5, 'Base de pruebas Cartagena')
);

UPDATE public.operators
SET is_active = FALSE, updated_at = NOW()
WHERE (id, name) IN (
    (2, 'Operador de prueba HeliGO'),
    (5, 'HeliGO Operador Bogotá'),
    (6, 'HeliGO Operador Cartagena')
);

-- Comprobación antes del COMMIT: deben quedar 3 / 4 / 3 inactivos.
-- SELECT
--   (SELECT count(*) FROM public.operators WHERE id IN (2,5,6) AND NOT is_active) AS operators,
--   (SELECT count(*) FROM public.service_locations WHERE id IN (2,3,4,5) AND NOT is_active) AS locations,
--   (SELECT count(*) FROM public.tours WHERE id IN (1,2,3) AND NOT is_active) AS tours;

COMMIT;

-- Reversión (restaura exactamente los mismos registros):
-- BEGIN;
-- UPDATE public.operators SET is_active = TRUE, updated_at = NOW()
--   WHERE (id, name) IN ((2, 'Operador de prueba HeliGO'), (5, 'HeliGO Operador Bogotá'), (6, 'HeliGO Operador Cartagena'));
-- UPDATE public.service_locations SET is_active = TRUE, updated_at = NOW()
--   WHERE (id, name) IN ((2, 'Base de pruebas HeliGO'), (3, 'Base de pruebas Bogotá'), (4, 'Base de pruebas Bogotá'), (5, 'Base de pruebas Cartagena'));
-- UPDATE public.tours SET is_active = TRUE, updated_at = NOW()
--   WHERE (id, name) IN ((1, 'Experiencia de prueba HeliGO'), (2, 'Experiencia de prueba Bogotá'), (3, 'Experiencia de prueba Cartagena'));
-- COMMIT;
