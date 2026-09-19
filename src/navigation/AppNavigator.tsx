import react from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExampleScreen } from '../screens/ExampleScreen';
import { AppStackParamList } from '../types/navigation';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: true }}>
                <Stack.Screen
                name="Example"
                component={ExampleScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}