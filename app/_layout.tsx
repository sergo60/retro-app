import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RetroScreen from './screens/RetroScreen';
import FullRetroScreen from './screens/FullRetroScreen';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import AccountScreen from './AccountScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Retro" component={RetroScreen} />
      <Stack.Screen name="FullRetro" component={FullRetroScreen} />
    </Stack.Navigator>
  );
}
