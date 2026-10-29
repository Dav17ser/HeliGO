import { database } from "../config/database";

export interface ServiceLocation {
  id: number;
  operatorId: number;
  name: string;
  address: string | null;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

export interface Destination {
  city: string;
  country: string;
}

export class ServiceLocationRepository {
  async findAllByOperatorId(
    operatorId: number
  ): Promise<ServiceLocation[]> {
    const result = await database.query(
      `
        SELECT
          id,
          operator_id AS "operatorId",
          name,
          address,
          city,
          country,
          latitude,
          longitude,
          is_active AS "isActive"
        FROM public.service_locations
        WHERE operator_id = $1
          AND is_active = TRUE
        ORDER BY name ASC
      `,
      [operatorId]
    );

    return result.rows as ServiceLocation[];
  }

async findAllActiveDestinations(): Promise<Destination[]> {
    const result = await database.query(`
      SELECT DISTINCT
        sl.city,
        sl.country
      FROM public.service_locations sl
      INNER JOIN public.operators o
        ON o.id = sl.operator_id
      WHERE sl.is_active = TRUE
        AND o.is_active = TRUE
      ORDER BY sl.country ASC, sl.city ASC
    `);

    return result.rows as Destination[];
  }
}