const API_BASE_URL = "http://172.26.13.40:3000/heligo";

export interface Tour {
  id: number;
  operatorId: number;
  serviceLocationId: number;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  durationMinutes: number;
  imageUrl: string | null;
  city: string;
  country: string;
}

export async function getTours(): Promise<Tour[]> {
  const response = await fetch(`${API_BASE_URL}/tours`);

  if (!response.ok) {
    throw new Error(
      `Error al consultar tours: ${response.status}`
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("La API no devolvió una lista de tours");
  }

  return data as Tour[];
}

export async function getTourById(id: number): Promise<Tour> {
  const response = await fetch(`${API_BASE_URL}/tours/${id}`);

  if (!response.ok) {
    throw new Error(`Error al consultar el tour: ${response.status}`);
  }

  return response.json() as Promise<Tour>;
}
