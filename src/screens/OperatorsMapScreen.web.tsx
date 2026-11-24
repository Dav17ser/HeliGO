import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import {
  getLocationsByOperatorId,
  getOperators,
  Operator,
  ServiceLocation,
} from '../services/api';
import { getOperatorImage } from '../constants/operators';

type Props = NativeStackScreenProps<AppStackParamList, 'OperatorsMap'>;

type OperatorItem = {
  operator: Operator;
  locations: ServiceLocation[];
};

export function OperatorsMapScreen({ navigation }: Props) {
  const [items, setItems] = useState<OperatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadOperators() {
      try {
        const operators = await getOperators();

        const results = await Promise.allSettled(
          operators.map((operator) =>
            getLocationsByOperatorId(operator.id)
          )
        );

        const verified: OperatorItem[] = [];

        results.forEach((result, index) => {
          if (result.status !== 'fulfilled') return;

          const operator = operators[index];

          const locations = result.value.filter((location) => {
            const latitude = Number(location.latitude);
            const longitude = Number(location.longitude);

            return (
              String(location.operatorId) === String(operator.id) &&
              location.isActive &&
              Number.isFinite(latitude) &&
              Number.isFinite(longitude)
            );
          });

          if (locations.length > 0) {
            verified.push({ operator, locations });
          }
        });

        if (active) {
          setItems(verified);
          setError(null);
        }
      } catch (err) {
        console.error('Error cargando operadores:', err);

        if (active) {
          setError('No fue posible cargar los operadores.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOperators();

    return () => {
      active = false;
    };
  }, []);

  const contactOperator = async (operator: Operator) => {
    const url = operator.contactEmail
      ? `mailto:${operator.contactEmail}?subject=${encodeURIComponent(
          'Consulta desde HeliGO'
        )}`
      : operator.contactPhone
      ? `tel:${operator.contactPhone.replace(/\s+/g, '')}`
      : null;

    if (!url) {
      alert('Este operador aún no tiene datos de contacto registrados.');
      return;
    }

    try {
      await Linking.openURL(url);
    } catch {
      alert('No fue posible abrir el contacto.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹ Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Operadores</Text>

        <Text style={styles.subtitle}>
          Explora operadores y sus ubicaciones verificadas
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#173B68" />
          <Text style={styles.message}>Cargando operadores...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.message}>{error}</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.message}>
            Aún no hay operadores con ubicaciones verificadas.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {items.map(({ operator, locations }) => {
            const image = getOperatorImage(operator);

            return (
              <View key={operator.id} style={styles.card}>
                <View style={styles.operatorHeader}>
                  {image && (
                    <Image
                      source={image}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  )}

                  <View style={styles.operatorInfo}>
                    <Text style={styles.operatorName}>
                      {operator.name}
                    </Text>

                    {operator.description && (
                      <Text style={styles.description}>
                        {operator.description}
                      </Text>
                    )}
                  </View>
                </View>

                {locations.map((location) => (
                  <View
                    key={location.id}
                    style={styles.location}
                  >
                    <Text style={styles.locationName}>
                      📍 {location.name}
                    </Text>

                    {!!location.address && (
                      <Text style={styles.address}>
                        {location.address}
                      </Text>
                    )}

                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() =>
                        navigation.navigate('DestinationDetail', {
                          city: location.city,
                          country: location.country,
                        })
                      }
                    >
                      <Text style={styles.primaryText}>
                        Ver experiencias
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}

                {(operator.contactEmail ||
                  operator.contactPhone) && (
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => contactOperator(operator)}
                  >
                    <Text style={styles.secondaryText}>
                      Contactar operador
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#245B9B',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#102A43',
  },
  subtitle: {
    fontSize: 13,
    color: '#7B8CA8',
    marginTop: 6,
  },
  list: {
    padding: 16,
    gap: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  message: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7ECF2',
    gap: 14,
  },
  operatorHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#EAF0F6',
  },
  operatorInfo: {
    flex: 1,
    gap: 6,
  },
  operatorName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#102A43',
  },
  description: {
    fontSize: 13,
    color: '#718096',
    lineHeight: 19,
  },
  location: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    gap: 8,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#173B68',
  },
  address: {
    fontSize: 12,
    color: '#64748B',
  },
  primaryButton: {
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
