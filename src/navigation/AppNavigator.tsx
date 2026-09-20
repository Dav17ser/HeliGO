import react from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ExampleScreen } from '../screens/ExampleScreen';
import { AppStackParamList } from '../types/navigation';
import { LoginScreen } from '../screens/LoginScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
        />

        <Stack.Screen
        name="Login"
        component={LoginScreen}
        />

        <Stack.Screen
          name="Example"
          component={ExampleScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}