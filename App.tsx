import { StyleSheet, Text, View, PermissionsAndroid, Platform, ToastAndroid } from 'react-native'
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import CustomerListScreen from './src/screens/CustomerListScreen';
import MilkEntrySceen from './src/screens/MilkEntrySceen';
import CustomerFormScreen from './src/screens/CustomerForm';
import { createTables } from './src/db/database';
import MilkMasterScreen from './src/screens/MilkListScreen';
import MultiSelectList from './src/components/SelectDelete';
import LoginScreen from './src/screens/LoginScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    (async () => {
      try {
        await createTables();
        ToastAndroid.show("DB Initialized.", ToastAndroid.SHORT);
      } catch (e) {

        ToastAndroid.show("DB got error.", ToastAndroid.SHORT);
      }
    })();
  }, []);
  return (
    <NavigationContainer>
      <SafeAreaProvider>


        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
          }}
        // initialRouteName="CustomerForm"
        >
          <Stack.Group>
            <Stack.Screen name='LoginScreen' component={LoginScreen} />
          </Stack.Group>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Customers" component={CustomerListScreen} />
          <Stack.Screen name="CustomerForm" component={CustomerFormScreen} />
          <Stack.Screen name="MilkEntry" component={MilkEntrySceen} />
          <Stack.Screen name="MilkListScreen" component={MilkMasterScreen} />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
    // <MultiSelectList />
  )
}

export default App

const styles = StyleSheet.create({})