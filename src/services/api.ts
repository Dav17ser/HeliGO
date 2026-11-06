const API_BASE_URL = "http://172.20.10.6:3000/heligo";

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
export interface Operator {
  id: number;
  name: string;
  country: string;
  city: string;
  description: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
}

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
export async function getOperatorById(
  id: number
): Promise<Operator> {
  const response = await fetch(
    `${API_BASE_URL}/operators/${id}`
  );

  if (!response.ok) {
    throw new Error(
      `Error al consultar el operador: ${response.status}`
    );
  }

  return response.json() as Promise<Operator>;
}

export async function getLocationsByOperatorId(
  operatorId: number
): Promise<ServiceLocation[]> {
  const response = await fetch(
    `${API_BASE_URL}/locations/operator/${operatorId}`
  );

  if (!response.ok) {
    throw new Error(
      `Error al consultar las ubicaciones: ${response.status}`
    );
  }

  return response.json() as Promise<ServiceLocation[]>;
}