import { database } from "../config/database";
import { Tour } from "../data/models/tour.model";

// Un tour puede no tener ubicación validada (service_location_id NULL,
// migración 007). En ese caso se usa la ciudad del operador y el tour no
// se considera georreferenciado. Si tiene ubicación, debe estar activa y
// pertenecer al mismo operador, como antes.
const TOUR_SELECT = `
  SELECT
    t.id,
    t.operator_id AS "operatorId",
    t.service_location_id AS "serviceLocationId",
    t.name,
    t.description,
    t.price,
    t.currency,
    t.duration_minutes AS "durationMinutes",
    t.image_url AS "imageUrl",
    o.logo_url AS "operatorLogoUrl",
    COALESCE(sl.city, o.city) AS city,
    COALESCE(sl.country, o.country) AS country
  FROM public.tours t
  INNER JOIN public.operators o
    ON o.id = t.operator_id
  LEFT JOIN public.service_locations sl
    ON sl.id = t.service_location_id
    AND sl.is_active = TRUE
    AND sl.operator_id = t.operator_id
  WHERE t.is_active = TRUE
    AND o.is_active = TRUE
    AND (t.service_location_id IS NULL OR sl.id IS NOT NULL)
`;

export class TourRepository {
  async findAllActive(): Promise<Tour[]> {
    const result = await database.query(`
      ${TOUR_SELECT}
      ORDER BY t.created_at DESC, t.id DESC
    `);

    return result.rows as Tour[];
  }

  async findById(id: number): Promise<Tour | undefined> {
    const result = await database.query(
      `
        ${TOUR_SELECT}
        AND t.id = $1
      `,
      [id]
    );

    return result.rows[0] as Tour | undefined;
  }
}
