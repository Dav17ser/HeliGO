import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import { getTourById, getOperatorById, getLocationsByOperatorId, getTours, Operator, ServiceLocation, Tour } from '../services/api';

type DetailRoute = RouteProp<AppStackParamList, 'ExperienceDetail'>;

export function ExperienceDetailScreen() {
  const route = useRoute<DetailRoute>();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [tour, setTour] = useState<Tour | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [locations, setLocations] = useState<ServiceLocation[]>([]);
  const [relatedTours, setRelatedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
  let active = true;

  const loadExperienceDetails = async () => {
    try {
      setLoading(true);
      setError(false);

      const tourData = await getTourById(route.params.tourId);

      if (!active) return;

      setTour(tourData);

      const [operatorResult, locationsResult, toursResult] =
        await Promise.allSettled([
          getOperatorById(tourData.operatorId),
          getLocationsByOperatorId(tourData.operatorId),
          getTours(),
        ]);

      if (!active) return;

      if (operatorResult.status === 'fulfilled') {
        setOperator(operatorResult.value);
      }

      if (locationsResult.status === 'fulfilled') {
        setLocations(locationsResult.value);
      }

      if (toursResult.status === 'fulfilled') {
        setRelatedTours(
          toursResult.value.filter(
            (item) =>
              item.operatorId === tourData.operatorId &&
              item.id !== tourData.id
          )
        );
      }
    } catch (err) {
      console.error('Error cargando la experiencia:', err);
      if (active) {
        setError(true);
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  };

  loadExperienceDetails();

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
  {/* Imagen principal */}
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

  {/* Información principal */}
  <View style={styles.content}>
    <Text style={styles.city}>
      {tour.city}, {tour.country}
    </Text>

    <Text style={styles.title}>{tour.name}</Text>

    <Text style={styles.price}>{price}</Text>

    <View style={styles.infoRow}>
      <Text style={styles.info}>
        ⏱ {tour.durationMinutes} minutos
      </Text>
      <Text style={styles.info}>🚁 Experiencia aérea</Text>
    </View>

    <View style={styles.divider} />

    {/* Descripción */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Sobre esta experiencia</Text>
      <Text style={styles.description}>
        {tour.description ||
          'Próximamente encontrarás más información sobre esta experiencia.'}
      </Text>
    </View>

    {/* Operador */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Operado por</Text>

      {operator ? (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>{operator.name}</Text>

          <Text style={styles.cardSubtitle}>
            {operator.city}, {operator.country}
          </Text>

          {operator.description && (
            <Text style={styles.description}>
              {operator.description}
            </Text>
          )}

          {operator.contactEmail && (
            <Text style={styles.cardDetail}>
              Correo: {operator.contactEmail}
            </Text>
          )}

          {operator.contactPhone && (
            <Text style={styles.cardDetail}>
              Teléfono: {operator.contactPhone}
            </Text>
          )}
        </View>
      ) : (
        <Text style={styles.emptyText}>
          Información del operador no disponible.
        </Text>
      )}
    </View>

    {/* Ubicaciones del operador */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Ubicaciones de operación
      </Text>

      {locations.length > 0 ? (
        locations.map((location) => (
          <View key={location.id} style={styles.infoCard}>
            <Text style={styles.cardTitle}>{location.name}</Text>

            <Text style={styles.cardSubtitle}>
              {location.city}, {location.country}
            </Text>

            {location.address && (
              <Text style={styles.cardDetail}>
                Dirección: {location.address}
              </Text>
            )}
            
         <TouchableOpacity
  style={styles.locationButton}
  onPress={() =>
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`
    ).catch(() =>
      Alert.alert('Error', 'No fue posible abrir Google Maps.')
    )
  }
>
  <Text style={styles.locationButtonText}>
    Ver ubicación en Google Maps
  </Text>
</TouchableOpacity>   
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>
          No hay ubicaciones disponibles.
        </Text>
      )}
    </View>

    {/* Otras experiencias */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Más experiencias de este operador
      </Text>

      {relatedTours.length > 0 ? (
        relatedTours.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.infoCard}
            onPress={() =>
              navigation.push('ExperienceDetail', {
                tourId: item.id,
              })
            }
          >
            <Text style={styles.cardTitle}>{item.name}</Text>

            <Text style={styles.cardSubtitle}>
              {item.city}, {item.country}
            </Text>

            <Text style={styles.cardDetail}>
              {item.durationMinutes} minutos · {item.currency} {item.price}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.emptyText}>
          No hay otras experiencias disponibles.
        </Text>
      )}
    </View>

    {/* Botón de contacto */}
    <TouchableOpacity
  style={styles.contactButton}
  onPress={() => {
    if (operator?.contactEmail) {
      const subject = encodeURIComponent(
        `Consulta de disponibilidad: ${tour.name}`
      );

      Linking.openURL(
        `mailto:${operator.contactEmail}?subject=${subject}`
      ).catch(() => {
        Alert.alert('Error', 'No fue posible abrir el correo electrónico.');
      });
    } else if (operator?.contactPhone) {
      Linking.openURL(`tel:${operator.contactPhone}`).catch(() => {
        Alert.alert('Error', 'No fue posible iniciar la llamada.');
      });
    } else {
      Alert.alert(
        'Contacto no disponible',
        'Este operador todavía no tiene información de contacto registrada.'
      );
    }
  }}
>
  <Text style={styles.contactText}>
    Consultar disponibilidad
  </Text>
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
section: {
  marginBottom: 24,
},

infoCard: {
  backgroundColor: '#FFFFFF',
  padding: 16,
  borderRadius: 14,
  marginTop: 10,
  borderWidth: 1,
  borderColor: '#EAEAEA',
},

cardTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: '#172B4D',
},

cardSubtitle: {
  fontSize: 13,
  color: '#777777',
  marginTop: 4,
},

cardDetail: {
  fontSize: 13,
  color: '#444444',
  marginTop: 8,
},

emptyText: {
  fontSize: 13,
  color: '#888888',
  marginTop: 8,
},
locationButton: {
  marginTop: 12,
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 10,
  backgroundColor: '#EEF3F8',
  alignSelf: 'flex-start',
},

locationButtonText: {
  color: '#172B4D',
  fontSize: 13,
  fontWeight: '600',
},
});
