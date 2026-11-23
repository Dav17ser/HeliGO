import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

export type LocationStatus =
  | 'idle'
  | 'loading'
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'servicesDisabled'
  | 'timeout'
  | 'error';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

const LOCATION_TIMEOUT_MS = 15000;
const LAST_KNOWN_MAX_AGE_MS = 5 * 60 * 1000;

const STATUS_MESSAGES: Partial<Record<LocationStatus, string>> = {
  denied: 'Sin acceso a tu ubicación no podemos ordenar las experiencias por cercanía.',
  blocked:
    'El permiso de ubicación está bloqueado. Actívalo en los ajustes del dispositivo.',
  servicesDisabled: 'Activa la ubicación (GPS) de tu dispositivo para continuar.',
  timeout: 'No pudimos obtener tu ubicación a tiempo. Intenta nuevamente.',
  error: 'No fue posible obtener tu ubicación. Intenta nuevamente.',
};

// Distancia en km entre dos coordenadas reales (fórmula haversine).
export function getDistanceKm(from: Coordinates, to: Coordinates): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(dLon / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Ubicación del usuario en primer plano. Solo pide el permiso cuando se llama
// a requestLocation; si ya fue concedido antes, la obtiene sin mostrar diálogos.
export function useUserLocation() {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const requesting = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchCoordinates = useCallback(async () => {
    if (requesting.current) return;
    requesting.current = true;
    setStatus('loading');

    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        if (mounted.current) {
          setStatus(permission.canAskAgain ? 'denied' : 'blocked');
        }
        return;
      }

      if (!(await Location.hasServicesEnabledAsync())) {
        if (mounted.current) setStatus('servicesDisabled');
        return;
      }

      // Reutiliza una posición reciente para evitar nuevas lecturas innecesarias.
      let position = await Location.getLastKnownPositionAsync({
        maxAge: LAST_KNOWN_MAX_AGE_MS,
      });

      if (!position) {
        let timer: ReturnType<typeof setTimeout> | undefined;
        const timeout = new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new Error('LOCATION_TIMEOUT')),
            LOCATION_TIMEOUT_MS
          );
        });

        try {
          position = await Promise.race([
            Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            }),
            timeout,
          ]);
        } finally {
          if (timer) clearTimeout(timer);
        }
      }

      if (mounted.current) {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus('granted');
      }
    } catch (error) {
      if (mounted.current) {
        setStatus(
          error instanceof Error && error.message === 'LOCATION_TIMEOUT'
            ? 'timeout'
            : 'error'
        );
      }
    } finally {
      requesting.current = false;
    }
  }, []);

  // Si el permiso ya estaba concedido, obtiene la ubicación sin preguntar de nuevo.
  useEffect(() => {
    Location.getForegroundPermissionsAsync()
      .then((permission) => {
        if (permission.granted && mounted.current) fetchCoordinates();
      })
      .catch(() => {
        // Sin acción: el usuario puede solicitarla manualmente.
      });
  }, [fetchCoordinates]);

  return {
    status,
    coords,
    message: STATUS_MESSAGES[status] ?? null,
    requestLocation: fetchCoordinates,
  };
}
