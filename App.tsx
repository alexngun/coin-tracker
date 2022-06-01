import { Box } from 'native-base';
import MainScreen from './screens/MainScreen'
import DetailScreen from './screens/DetailScreen';
import WatchListScreen from './screens/WatchListScreen';
import PortfolioScreen from './screens/PortfolioScreen';
import Navbar from './components/Navbar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react'
import AppContainer from './components/AppContainer';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
  <AppContainer>
    <Box safeAreaTop={true} _dark={{bg: "dark.100"}} _light={{bg: "coolGray.300"}} height="92%">
      <Stack.Navigator>
        <Stack.Screen name="Home" component={MainScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Detail" component={DetailScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Watchlist" component={WatchListScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Portfolio" component={PortfolioScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </Box>
    <Navbar/>
  </AppContainer>

  );
}