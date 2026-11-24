-- HeliGO · 008
-- Operadores turísticos reales, sus bases verificadas y sus experiencias.
--
-- ESTADO: propuesta para revisión. NO ejecutada.
-- REQUIERE: 006 y 007 aplicadas (los tours se insertan con precio NULL y,
--           en varios casos, sin ubicación).
-- IDEMPOTENTE: cada INSERT omite registros existentes (comparación por
--              nombre sin distinguir mayúsculas).
-- No modifica ni desactiva los datos de prueba existentes.
--
-- Criterios:
--   * Solo se usan datos publicados por el propio operador (sitio oficial,
--     consultado el 24/11/2026). Lo no confirmado queda en NULL.
--   * Precios: NULL. Los sitios publican tarifas, pero se tratan como
--     referencia comercial no confirmada para HeliGO.
--   * Duraciones: solo cuando el operador publica los minutos de vuelo.
--   * Coordenadas: solo cuando el sitio oficial del operador enlaza una
--     ubicación de Google Maps con latitud/longitud explícitas.
--   * Sin coordenadas verificadas no se crea service_location: el operador
--     y sus experiencias aparecen en el catálogo, pero no en el mapa.
--
-- Pendientes de confirmación con los operadores (no bloquean la carga):
--   * VOLAR COLOMBIA: se registra 'comercial@volarcolombia.com', tal como
--     figura en su sitio. Se reportó también 'commercial@'; confirmar.
--   * "Restaurante Marmoleo" se reportó para VOLAR COLOMBIA, pero solo
--     Fly Colombia lo publica; se asigna a Fly Colombia. VOLAR conserva
--     "Experiencias gastronómicas", que sí publica.
--   * Helitours: ciudad 'Guatapé' (operador sin base georreferenciada);
--     sus experiencias aparecen en el destino Guatapé del catálogo.
--
-- Fuentes:
--   VOLAR COLOMBIA  https://volarcolombia.com/  (contacto en el pie de página)
--   FLY COLOMBIA    https://flycolombia.com.co/ (sección "Contáctenos")
--   HELITOURS       https://helitours.com.co/   (teléfono y tours en portada)
--   BARCO VOLAR     https://www.barcovolar.co/  (sección "Oficina" y contacto)

BEGIN;

-- 1. Operadores ---------------------------------------------------------------

INSERT INTO public.operators
    (name, description, contact_email, contact_phone, website, city, country, is_active)
SELECT v.name, v.description, v.contact_email, v.contact_phone, v.website, v.city, 'Colombia', TRUE
FROM (VALUES
    (
        'VOLAR COLOMBIA',
        'Operador de turismo y vuelos chárter en helicóptero con base en los hangares del Aeropuerto Olaya Herrera (Calle 5 #65F-00, Hangar 38), Medellín.',
        'comercial@volarcolombia.com'::varchar,
        '+57 314 752 6927'::varchar,
        'https://volarcolombia.com/'::varchar,
        'Medellín'
    ),
    (
        'Fly Colombia City Tour',
        'Tours en helicóptero por Medellín y Antioquia desde el Aeropuerto Olaya Herrera.',
        -- El correo publicado en el sitio apunta a un dominio de hosting
        -- temporal; no se registra hasta confirmar el correo comercial.
        NULL::varchar,
        '+57 301 640 2620'::varchar,
        'https://flycolombia.com.co/'::varchar,
        'Medellín'
    ),
    (
        'Helitours Colombia',
        'Vuelos panorámicos en helicóptero sobre la represa y la Piedra del Peñol, con salida desde el Helipuerto HTS, Km 10 vía El Peñol–Guatapé.',
        NULL::varchar,
        '+57 319 402 7205'::varchar,
        'https://helitours.com.co/'::varchar,
        'Guatapé'
    ),
    (
        'Barco Volar',
        'Paseo en barco por la bahía de Cartagena con vuelo en helicóptero desde el barco. Operador independiente de VOLAR COLOMBIA (no se verificó relación comercial).',
        'reservas@barcovolar.co'::varchar,
        '+57 300 239 0316'::varchar,
        'https://www.barcovolar.co/'::varchar,
        'Cartagena'
    )
) AS v(name, description, contact_email, contact_phone, website, city)
WHERE NOT EXISTS (
    SELECT 1 FROM public.operators o WHERE lower(o.name) = lower(v.name)
);

