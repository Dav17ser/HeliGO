CREATE TABLE public.service_locations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    operator_id BIGINT NOT NULL
        REFERENCES public.operators(id)
        ON DELETE CASCADE,

    name VARCHAR(150) NOT NULL,
    address TEXT,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'Colombia',

    latitude DOUBLE PRECISION NOT NULL
        CHECK (latitude BETWEEN -90 AND 90),

    longitude DOUBLE PRECISION NOT NULL
        CHECK (longitude BETWEEN -180 AND 180),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_service_locations_operator_id
    ON public.service_locations(operator_id);

CREATE INDEX idx_service_locations_city
    ON public.service_locations(city);

ALTER TABLE public.service_locations ENABLE ROW LEVEL SECURITY;
