
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ExampleScreen } from '../screens/ExampleScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ExperienceDetailScreen } from '../screens/ExperienceDetailScreen';
import { DestinationDetailScreen } from '../screens/DestinationDetailScreen';
import { TourListScreen } from '../screens/TourListScreen';
import { OperatorsMapScreen } from '../screens/OperatorsMapScreen';

import { AppStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  const { session, initializing } = useAuth();

  // Evita mostrar Login brevemente mientras se restaura la sesión almacenada.
  if (initializing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#173B68" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />

            <Stack.Screen
              name="DestinationDetail"
              component={DestinationDetailScreen}
            />

            <Stack.Screen
              name="ExperienceDetail"
              component={ExperienceDetailScreen}
            />

            <Stack.Screen name="TourList" component={TourListScreen} />

            <Stack.Screen
              name="OperatorsMap"
              component={OperatorsMapScreen}
            />

            <Stack.Screen name="Example" component={ExampleScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