-- 2. Bases con coordenadas verificadas ---------------------------------------
--
-- Fly Colombia: pin "fly colombia" enlazado en el pie del sitio oficial
--   (Google Maps, place 0x8e4429d9680ae4f9:0x1d87f236a83929c1).
--   El mismo sitio enlaza "Pilot Shop, Calle 5 #65E-40" en 6.2130051,
--   -75.5881144 (a unos 35 m).
-- Barco Volar: "Oficina" enlazada en el sitio oficial (Google Maps
--   query=10.3994765,-75.5594481). Es la oficina comercial, no
--   necesariamente el punto de embarque.
--
-- PENDIENTES (no se crean):
--   VOLAR COLOMBIA: el sitio enlaza un share.google que no se pudo resolver.
--   Helitours: el sitio oficial no publica coordenadas. Un directorio de
--   terceros (maptons.com) indica 6.2250616, -75.1802618; requiere
--   confirmación del operador antes de usarse.

INSERT INTO public.service_locations
    (operator_id, name, address, city, country, latitude, longitude, is_active)
SELECT o.id, v.name, v.address, v.city, 'Colombia', v.latitude, v.longitude, TRUE
FROM (VALUES
    (
        'Fly Colombia City Tour',
        'Base Fly Colombia – Hangares Aeropuerto Olaya Herrera',
        'Calle 5 #65E-40, Medellín',
        'Medellín',
        6.2131439::double precision,
        -75.5884883::double precision
    ),
    (
        'Barco Volar',
        'Oficina Barco Volar – C.C. El Pueblito',
        'C.C. El Pueblito, Local 8, Cra. 2 #4-115, Bocagrande',
        'Cartagena',
        10.3994765::double precision,
        -75.5594481::double precision
    )
) AS v(operator_name, name, address, city, latitude, longitude)
INNER JOIN public.operators o
    ON lower(o.name) = lower(v.operator_name)
WHERE NOT EXISTS (
    SELECT 1 FROM public.service_locations sl
    WHERE sl.operator_id = o.id AND lower(sl.name) = lower(v.name)
);

-- 3. Experiencias ---------------------------------------------------------------
--
-- location_name NULL = sin ubicación validada (no se georreferencia).
-- Solo Fly Colombia publica que sus tours salen de su base en Olaya Herrera.
-- Las experiencias "Restaurante Marmoleo" reportadas para VOLAR COLOMBIA no
-- aparecen en su sitio (sí en el de Fly Colombia); no se cargan para VOLAR.

INSERT INTO public.tours
    (operator_id, service_location_id, name, description, price, duration_minutes)
