import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
  Alert,
  PanResponder,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Descubre experiencias únicas',
    description:
      'Encuentra tours en helicóptero y experiencias aéreas en diferentes destinos.',
    image: require('../../assets/onboarding/onboarding-1.jpeg'),
  },
  {
    title: 'Encuentra opciones cerca de ti',
    description:
      'Usa tu ubicación para descubrir operadores y experiencias disponibles.',
    image: require('../../assets/onboarding/onboarding-2.jpeg'),
  },
  {
    title: 'Contacta y vive la experiencia',
    description:
      'Consulta precios, duración y detalles para contactar directamente al operador.',
    image: require('../../assets/onboarding/onboarding-3.jpeg'),
  },
];

export function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);

  const currentData = onboardingData[currentPage];

  // Precargar las imágenes del onboarding
  useEffect(() => {
    onboardingData.forEach((item) => {
      Image.prefetch(Image.resolveAssetSource(item.image).uri);
    });
  }, []);

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      Alert.alert(
        'Bienvenido a HeliGO',
        'Aquí comenzará el acceso a la aplicación.'
      );
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSkip = () => {
    setCurrentPage(onboardingData.length - 1);
  };

  // Gestos táctiles para avanzar y retroceder
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          handleNext();
        } else if (gestureState.dx > 50) {
          handleBack();
        }
      },
    })
  ).current;

  return (
    <View
      style={styles.container}
      {...panResponder.panHandlers}
    >
      <StatusBar style="light" />

      <Image source={currentData.image} style={styles.image} />

      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.logo}>HeliGO</Text>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{currentData.title}</Text>

          <Text style={styles.description}>
            {currentData.description}
          </Text>
        </View>

        <View style={styles.bottomContainer}>
          {currentPage > 0 && (
            <Pressable onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backText}>← Atrás</Text>
            </Pressable>
          )}

          <View style={styles.indicators}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentPage && styles.activeIndicator,
                ]}
              />
            ))}
          </View>

          <Pressable style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentPage === onboardingData.length - 1
                ? 'Comenzar'
                : 'Siguiente'}
            </Text>
          </Pressable>

          {currentPage < onboardingData.length - 1 && (
            <Pressable onPress={handleSkip}>
              <Text style={styles.skipText}>Omitir</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071A2D',
  },

  image: {
    width,
    height: '100%',
    position: 'absolute',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },

  logo: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 1,
  },

  textContainer: {
    marginBottom: 40,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 40,
    marginBottom: 16,
  },

  description: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 26,
    opacity: 0.9,
  },

  bottomContainer: {
    alignItems: 'center',
  },

  backButton: {
    marginBottom: 16,
  },

  backText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  indicators: {
    flexDirection: 'row',
    marginBottom: 24,
  },

  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },

  activeIndicator: {
    width: 24,
    backgroundColor: '#FFFFFF',
  },

  button: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },

  buttonText: {
    color: '#071A2D',
    fontSize: 16,
    fontWeight: '700',
  },

  skipText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});