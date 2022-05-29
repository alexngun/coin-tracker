import { Box, NativeBaseProvider } from 'native-base';
import MainScreen from './screens/MainScreen'
import DetailScreen from './screens/DetailScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator()

export default function App() {

  return (
    <NativeBaseProvider>
      <NavigationContainer>
      <Box safeAreaTop={true} _dark={{bg: "dark.100"}} _light={{bg: "warmGray.200"}} height="full">
        <Stack.Navigator>
          <Stack.Screen name="Home" component={MainScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Detail" component={DetailScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
      </Box>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}