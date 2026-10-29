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
