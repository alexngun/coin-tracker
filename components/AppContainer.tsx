import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import { NativeBaseProvider } from 'native-base'
import * as React from 'react'

type Props = { children: React.ReactChildren }

function AppContainer({children}: Props) {
  return (
    <NativeBaseProvider>
    <Provider store={store}>
      <NavigationContainer>
        {children}
      </NavigationContainer>
      </Provider>
    </NativeBaseProvider>
  )
}

export default AppContainer