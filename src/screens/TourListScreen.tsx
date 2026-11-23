import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import { getTours, Tour } from '../services/api';
import { ExperienceCard } from '../components/ExperienceCard';

type Props = NativeStackScreenProps<AppStackParamList, 'TourList'>;

export function TourListScreen({ navigation }: Props) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const toggleFavorite = (tour: Tour) => {
    setFavoriteIds((current) =>
      current.includes(tour.id)
        ? current.filter((id) => id !== tour.id)
        : [...current, tour.id]
    );
  };

  useEffect(() => {
    let active = true;

    async function loadTours() {
      try {
        const data = await getTours();
        if (active) {
          setTours(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(
            'No fue posible cargar las experiencias. Intenta nuevamente.'
          );
          console.error('Error cargando tours:', err);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTours();

    return () => {
      active = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Volver"
          >
            <Text style={styles.backText}>‹ Volver</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Todas las experiencias</Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#173B68"
            style={styles.loader}
          />
        ) : error ? (
          <Text style={styles.message}>{error}</Text>
        ) : tours.length === 0 ? (
          <Text style={styles.message}>
            Próximamente encontrarás nuevas experiencias.
          </Text>
        ) : (
          <View style={styles.grid}>
            {tours.map((tour) => (
              <ExperienceCard
                key={tour.id}
                tour={tour}
                onPress={(selected) =>
                  navigation.navigate('ExperienceDetail', {
                    tourId: selected.id,
                  })
                }
                isFavorite={favoriteIds.includes(tour.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </View>
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
  header: {
    marginBottom: 18,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  message: {
    fontSize: 13,
    color: '#718096',
    lineHeight: 20,
  },
  loader: {
    marginVertical: 35,
  },
});
