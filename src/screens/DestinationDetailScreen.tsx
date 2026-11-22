import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList } from '../types/navigation';
import {
  getOperators,
  getTours,
  getLocationsByOperatorId,
  Operator,
  Tour,
  ServiceLocation,
} from '../services/api';
import { DESTINATIONS } from '../constants/destinations';

type Props = NativeStackScreenProps<
  AppStackParamList,
  'DestinationDetail'
>;

export function DestinationDetailScreen({ route, navigation }: Props) {
  const { city, country } = route.params;

  const [operators, setOperators] = useState<Operator[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [locations, setLocations] = useState<ServiceLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const destination = DESTINATIONS.find(
    (item) => item.city === city && item.country === country
  );

  useEffect(() => {
    let active = true;

    async function loadDestinationData() {
      try {
        setLoading(true);
        setError(null);

        const [allOperators, allTours] = await Promise.all([
          getOperators(),
          getTours(),
        ]);

        const cityOperators = allOperators.filter(
          (operator) =>
            operator.city.toLowerCase() === city.toLowerCase() &&
            operator.country.toLowerCase() === country.toLowerCase()
        );

        const cityTours = allTours.filter(
          (tour) =>
            tour.city.toLowerCase() === city.toLowerCase() &&
            tour.country.toLowerCase() === country.toLowerCase()
        );

        const locationResults = await Promise.all(
          cityOperators.map((operator) =>
            getLocationsByOperatorId(operator.id)
          )
        );

        const cityLocations = locationResults.flat();

        if (active) {
          setOperators(cityOperators);
          setTours(cityTours);
          setLocations(cityLocations);
        }
      } catch (err) {
        console.error('Error cargando destino:', err);

        if (active) {
          setError('No fue posible cargar la información del destino.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDestinationData();

    return () => {
      active = false;
    };
  }, [city, country]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroContainer}>
        {destination && (
          <Image
            source={destination.image}
            style={styles.heroImage}
          />
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹ Volver</Text>
        </TouchableOpacity>

        <View style={styles.heroOverlay}>
          <Text style={styles.country}>{country}</Text>
          <Text style={styles.city}>{city}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Descubre experiencias aéreas y disfruta de este destino desde otra perspectiva.
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#173B68"
            style={styles.loader}
          />
        ) : error ? (
          <Text style={styles.message}>{error}</Text>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              Operadores disponibles
            </Text>

            {operators.length === 0 ? (
              <Text style={styles.message}>
                Próximamente encontrarás operadores en este destino.
              </Text>
            ) : (
              operators.map((operator) => (
                <View key={operator.id} style={styles.infoCard}>
                  <Text style={styles.cardTitle}>
                    {operator.name}
                  </Text>

                  {operator.description && (
                    <Text style={styles.cardDescription}>
                      {operator.description}
                    </Text>
                  )}

                  {operator.contactPhone && (
                    <Text style={styles.cardDetail}>
                      Teléfono: {operator.contactPhone}
                    </Text>
                  )}

                  {operator.contactEmail && (
                    <Text style={styles.cardDetail}>
                      Correo: {operator.contactEmail}
                    </Text>
                  )}
                </View>
              ))
            )}

            <Text style={styles.sectionTitle}>
              Experiencias disponibles
            </Text>

            {tours.length === 0 ? (
              <Text style={styles.message}>
                Próximamente encontrarás nuevas experiencias en este destino.
              </Text>
            ) : (
              tours.map((tour) => (
                <TouchableOpacity
                  key={tour.id}
                  style={styles.infoCard}
                  onPress={() =>
                    navigation.navigate('ExperienceDetail', {
                      tourId: tour.id,
                    })
                  }
                  activeOpacity={0.8}
                >
                  <Text style={styles.cardTitle}>
                    {tour.name}
                  </Text>

                  {tour.description && (
                    <Text style={styles.cardDescription}>
                      {tour.description}
                    </Text>
                  )}

                  <Text style={styles.cardDetail}>
                    Duración: {tour.durationMinutes} minutos
                  </Text>

                  <Text style={styles.price}>
                    {tour.currency} {tour.price}
                  </Text>

                  <Text style={styles.linkText}>
                    Ver experiencia →
                  </Text>
                </TouchableOpacity>
              ))
            )}

            <Text style={styles.sectionTitle}>
              Puntos de operación
            </Text>

            {locations.length === 0 ? (
              <Text style={styles.message}>
                No hay ubicaciones registradas para este destino.
              </Text>
            ) : (
              locations.map((location) => (
                <View key={location.id} style={styles.infoCard}>
                  <Text style={styles.cardTitle}>
                    {location.name}
                  </Text>

                  {location.address && (
                    <Text style={styles.cardDetail}>
                      {location.address}
                    </Text>
                  )}
                </View>
              ))
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroContainer: {
    height: 280,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 18,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  backText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  country: {
    color: '#E8C45A',
    fontSize: 12,
    fontWeight: '700',
  },
  city: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 22,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#102A43',
    marginTop: 15,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#F7F9FC',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E7ECF2',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 7,
  },
  cardDescription: {
    fontSize: 13,
    color: '#718096',
    lineHeight: 20,
    marginBottom: 8,
  },
  cardDetail: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 5,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#173B68',
    marginTop: 10,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#245B9B',
    marginTop: 12,
  },
  message: {
    fontSize: 13,
    color: '#718096',
    marginBottom: 15,
    lineHeight: 20,
  },
  loader: {
    marginVertical: 35,
  },
});
