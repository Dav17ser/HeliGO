export interface Destination {
  id: string;
  city: string;
  country: string;
  image: any;
}

export const DESTINATIONS: Destination[] = [
  {
    id: 'medellin',
    city: 'Medellín',
    country: 'Colombia',
    image: require('../../assets/home/medellin.jpeg'),
  },
  {
    id: 'cartagena',
    city: 'Cartagena',
    country: 'Colombia',
    image: require('../../assets/home/cartagena.jpeg'),
  },
  {
    id: 'bogota',
    city: 'Bogotá',
    country: 'Colombia',
    image: require('../../assets/home/bogota.jpeg'),
  },
];
