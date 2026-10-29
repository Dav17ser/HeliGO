import { database } from "../config/database";
import { Tour } from "../data/models/tour.model";

export class TourRepository {
  async findAllActive(): Promise<Tour[]> {
    const result = await database.query(`
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
        sl.city,
        sl.country
      FROM public.tours t
      INNER JOIN public.operators o
        ON o.id = t.operator_id
      INNER JOIN public.service_locations sl
        ON sl.id = t.service_location_id
      WHERE t.is_active = TRUE
        AND o.is_active = TRUE
        AND sl.is_active = TRUE
        AND sl.operator_id = t.operator_id
      ORDER BY t.created_at DESC, t.id DESC
    `);

    return result.rows as Tour[];
  }

  async findById(id: number): Promise<Tour | undefined> {
    const result = await database.query(
      `
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
          sl.city,
          sl.country
        FROM public.tours t
        INNER JOIN public.operators o
          ON o.id = t.operator_id
        INNER JOIN public.service_locations sl
          ON sl.id = t.service_location_id
        WHERE t.id = $1
          AND t.is_active = TRUE
          AND o.is_active = TRUE
          AND sl.is_active = TRUE
          AND sl.operator_id = t.operator_id
      `,
      [id]
    );

    return result.rows[0] as Tour | undefined;
  }
}