SELECT o.id, sl.id, v.name, v.description, NULL, v.duration_minutes
FROM (VALUES
    -- VOLAR COLOMBIA (volarcolombia.com/volar-turismo/)
    ('VOLAR COLOMBIA', NULL::text, 'Paseo en helicóptero por Medellín',
        'Sobrevuelo panorámico de Medellín.', NULL::integer),
    ('VOLAR COLOMBIA', NULL::text, 'Experiencia familiar en helicóptero',
        'Vuelo en helicóptero para grupos familiares.', NULL::integer),
    ('VOLAR COLOMBIA', NULL::text, 'Guatapé con aterrizaje',
        'Vuelo a Guatapé con aterrizaje.', NULL::integer),
    ('VOLAR COLOMBIA', NULL::text, 'Santa Fe de Antioquia en helicóptero',
        'Vuelo en helicóptero a Santa Fe de Antioquia.', NULL::integer),
    ('VOLAR COLOMBIA', NULL::text, 'Hacienda Nápoles en helicóptero',
        'Vuelo en helicóptero a Hacienda Nápoles.', NULL::integer),
    ('VOLAR COLOMBIA', NULL::text, 'Experiencias gastronómicas en helicóptero',
        'Vuelo en helicóptero combinado con experiencia gastronómica.', NULL::integer),

    -- Fly Colombia City Tour (flycolombia.com.co)
    ('Fly Colombia City Tour', 'Base Fly Colombia – Hangares Aeropuerto Olaya Herrera',
        'Vuelo en helicóptero por Medellín · 10 minutos',
        'Paseo en helicóptero sobre Medellín a 330 metros sobre el terreno.', 10),
    ('Fly Colombia City Tour', 'Base Fly Colombia – Hangares Aeropuerto Olaya Herrera',
        'Helicopter tour Comuna 13',
        'Tour en helicóptero sobre la Comuna 13 de Medellín, con salida desde el Aeropuerto Olaya Herrera.', NULL::integer),
    ('Fly Colombia City Tour', 'Base Fly Colombia – Hangares Aeropuerto Olaya Herrera',
        'Ruta Urbana privada',
        'Vuelo privado en helicóptero por Medellín.', NULL::integer),
    ('Fly Colombia City Tour', 'Base Fly Colombia – Hangares Aeropuerto Olaya Herrera',
        'Guatapé en helicóptero',
        'Traslado en helicóptero desde Medellín hasta Guatapé.', NULL::integer),
    ('Fly Colombia City Tour', 'Base Fly Colombia – Hangares Aeropuerto Olaya Herrera',
        'Restaurante Marmoleo en helicóptero',
        'Recorrido por la ciudad en helicóptero con aterrizaje en el Restaurante Marmoleo.', NULL::integer),

    -- Helitours Colombia (helitours.com.co): minutos de vuelo publicados.
    ('Helitours Colombia', NULL::text, 'Vuelo Guatapé · 6 minutos',
        'Vuelo panorámico compartido sobre la represa y la Piedra del Peñol.', 6),
    ('Helitours Colombia', NULL::text, 'Vuelo Guatapé · 8 minutos',
        'Vuelo panorámico compartido sobre la represa y la Piedra del Peñol.', 8),
    ('Helitours Colombia', NULL::text, 'Vuelo familiar Guatapé · 6 minutos',
        'Vuelo privado para un grupo de hasta 6 personas o 400 kg.', 6),

    -- Barco Volar (barcovolar.co): 12 km de vuelo; minutos no publicados.
    ('Barco Volar', NULL::text, 'Barco + helicóptero · Mañana',
        'Paseo en barco por la bahía y vuelo de 12 km sobre Bocagrande, el Centro Histórico, el Castillo San Felipe, El Laguito y Tierra Bomba. Horario publicado: 10:00 a. m. – 2:45 p. m.', NULL::integer),
    ('Barco Volar', NULL::text, 'Barco + helicóptero · Tarde',
        'Paseo en barco por la bahía y vuelo de 12 km sobre Bocagrande, el Centro Histórico, el Castillo San Felipe, El Laguito y Tierra Bomba. Horario publicado: 3:00 p. m. – 5:30 p. m.', NULL::integer)
) AS v(operator_name, location_name, name, description, duration_minutes)
INNER JOIN public.operators o
    ON lower(o.name) = lower(v.operator_name)
LEFT JOIN public.service_locations sl
    ON sl.operator_id = o.id AND lower(sl.name) = lower(v.location_name)
WHERE NOT EXISTS (
    SELECT 1 FROM public.tours t
    WHERE t.operator_id = o.id AND lower(t.name) = lower(v.name)
);

COMMIT;
