import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Tour } from '../services/api';

type ExperienceCardProps = {
  tour: Tour;
  onPress?: (tour: Tour) => void;
};

export function ExperienceCard({
  tour,
  onPress,
}: ExperienceCardProps) {
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: tour.currency || 'COP',
    maximumFractionDigits: 0,
  }).format(Number(tour.price));

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => onPress?.(tour)}
    >
      <View style={styles.imageContainer}>
        {tour.imageUrl ? (
          <Image
            source={{ uri: tour.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>HELiGO</Text>
          </View>
        )}

        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{formattedPrice}</Text>
        </View>

        <View style={styles.favoriteButton}>
          <Text style={styles.favoriteIcon}>♡</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {tour.name}
        </Text>

        <Text style={styles.location} numberOfLines={1}>
          📍 {tour.city}
        </Text>

        <Text style={styles.duration}>
          ⏱ {tour.durationMinutes} min
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E7ECF2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  imageContainer: {
    height: 100,
    position: 'relative',
    backgroundColor: '#EAF0F6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#173B68',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 2,
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
  content: {
    padding: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 5,
  },
  location: {
    fontSize: 11,
    color: '#8A9AAF',
    marginBottom: 5,
  },
  duration: {
    fontSize: 10,
    color: '#D1A12A',
  },
});
