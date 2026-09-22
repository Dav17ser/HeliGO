import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';

export function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ENCABEZADO */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hola, Carlos 👋
            </Text>

            <Text style={styles.subtitle}>
              ¿Listo para ver el mundo desde arriba?
            </Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>CR</Text>
          </View>
        </View>

        {/* BUSCADOR */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="¿Dónde quieres volar?"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* UBICACIÓN */}
        <TouchableOpacity style={styles.locationButton}>
          <Text style={styles.locationIcon}>●</Text>

          <Text style={styles.locationText}>
            Usar mi ubicación
          </Text>
        </TouchableOpacity>

        {/* EXPERIENCIAS CERCA DE TI */}
        <View style={styles.experiencesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Experiencias cerca de ti
            </Text>

            <TouchableOpacity>
              <Text style={styles.seeAll}>
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
          >
            {/* TARJETA MEDELLÍN */}
            <View style={styles.experienceCard}>
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../assets/home/medellin.jpeg')}
                  style={styles.cardImage}
                />

                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>
                    $350.000
                  </Text>
                </View>

                <View style={styles.favoriteButton}>
                  <Text style={styles.favoriteIcon}>
                    ♡
                  </Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <Text
                  style={styles.cardTitle}
                  numberOfLines={1}
                >
                  Heli Tours Medellín
                </Text>

                <Text style={styles.cardLocation}>
                  📍 Medellín
                </Text>

                <Text style={styles.cardRating}>
                  ★★★★★  4.8  ·  20 min
                </Text>

                <Text style={styles.cardDistance}>
                  2.4 km
                </Text>
              </View>
            </View>

            {/* TARJETA CARTAGENA */}
            <View style={styles.experienceCard}>
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../assets/home/cartagena.jpeg')}
                  style={styles.cardImage}
                />

                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>
                    $480.000
                  </Text>
                </View>

                <View style={styles.favoriteButton}>
                  <Text style={styles.favoriteIcon}>
                    ♡
                  </Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <Text
                  style={styles.cardTitle}
                  numberOfLines={1}
                >
                  Sky View Cartagena
                </Text>

                <Text style={styles.cardLocation}>
                  📍 Cartagena
                </Text>

                <Text style={styles.cardRating}>
                  ★★★★★  4.9  ·  25 min
                </Text>

                <Text style={styles.cardDistance}>
                  5.1 km
                </Text>
              </View>
            </View>
          </ScrollView>
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

          <View style={styles.destinationRow}>
            <View style={styles.destinationItem}>
              <Image
                source={require('../../assets/home/medellin.jpeg')}
                style={styles.destinationImage}
              />

              <Text style={styles.destinationText}>
                Medellín
              </Text>
            </View>

            <View style={styles.destinationItem}>
              <Image
                source={require('../../assets/home/cartagena.jpeg')}
                style={styles.destinationImage}
              />

              <Text style={styles.destinationText}>
                Cartagena
              </Text>
            </View>
          </View>
        </View>
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
    flexDirection: 'row',
    gap: 12,
  },

  destinationItem: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#F4F7FB',
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