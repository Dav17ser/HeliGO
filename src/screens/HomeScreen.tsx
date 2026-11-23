import React, { useEffect, useMemo, useState } from 'react';
import {
  getLocationsByOperatorId,
  getOperators,
  getTours,
  Operator,
  Tour,
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  getDistanceKm,
  useUserLocation,
  type Coordinates,
} from '../hooks/useUserLocation';
import { ExperienceCard } from '../components/ExperienceCard';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import { DESTINATIONS, type Destination } from '../constants/destinations';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Linking,
} from 'react-native';

type HomeNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'Home'
>;

export function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const [tourError, setTourError] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    status: locationStatus,
    coords,
    message: locationMessage,
    requestLocation,
  } = useUserLocation();
  const { session } = useAuth();
  const fullName = session?.user.fullName.trim() ?? '';
  const firstName = fullName.split(/\s+/)[0] ?? '';
  const initials =
    fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join('') ||
    (session?.user.email[0] ?? '').toUpperCase();
  const [tourCoords, setTourCoords] =
    useState<Map<number, Coordinates> | null>(null);

  const toggleFavorite = (tour: Tour) => {
    setFavoriteIds((current) =>
      current.includes(tour.id)
        ? current.filter((id) => id !== tour.id)
        : [...current, tour.id]
    );
  };

  const openExperience = (tour: Tour) => {
    navigation.navigate('ExperienceDetail', {
      tourId: tour.id,
    });
  };
