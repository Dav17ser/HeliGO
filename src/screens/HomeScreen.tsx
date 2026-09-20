import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a HeliGO 🚁</Text>

      <Text style={styles.subtitle}>
        Esta será la pantalla principal de la aplicación.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F5F7FA',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#071A2D',
    textAlign: 'center',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: '#667085',
    textAlign: 'center',
  },
});