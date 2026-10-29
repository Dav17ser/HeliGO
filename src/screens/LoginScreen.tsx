import React, { useState } from 'react';
import { loginUser } from '../services/auth';
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

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  if (loading) return;

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    setError('Ingresa tu correo y contraseña.');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const result = await loginUser({
      email: normalizedEmail,
      password,
    });

    if (!result.accessToken) {
      setError('No se recibió una sesión válida.');
      return;
    }

    navigation.navigate('Home', {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : 'No fue posible iniciar sesión. Intenta nuevamente.'
    );
  } finally {
    setLoading(false);
  }
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
        >
          <View style={styles.formPanel}>
            <View style={styles.header}>
              <Text style={styles.logo}>HeliGO</Text>

              <Text style={styles.title}>
                Bienvenido de nuevo
              </Text>

              <Text style={styles.subtitle}>
                Inicia sesión para descubrir experiencias únicas desde el aire.
              </Text>
            </View>

            <View style={styles.form}>
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
                    placeholder="Ingresa tu contraseña"
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

              <Pressable style={styles.forgotButton}>
                <Text style={styles.forgotText}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </Pressable>              
<Pressable
  style={[
    styles.loginButton,
    loading && { opacity: 0.7 },
  ]}
  onPress={handleLogin}
  disabled={loading}>
  <Text style={styles.loginButtonText}>
    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
  </Text>
</Pressable>

{error !== '' && (
  <Text style={styles.errorText}>
    {error}
  </Text>
)}

              {error !== '' && (
                <Text style={styles.errorText}>
                  {error}
                </Text>
              )}
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                ¿No tienes una cuenta?
              </Text>

              <Pressable
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.registerLink}>
                  {' '}Crear cuenta
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
    paddingTop: 70,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },

  formPanel: {
    backgroundColor: 'rgba(7, 26, 45, 0.78)',
    borderRadius: 24,
    padding: 24,
    width: '100%',
  },

  header: {
    marginBottom: 40,
  },

  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 50,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },

  form: {
    width: '100%',
  },

  inputContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: '#D9E0EA',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#071A2D',
  },

  passwordContainer: {
    height: 54,
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

  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 28,
  },

  forgotText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  loginButton: {
    height: 54,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginButtonText: {
    color: '#071A2D',
    fontSize: 16,
    fontWeight: '700',
  },

  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 14,
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },

  registerText: {
    fontSize: 14,
    color: '#FFFFFF',
  },

  registerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});