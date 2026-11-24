import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import {
  getLocationsByOperatorId,
  getOperators,
  Operator,
  ServiceLocation,
} from '../services/api';
import {
  formatDistanceKm,
  getDistanceKm,
  useUserLocation,
} from '../hooks/useUserLocation';
import { getOperatorImage } from '../constants/operators';

type Props = NativeStackScreenProps<AppStackParamList, 'OperatorsMap'>;

type OperatorPin = {
  key: string;
  operator: Operator;
  location: ServiceLocation;
  latitude: number;
  longitude: number;
};

// Vista inicial de Colombia solo para encuadrar el mapa; no representa
// la ubicación de ningún operador.
const COLOMBIA_REGION: Region = {
  latitude: 4.6,
  longitude: -74.1,
  latitudeDelta: 12,
  longitudeDelta: 12,
};

export function OperatorsMapScreen({ navigation }: Props) {
  const mapRef = useRef<MapView>(null);
  const [pins, setPins] = useState<OperatorPin[]>([]);
  const [totalOperators, setTotalOperators] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<OperatorPin | null>(null);
  const {
    status: locationStatus,
    coords,
    message: locationMessage,
    requestLocation,
  } = useUserLocation();

  useEffect(() => {
    let active = true;

    async function loadPins() {
      try {
        const operators = await getOperators();
        const results = await Promise.allSettled(
          operators.map((operator) => getLocationsByOperatorId(operator.id))
        );

        // Operador → base → coordenadas. Solo bases activas, con
        // coordenadas válidas y que pertenezcan a ese mismo operador.
        const verified: OperatorPin[] = [];
        const seen = new Set<string>();

        results.forEach((result, index) => {
          if (result.status !== 'fulfilled') return;
          const operator = operators[index];

          result.value.forEach((location) => {
            const latitude = Number(location.latitude);
            const longitude = Number(location.longitude);

            if (
              String(location.operatorId) !== String(operator.id) ||
              !location.isActive ||
              !Number.isFinite(latitude) ||
              !Number.isFinite(longitude)
            ) {
              return;
            }

            // Registros idénticos (mismo operador, nombre y coordenadas) se
            // dibujan una sola vez para no apilar marcadores. No altera datos.
            const signature = `${operator.id}|${location.name.trim().toLowerCase()}|${latitude}|${longitude}`;
            if (seen.has(signature)) return;
            seen.add(signature);

            verified.push({
              key: `${operator.id}-${location.id}`,
              operator,
              location,
              latitude,
              longitude,
            });
          });
        });

        if (active) {
          setPins(verified);
          setTotalOperators(operators.length);
          setError(null);
        }
      } catch (err) {
        console.error('Error cargando operadores del mapa:', err);
        if (active) {
          setError('No fue posible cargar los operadores. Intenta nuevamente.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPins();

    return () => {
      active = false;
    };
  }, []);

  // Encuadra los marcadores disponibles una vez cargados.
  useEffect(() => {
    if (pins.length === 0) return;
    const timer = setTimeout(() => {
      mapRef.current?.fitToCoordinates(
        pins.map(({ latitude, longitude }) => ({ latitude, longitude })),
        {
          edgePadding: { top: 80, right: 60, bottom: 220, left: 60 },
          animated: true,
        }
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [pins]);

  const operatorsWithPins = useMemo(
    () => new Set(pins.map((pin) => pin.operator.id)).size,
    [pins]
  );

  const selectedDistance =
    selected && coords
      ? formatDistanceKm(
          getDistanceKm(coords, {
            latitude: selected.latitude,
            longitude: selected.longitude,
          })
        )
      : null;

  const selectedImage = selected ? getOperatorImage(selected.operator) : null;

  const centerOnUser = () => {
    if (!coords) {
      requestLocation();
      return;
    }
    mapRef.current?.animateToRegion(
      { ...coords, latitudeDelta: 0.08, longitudeDelta: 0.08 },
      500
    );
  };

  // Mismo patrón de contacto que ExperienceDetail: correo y, si no, teléfono.
  const contactOperator = async (operator: Operator) => {
    const url = operator.contactEmail
      ? `mailto:${operator.contactEmail}?subject=${encodeURIComponent(
          'Consulta desde HeliGO'
        )}`
      : operator.contactPhone
      ? `tel:${operator.contactPhone.replace(/\s+/g, '')}`
      : null;

    if (!url) {
      Alert.alert(
        'Contacto no disponible',
        'Este operador aún no tiene datos de contacto registrados.'
      );
      return;
    }

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        'No fue posible abrir el contacto',
        'Intenta nuevamente en unos minutos.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <Text style={styles.backText}>‹ Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mapa de operadores</Text>
        {!loading && !error && (
          <Text style={styles.subtitle}>
            {operatorsWithPins} de {totalOperators} operadores con ubicación
            verificada
          </Text>
        )}
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={COLOMBIA_REGION}
          showsUserLocation={coords !== null}
          showsMyLocationButton={false}
          onPress={(event) => {
            // En algunas plataformas, tocar un marcador también dispara el
            // onPress del mapa; solo se cierra la ficha al tocar el mapa.
            if (event.nativeEvent.action !== 'marker-press') {
              setSelected(null);
            }
          }}
        >
          {pins.map((pin) => {
            const isSelected = selected?.key === pin.key;

            return (
              <Marker
                key={pin.key}
                identifier={pin.key}
                coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
                anchor={{ x: 0.5, y: 1 }}
                onPress={() => setSelected(pin)}
                accessibilityLabel={pin.operator.name}
              >
                <View style={styles.markerContainer}>
                  <View
                    style={[
                      styles.markerLabel,
                      isSelected && styles.markerLabelSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.markerText,
                        isSelected && styles.markerTextSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {pin.operator.name}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.markerDot,
                      isSelected && styles.markerDotSelected,
                    ]}
                  />
                </View>
              </Marker>
            );
          })}
        </MapView>

        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#173B68" />
            <Text style={styles.message}>Cargando operadores...</Text>
          </View>
        )}

        {!loading && (error || pins.length === 0) && (
          <View style={styles.banner}>
            <Text style={styles.message}>
              {error ??
                'Aún no hay operadores con ubicación verificada. Puedes encontrarlos en el catálogo.'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.locateButton}
          onPress={
            locationStatus === 'blocked'
              ? () => Linking.openSettings()
              : centerOnUser
          }
          disabled={locationStatus === 'loading'}
          accessibilityRole="button"
          accessibilityLabel="Centrar en mi ubicación"
        >
          <Text style={styles.locateText}>
            {locationStatus === 'loading'
              ? 'Ubicando...'
              : locationStatus === 'blocked'
              ? 'Abrir ajustes'
              : '● Mi ubicación'}
          </Text>
        </TouchableOpacity>

        {locationMessage && !selected && (
          <View style={[styles.banner, styles.bannerBottom]}>
            <Text style={styles.message}>{locationMessage}</Text>
          </View>
        )}

        {selected && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              {selectedImage && (
                <Image
                  source={selectedImage}
                  style={styles.cardImage}
                  resizeMode="cover"
                  accessibilityLabel={`Imagen de ${selected.operator.name}`}
                />
              )}
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>{selected.operator.name}</Text>
                <Text style={styles.cardDetail}>📍 {selected.location.name}</Text>
                {selected.location.address && (
                  <Text style={styles.cardDetail} numberOfLines={2}>
                    {selected.location.address}
                  </Text>
                )}
              </View>
            </View>
            {selectedDistance && (
              <Text style={styles.cardDistance}>
                A {selectedDistance} de ti (en línea recta)
              </Text>
            )}
            {selected.operator.description && (
              <Text style={styles.cardDescription} numberOfLines={2}>
                {selected.operator.description}
              </Text>
            )}

            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() =>
                  navigation.navigate('DestinationDetail', {
                    city: selected.location.city,
                    country: selected.location.country,
                  })
                }
              >
                <Text style={styles.primaryText}>Ver experiencias</Text>
              </TouchableOpacity>

              {(selected.operator.contactEmail ||
                selected.operator.contactPhone) && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => contactOperator(selected.operator)}
                >
                  <Text style={styles.secondaryText}>Contactar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#245B9B',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#102A43',
  },
  subtitle: {
    fontSize: 12,
    color: '#7B8CA8',
    marginTop: 4,
  },
  mapContainer: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  banner: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E7ECF2',
    elevation: 3,
  },
  bannerBottom: {
    top: undefined,
    bottom: 16,
  },
  message: {
    fontSize: 13,
    color: '#718096',
    lineHeight: 20,
    textAlign: 'center',
  },
  locateButton: {
    position: 'absolute',
    right: 16,
    top: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
  },
  locateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C08C12',
  },
  card: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7ECF2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  cardHeaderText: {
    flex: 1,
    gap: 3,
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#EAF0F6',
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerLabel: {
    maxWidth: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#173B68',
  },
  markerLabelSelected: {
    backgroundColor: '#173B68',
  },
  markerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#173B68',
  },
  markerTextSelected: {
    color: '#FFFFFF',
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 3,
    backgroundColor: '#173B68',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerDotSelected: {
    backgroundColor: '#D7A925',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 6,
  },
  cardDetail: {
    fontSize: 12,
    color: '#64748B',
  },
  cardDistance: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D1A12A',
    marginTop: 6,
  },
  cardDescription: {
    fontSize: 12,
    color: '#718096',
    lineHeight: 18,
    marginTop: 8,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  primaryButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#173B68',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#173B68',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: '#173B68',
    fontSize: 13,
    fontWeight: '700',
  },
});
