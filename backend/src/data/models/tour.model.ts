export interface Tour {
  id: number;
  operatorId: number;
  // NULL = información pendiente de confirmación (migración 007).
  serviceLocationId: number | null;
  name: string;
  description: string | null;
  price: string | null;
  currency: string;
  durationMinutes: number | null;
  imageUrl: string | null;
  operatorLogoUrl: string | null;
  city: string;
  country: string;
}
