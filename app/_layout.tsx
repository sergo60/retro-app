import { Provider } from 'react-redux';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { logout } from './features/auth/authSlice';
import { TouchableOpacity, Text } from 'react-native';
import { auth } from '../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

import HomeScreen from './HomeScreen';
import LoginScreen from './features/auth/screens/LoginScreen';
import AccountScreen from './features/auth/screens/AccountScreen';
import RetroScreen from './screens/RetroScreen';
import FullRetroScreen from './screens/FullRetroScreen';

const Stack = createNativeStackNavigator();

import { store } from './store';

export default function App() {
  return (
    <Provider store={store}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Retro" component={RetroScreen} />
        <Stack.Screen name="FullRetro" component={FullRetroScreen} />
      </Stack.Navigator>
    </Provider>
  );
}