const openDestination = (destination: Destination) => {
  navigation.navigate('DestinationDetail', {
    city: destination.city,
    country: destination.country,
  });
};

  useEffect(() => {
    let active = true;

    async function loadTours() {
      try {
        const data = await getTours();
        if (active) {
          setTours(data);
          setTourError(null);
        }
      } catch (error) {
        if (active) {
          setTourError(
            'No fue posible cargar las experiencias. Intenta nuevamente.'
          );
          console.error('Error cargando tours:', error);
        }
      } finally {
        if (active) setLoadingTours(false);
      }
    }

    async function loadOperators() {
      try {
        const data = await getOperators();
        if (active) setOperators(data);
      } catch (error) {
        // La búsqueda por operador es opcional: sin operadores sigue funcionando por nombre y ubicación.
        console.error('Error cargando operadores:', error);
      }
    }

    loadTours();
    loadOperators();

    return () => {
      active = false;
    };
  }, []);
  // Con la ubicación del usuario, obtiene las coordenadas reales de los puntos
  // de operación de los tours. Todo se calcula localmente en el dispositivo.
  useEffect(() => {
    if (!coords || tours.length === 0) return;
    let active = true;

    const operatorIds = [...new Set(tours.map((tour) => tour.operatorId))];

    Promise.allSettled(
      operatorIds.map((operatorId) => getLocationsByOperatorId(operatorId))
    ).then((results) => {
      if (!active) return;

      const byLocationId = new Map<number, Coordinates>();
      results.forEach((result) => {
        if (result.status !== 'fulfilled') return;
        result.value.forEach((location) => {
          const latitude = Number(location.latitude);
          const longitude = Number(location.longitude);
          if (
            location.isActive &&
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
          ) {
            byLocationId.set(location.id, { latitude, longitude });
          }
        });
      });
      setTourCoords(byLocationId);
    });

    return () => {
      active = false;
    };
  }, [coords, tours]);

  const { nearbyTours, distances } = useMemo(() => {
    const distanceByTour = new Map<number, number>();
    if (!coords || !tourCoords) {
      return { nearbyTours: tours, distances: distanceByTour };
    }

    tours.forEach((tour) => {
      const location = tourCoords.get(tour.serviceLocationId);
      if (location) {
        distanceByTour.set(tour.id, getDistanceKm(coords, location));
      }
    });

    // Los tours sin coordenadas quedan al final y sin distancia.
    const sorted = [...tours].sort((a, b) => {
      const da = distanceByTour.get(a.id);
      const db = distanceByTour.get(b.id);
      if (da === undefined && db === undefined) return 0;
      if (da === undefined) return 1;
      if (db === undefined) return -1;
      return da - db;
    });

    return { nearbyTours: sorted, distances: distanceByTour };
  }, [tours, coords, tourCoords]);

  const hasProximity = distances.size > 0;
  const missingCoordinates =
    coords !== null &&
    tourCoords !== null &&
    tours.length > 0 &&
    !hasProximity;

  const normalizeText = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const normalizedQuery = normalizeText(searchQuery);
  const isSearching = normalizedQuery.length > 0;

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];

    const operatorNames = new Map(
      operators.map((operator) => [operator.id, operator.name])
    );

    return tours.filter((tour) =>
      [
        tour.name,
        tour.city,
        tour.country,
        operatorNames.get(tour.operatorId) ?? '',
      ].some((field) => normalizeText(field).includes(normalizedQuery))
    );
  }, [tours, operators, normalizedQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ENCABEZADO */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {firstName ? `Hola, ${firstName} 👋` : 'Hola 👋'}
            </Text>

            <Text style={styles.subtitle}>
              ¿Listo para ver el mundo desde arriba?
            </Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        {/* BUSCADOR */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="¿Dónde quieres volar?"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
          />

          {searchQuery !== '' && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              accessibilityRole="button"
              accessibilityLabel="Borrar búsqueda"
            >
              <Text style={styles.searchIcon}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* UBICACIÓN */}
        <TouchableOpacity
          style={styles.locationButton}
          onPress={
            locationStatus === 'blocked'
              ? () => Linking.openSettings()
              : requestLocation
          }
          disabled={locationStatus === 'loading'}
        >
          <Text style={styles.locationIcon}>●</Text>

          <Text style={styles.locationText}>
            {locationStatus === 'loading'
              ? 'Obteniendo tu ubicación...'
              : locationStatus === 'blocked'
              ? 'Abrir ajustes de ubicación'
              : coords
              ? 'Ubicación activa · Actualizar'
              : 'Usar mi ubicación'}
          </Text>
        </TouchableOpacity>

        {(locationMessage || missingCoordinates) && (
          <Text style={styles.locationMessage}>
            {locationMessage ??
              'Aún no hay coordenadas de las experiencias para calcular cuáles están cerca de ti.'}
          </Text>
        )}      
{/* RESULTADOS DE BÚSQUEDA */}
{isSearching ? (
  <View style={styles.experiencesSection}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        Resultados de búsqueda
      </Text>
    </View>
    {loadingTours ? (
      <Text style={styles.cardDistance}>
        Buscando experiencias...
      </Text>
    ) : tourError ? (
      <Text style={styles.cardDistance}>
        {tourError}
      </Text>
    ) : searchResults.length === 0 ? (
      <Text style={styles.cardDistance}>
        No encontramos experiencias para "{searchQuery.trim()}". Prueba con otro tour, ciudad u operador.
      </Text>
    ) : (
      <View style={styles.resultsGrid}>
        {searchResults.map((tour) => (
          <ExperienceCard
            key={tour.id}
            tour={tour}
            onPress={openExperience}
            isFavorite={favoriteIds.includes(tour.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </View>
    )}
  </View>
) : (
<>
 {/* EXPERIENCIAS CERCA DE TI */}
<View style={styles.experiencesSection}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>
      {hasProximity ? 'Experiencias cerca de ti' : 'Experiencias disponibles'}
    </Text>
    <TouchableOpacity onPress={() => navigation.navigate('TourList')}>
      <Text style={styles.seeAll}>Ver todas</Text>
    </TouchableOpacity>
  </View>
  {loadingTours ? (
    <Text style={styles.cardDistance}>
      Cargando experiencias...
    </Text>
  ) : tourError ? (
    <Text style={styles.cardDistance}>
      {tourError}
    </Text>
  ) : tours.length === 0 ? (
    <Text style={styles.cardDistance}>
      Próximamente encontrarás nuevas experiencias.
    </Text>
  ) : (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.cardsContainer}
    >
      {nearbyTours.map((tour) => (
        <ExperienceCard
  key={tour.id}
  tour={tour}
  distanceKm={distances.get(tour.id)}
  onPress={openExperience}
  isFavorite={favoriteIds.includes(tour.id)}
  onToggleFavorite={toggleFavorite}
/>
      ))}
    </ScrollView>
  )}
</View>
        {/* BANNER PRINCIPAL */}
        <View style={styles.banner}>
          <Image
            source={require('../../assets/home/helicoptero.jpeg')}
            style={styles.bannerImage}
          />

          <View style={styles.bannerOverlay} />

          <View style={styles.bannerContent}>
            <Text style={styles.bannerSmallText}>
              EXPERIENCIA HELIGO
            </Text>

            <Text style={styles.bannerTitle}>
              Vive Medellín
              {'\n'}
              desde el cielo
            </Text>

            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>
                Explorar experiencia
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DESTINOS */}
        <View style={styles.destinationsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Destinos populares
            </Text>

            <TouchableOpacity>
              <Text style={styles.seeAll}>
                Ver todos
              </Text>
            </TouchableOpacity>
          </View>
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.destinationRow}
>
  {DESTINATIONS.map((destination) => (
    <TouchableOpacity
      key={destination.id}
      style={styles.destinationItem}
      onPress={() => openDestination(destination)}
      activeOpacity={0.8}
    >
      <Image
        source={destination.image}
        style={styles.destinationImage}
      />

      <Text style={styles.destinationText}>
        {destination.city}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>
        </View>
</>
)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  /* HEADER */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    color: '#7B8CA8',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#173B68',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* SEARCH */

  searchContainer: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F4F7FB',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  searchIcon: {
    fontSize: 24,
    color: '#8EA0B8',
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#102A43',
  },

  /* LOCATION */

  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingLeft: 4,
  },

  locationIcon: {
    fontSize: 12,
    color: '#D5A62A',
    marginRight: 8,
  },

  locationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C08C12',
  },

  locationMessage: {
    fontSize: 12,
    color: '#8A9AAF',
    marginTop: 8,
    paddingLeft: 4,
  },

  /* EXPERIENCES */

  experiencesSection: {
    marginTop: 28,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#102A43',
  },

  seeAll: {
    fontSize: 12,
    fontWeight: '700',
    color: '#245B9B',
  },

  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  cardsContainer: {
    gap: 10,
    paddingRight: 10,
  },

  /* CARDS */

  experienceCard: {
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E7ECF2',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 2,
  },

  imageContainer: {
    height: 100,
    position: 'relative',
  },

  cardImage: {
    width: '100%',
    height: '100%',
  },

  priceBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#D7A925',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  priceText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  favoriteIcon: {
    fontSize: 20,
    color: '#7898B4',
  },

  cardContent: {
    padding: 10,
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 5,
  },

  cardLocation: {
    fontSize: 11,
    color: '#8A9AAF',
    marginBottom: 5,
  },

  cardRating: {
    fontSize: 10,
    color: '#D1A12A',
    marginBottom: 5,
  },

  cardDistance: {
    fontSize: 10,
    color: '#8A9AAF',
  },

  /* BANNER */

  banner: {
    height: 210,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 30,
    position: 'relative',
  },

  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  bannerOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },

  bannerContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  bannerSmallText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E8C45A',
    letterSpacing: 1,
    marginBottom: 6,
  },

  bannerTitle: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 14,
  },

  bannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },

  bannerButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#173B68',
  },

  /* DESTINATIONS */

  destinationsSection: {
    marginTop: 30,
  },

  destinationRow: {
  gap: 12,
  paddingRight: 20,
},

  destinationItem: {
  width: 155,
},

  destinationImage: {
    width: '100%',
    height: 95,
  },

  destinationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#102A43',
    padding: 10,
  },
});