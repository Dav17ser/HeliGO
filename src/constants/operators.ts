import type { ImageSourcePropType } from 'react-native';
import type { Operator } from '../services/api';

// Imágenes locales de operadores, indexadas por nombre normalizado, porque
// el id se asigna al cargar el operador en la base (migración 008).
// La imagen local tiene prioridad sobre logo_url.
//
// PENDIENTE: confirmar visualmente que assets/operators/Barco.jpeg
// corresponde a Barco Volar.
const LOCAL_OPERATOR_IMAGES: Record<string, ImageSourcePropType> = {
  'barco volar': require('../../assets/operators/Barco.jpeg'),
};

function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function getOperatorImage(
  operator: Pick<Operator, 'name' | 'logoUrl'>
): ImageSourcePropType | null {
  const local = LOCAL_OPERATOR_IMAGES[normalizeName(operator.name)];
  if (local) return local;

  return operator.logoUrl ? { uri: operator.logoUrl } : null;
}
