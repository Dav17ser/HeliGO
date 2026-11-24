import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { formatTourDuration, formatTourPrice, Tour } from '../services/api';
import { formatDistanceKm } from '../hooks/useUserLocation';

type ExperienceCardProps = {
  tour: Tour;
  onPress?: (tour: Tour) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (tour: Tour) => void;
  distanceKm?: number;
};

export function ExperienceCard({
  tour,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  distanceKm,
}: ExperienceCardProps) {
  const formattedPrice = formatTourPrice(tour);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.85}
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

          {tour.operatorLogoUrl && (
            <View style={styles.operatorLogoContainer}>
              <Image
                source={{ uri: tour.operatorLogoUrl }}
                style={styles.operatorLogo}
                resizeMode="contain"
              />
            </View>
          )}

          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>{formattedPrice}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {tour.name}
          </Text>
          <Text style={styles.location} numberOfLines={1}>
            📍 {tour.city}
            {distanceKm !== undefined &&
              ` · a ${formatDistanceKm(distanceKm)}`}
          </Text>
          <Text style={styles.duration}>
            ⏱ {formatTourDuration(tour)}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => onToggleFavorite?.(tour)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={
          isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'
        }
      >
        <Text style={[
          styles.favoriteIcon,
          isFavorite && styles.favoriteActive,
        ]}>
          {isFavorite ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
    </View>
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  favoriteIcon: {
    fontSize: 21,
    color: '#7898B4',
  },
  favoriteActive: {
    color: '#E53955',
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
  operatorLogoContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  operatorLogo: {
    width: '100%',
    height: '100%',
  },
});
