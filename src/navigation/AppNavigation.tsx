import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home';
import Files from '../screens/Files';
import Page from '../screens/Page';
import EditPage from '../screens/EditPage';

const Stack = createNativeStackNavigator();

const AppNavigation = ({ mainColor }: { mainColor: string }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Home'
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: mainColor
          }
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Files" component={Files} />
        <Stack.Screen name="Page" component={Page} />
        <Stack.Screen name="Edit" component={EditPage} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation;