-- HeliGO
-- Datos de prueba para Bogotá y Cartagena.
-- Seguro para ejecutar varias veces: evita duplicar los registros creados aquí.
-- No modifica ni elimina los registros existentes.

BEGIN;

-- 1. Operadores de prueba
INSERT INTO public.operators
    (name, description, contact_email, city, country, is_active)
SELECT
    'HeliGO Operador Bogotá',
    'Operador ficticio para pruebas de desarrollo.',
    'bogota-pruebas@example.com',
    'Bogotá',
    'Colombia',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM public.operators
    WHERE name = 'HeliGO Operador Bogotá'
      AND city = 'Bogotá'
);

INSERT INTO public.operators
    (name, description, contact_email, city, country, is_active)
SELECT
    'HeliGO Operador Cartagena',
    'Operador ficticio para pruebas de desarrollo.',
    'cartagena-pruebas@example.com',
    'Cartagena',
    'Colombia',
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM public.operators
    WHERE name = 'HeliGO Operador Cartagena'
      AND city = 'Cartagena'
);

-- 2. Ubicaciones de servicio
INSERT INTO public.service_locations
    (operator_id, name, address, city, country, latitude, longitude, is_active)
SELECT
    o.id,
    'Base de pruebas Bogotá',
    'Ubicación ficticia; confirmar instalaciones autorizadas antes de operar.',
    'Bogotá',
    'Colombia',
    4.7110,
    -74.0721,
    TRUE
FROM public.operators o
WHERE o.name = 'HeliGO Operador Bogotá'
  AND o.city = 'Bogotá'
  AND NOT EXISTS (
      SELECT 1
      FROM public.service_locations sl
      WHERE sl.operator_id = o.id
        AND sl.name = 'Base de pruebas Bogotá'
  );

INSERT INTO public.service_locations
    (operator_id, name, address, city, country, latitude, longitude, is_active)
SELECT
    o.id,
    'Base de pruebas Cartagena',
    'Ubicación ficticia; confirmar instalaciones autorizadas antes de operar.',
    'Cartagena',
    'Colombia',
    10.3910,
    -75.4794,
    TRUE
FROM public.operators o
WHERE o.name = 'HeliGO Operador Cartagena'
  AND o.city = 'Cartagena'
  AND NOT EXISTS (
      SELECT 1
      FROM public.service_locations sl
      WHERE sl.operator_id = o.id
        AND sl.name = 'Base de pruebas Cartagena'
  );

-- 3. Experiencias de prueba
INSERT INTO public.tours
    (operator_id, service_location_id, name, description,
     price, currency, duration_minutes, is_active)
SELECT
    o.id,
    sl.id,
    'Experiencia de prueba Bogotá',
    'Experiencia ficticia para validar el catálogo de HeliGO.',
    350000,
    'COP',
    20,
    TRUE
FROM public.operators o
JOIN public.service_locations sl
  ON sl.operator_id = o.id
WHERE o.name = 'HeliGO Operador Bogotá'
  AND o.city = 'Bogotá'
  AND sl.name = 'Base de pruebas Bogotá'
  AND NOT EXISTS (
      SELECT 1
      FROM public.tours t
      WHERE t.name = 'Experiencia de prueba Bogotá'
        AND t.service_location_id = sl.id
  );

INSERT INTO public.tours
    (operator_id, service_location_id, name, description,
     price, currency, duration_minutes, is_active)
SELECT
    o.id,
    sl.id,
    'Experiencia de prueba Cartagena',
    'Experiencia ficticia para validar el catálogo de HeliGO.',
    450000,
    'COP',
    25,
    TRUE
FROM public.operators o
JOIN public.service_locations sl
  ON sl.operator_id = o.id
WHERE o.name = 'HeliGO Operador Cartagena'
  AND o.city = 'Cartagena'
  AND sl.name = 'Base de pruebas Cartagena'
  AND NOT EXISTS (
      SELECT 1
      FROM public.tours t
      WHERE t.name = 'Experiencia de prueba Cartagena'
        AND t.service_location_id = sl.id
  );

COMMIT;
