import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setError('');

    // Por ahora el registro es solamente visual.
    // Más adelante conectaremos el backend.
    navigation.navigate('Login');
  };

  return (
    <ImageBackground
      source={require('../../assets/login/login-background.jpeg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar style="light" />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formPanel}>

            <View style={styles.header}>
              <Text style={styles.logo}>HeliGO</Text>

              <Text style={styles.title}>
                Crear cuenta
              </Text>

              <Text style={styles.subtitle}>
                Regístrate y comienza a descubrir experiencias únicas desde el aire.
              </Text>
            </View>

            <View style={styles.form}>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Nombre completo
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu nombre"
                  placeholderTextColor="#8A94A6"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Correo electrónico
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu correo"
                  placeholderTextColor="#8A94A6"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Contraseña
                </Text>

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Crea una contraseña"
                    placeholderTextColor="#8A94A6"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.showButton}
                  >
                    <Text style={styles.showText}>
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Confirmar contraseña
                </Text>

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Repite tu contraseña"
                    placeholderTextColor="#8A94A6"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <Pressable
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    style={styles.showButton}
                  >
                    <Text style={styles.showText}>
                      {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {error !== '' && (
                <Text style={styles.errorText}>
                  {error}
                </Text>
              )}

              <Pressable
                style={styles.registerButton}
                onPress={handleRegister}
              >
                <Text style={styles.registerButtonText}>
                  Crear cuenta
                </Text>
              </Pressable>

            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                ¿Ya tienes una cuenta?
              </Text>

              <Pressable
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginLink}>
                  {' '}Iniciar sesión
                </Text>
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  keyboardContainer: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
    justifyContent: 'center',
  },

  formPanel: {
    backgroundColor: 'rgba(7, 26, 45, 0.82)',
    borderRadius: 24,
    padding: 24,
    width: '100%',
  },

  header: {
    marginBottom: 30,
  },

  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#FFFFFF',
  },

  form: {
    width: '100%',
  },

  inputContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D9E0EA',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#071A2D',
  },

  passwordContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9E0EA',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#071A2D',
  },

  showButton: {
    paddingHorizontal: 14,
  },

  showText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1769AA',
  },

  registerButton: {
    height: 54,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  registerButtonText: {
    color: '#071A2D',
    fontSize: 16,
    fontWeight: '700',
  },

  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },

  loginText: {
    fontSize: 14,
    color: '#FFFFFF',
  },

  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});