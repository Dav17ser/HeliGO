import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';

export function ExampleScreen() {
  const handleButtonPress = () => {
    Alert.alert(
      'Aun no has seleccionado el vuelo',
      'Por favor, selecciona un vuelo antes de continuar, pdta profe tengo sueño.',
      [
        {
          text: 'Cerrar',
          onPress: () => console.log('Alerta cerrada'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HeliGo</Text>
      <Text style={styles.message}>Latam Academy Aviation</Text>
      <Pressable style={styles.button} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>Presiona</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  message: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});