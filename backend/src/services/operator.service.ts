
import { Operator } from "../data/models/operator.model";

export class OperatorService {
  private operators: Operator[] = [
    {
      id: 1,
      name: "Volar Colombia",
      country: "Colombia",
      city: "Medellín",
      description: "Experiencias y vuelos en helicóptero.",
      contactEmail: "contacto@volarcolombia.com",
      contactPhone: "+57 300 000 0000",
    },
    {
      id: 2,
      name: "Operador de prueba Río",
      country: "Brasil",
      city: "Río de Janeiro",
      description: "Tours panorámicos en helicóptero.",
      contactEmail: "contacto@example.com",
      contactPhone: "+55 21 0000 0000",
    },
  ];

  getAll(): Operator[] {
    return this.operators;
  }

  getById(id: number): Operator | undefined {
    return this.operators.find((operator) => operator.id === id);
  }
}
