import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import { getTourById, Tour } from '../services/api';

type DetailRoute = RouteProp<AppStackParamList, 'ExperienceDetail'>;

export function ExperienceDetailScreen() {
  const route = useRoute<DetailRoute>();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    getTourById(route.params.tourId)
      .then((data) => {
        if (active) setTour(data);
      })
      .catch((err) => {
        console.error('Error cargando detalle:', err);
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [route.params.tourId]);

  const price = tour
    ? new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: tour.currency || 'COP',
        maximumFractionDigits: 0,
      }).format(Number(tour.price))
    : '';

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#173B68" />
        <Text style={styles.message}>Cargando experiencia...</Text>
      </View>
    );
  }

  if (error || !tour) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          No fue posible cargar esta experiencia.
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        {tour.imageUrl ? (
          <Image source={{ uri: tour.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.logo}>HELiGO</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>‹ Volver</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.city}>{tour.city}, {tour.country}</Text>
        <Text style={styles.title}>{tour.name}</Text>

        <Text style={styles.price}>{price}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.info}>⏱ {tour.durationMinutes} minutos</Text>
          <Text style={styles.info}>🚁 Experiencia aérea</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Sobre esta experiencia</Text>
        <Text style={styles.description}>
          {tour.description || 'Próximamente encontrarás más información sobre esta experiencia.'}
        </Text>

        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactText}>Consultar disponibilidad</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: { color: '#526579', marginTop: 12 },
  image: { width: '100%', height: 270 },
  placeholder: {
    height: 270,
    backgroundColor: '#173B68',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { color: '#FFFFFF', fontSize: 28, fontWeight: '800' },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButtonText: { color: '#173B68', fontWeight: '700' },
  content: { padding: 22 },
  city: {
    color: '#C08C12',
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 8,
  },
  title: { color: '#102A43', fontSize: 25, fontWeight: '800' },
  price: {
    color: '#173B68',
    fontSize: 23,
    fontWeight: '800',
    marginTop: 14,
  },
  infoRow: { flexDirection: 'row', gap: 18, marginTop: 18 },
  info: { color: '#526579', fontSize: 13 },
  divider: {
    height: 1,
    backgroundColor: '#E7ECF2',
    marginVertical: 24,
  },
  sectionTitle: {
    color: '#102A43',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  description: { color: '#64748B', fontSize: 15, lineHeight: 23 },
  contactButton: {
    backgroundColor: '#173B68',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  contactText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  backText: { color: '#173B68', marginTop: 15, fontWeight: '700' },
});
