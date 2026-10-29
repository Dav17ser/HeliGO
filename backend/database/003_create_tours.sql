CREATE TABLE public.tours (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    operator_id BIGINT NOT NULL
        REFERENCES public.operators(id)
        ON DELETE RESTRICT,

    service_location_id BIGINT NOT NULL
        REFERENCES public.service_locations(id)
        ON DELETE RESTRICT,

    name VARCHAR(150) NOT NULL,
    description TEXT,

    price NUMERIC(12, 2) NOT NULL
        CHECK (price >= 0),

    currency VARCHAR(3) NOT NULL DEFAULT 'COP',

    duration_minutes INTEGER NOT NULL
        CHECK (duration_minutes > 0),

    image_url TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT tours_name_location_unique
        UNIQUE (name, service_location_id)
);

CREATE INDEX idx_tours_operator_id
    ON public.tours(operator_id);

CREATE INDEX idx_tours_service_location_id
    ON public.tours(service_location_id);

CREATE INDEX idx_tours_active
    ON public.tours(is_active);

ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
