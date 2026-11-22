const API_BASE_URL = 'http://172.26.13.20:3000/heligo';
// MODELOS

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
  operatorLogoUrl: string | null;
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
  logoUrl: string | null;
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

// FUNCIÓN GENERAL PARA CONSULTAR LA API

async function apiRequest<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(
      `Error en la consulta ${endpoint}: ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}

// EXPERIENCIAS

export async function getTours(): Promise<Tour[]> {
  const data = await apiRequest<unknown>('/tours');

  if (!Array.isArray(data)) {
    throw new Error('La API no devolvió una lista de experiencias');
  }

  return data as Tour[];
}

export async function getTourById(id: number): Promise<Tour> {
  return apiRequest<Tour>(`/tours/${id}`);
}

// OPERADORES

export async function getOperatorById(
  id: number
): Promise<Operator> {
  return apiRequest<Operator>(`/operators/${id}`);
}

export async function getOperators(): Promise<Operator[]> {
  const data = await apiRequest<unknown>('/operators');

  if (!Array.isArray(data)) {
    throw new Error('La API no devolvió una lista de operadores');
  }

  return data as Operator[];
}

// UBICACIONES

export async function getLocationsByOperatorId(
  operatorId: number
): Promise<ServiceLocation[]> {
  return apiRequest<ServiceLocation[]>(
    `/locations/operator/${operatorId}`
  );
}
