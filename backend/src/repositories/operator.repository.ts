import { database } from "../config/database";
import { Operator } from "../data/models/operator.model";

export class OperatorRepository {
  async findAll(): Promise<Operator[]> {
    const result = await database.query(`
      SELECT
        id,
        name,
        country,
        city,
        description,
        contact_email AS "contactEmail",
        contact_phone AS "contactPhone"
      FROM public.operators
      WHERE is_active = TRUE
      ORDER BY name ASC
    `);

    return result.rows as Operator[];
  }

  async findById(id: number): Promise<Operator | undefined> {
    const result = await database.query(
      `
        SELECT
          id,
          name,
          country,
          city,
          description,
          contact_email AS "contactEmail",
          contact_phone AS "contactPhone"
        FROM public.operators
        WHERE id = $1 AND is_active = TRUE
      `,
      [id]
    );

    return result.rows[0] as Operator | undefined;
  }
}
