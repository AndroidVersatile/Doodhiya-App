import { StyleSheet, Text, View, PermissionsAndroid, Platform, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import CustomerListScreen from './src/screens/CustomerListScreen';
import MilkEntrySceen from './src/screens/MilkEntrySceen';
import CustomerFormScreen from './src/screens/CustomerForm';
import MilkMasterScreen from './src/screens/MilkListScreen';
import LoginScreen from './src/screens/LoginScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ProfileScreen from './src/screens/ProfleScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';
import TermsAndConditionsScreen from './src/screens/TermsAndConditionsScreen';
import ContactUsScreen from './src/screens/ContactUsScreen';
import { useDispatch, useSelector } from 'react-redux';
import RNBootSplash from "react-native-bootsplash";
// import NetInfo from "@react-native-community/netinfo";
// import NoInternetScreen from './src/screens/NoInternetScreen';
import { SystemBars } from 'react-native-edge-to-edge';
import { listenToAuthChanges } from './src/firebase/authlistner';

import SignUpScreen from './src/screens/SignUpScreen';
import ForgetPasswordScreen from './src/screens/ForgetPasswordScreen';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();
const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(dispatch);
    return unsubscribe;
  }, []);
  // useEffect(() => {
  //   // const unsubscribe = NetInfo.addEventListener(state => {
  //   //   setIsConnected(state.isConnected);
  //   // });
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     // Use state.isInternetReachable for better accuracy on some devices
  //     const status = !!(state.isConnected && state.isInternetReachable !== false);
  //     setIsConnected(status);
  //   });
  //   return () => unsubscribe();
  // }, []);
  const onNavigationReady = () => {
    RNBootSplash.hide({ fade: true });
  };
  return (
    <SafeAreaProvider>
      <SystemBars style='dark' />
      <NavigationContainer ref={navigationRef}
        onReady={onNavigationReady}
      >

        <Stack.Navigator screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          orientation: 'portrait'
        }}
        >
          {!user ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
              <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Customers" component={CustomerListScreen} />
              <Stack.Screen name="CustomerForm" component={CustomerFormScreen} />
              <Stack.Screen name="MilkEntry" component={MilkEntrySceen} />
              <Stack.Screen name="MilkListScreen" component={MilkMasterScreen} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
              <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
              <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
              <Stack.Screen name="TermsAndConditionsScreen" component={TermsAndConditionsScreen} />
              <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} />
              <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />

            </>
          )}

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>

  )

}

export default App

