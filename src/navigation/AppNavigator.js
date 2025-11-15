import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import WelcomeScreen from "../screens/WelcomeScreen";
import StartScreen from "../screens/StartScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignupScreen";
import FeaturesScreen from "../screens/FeaturesScreen";
import RoomDecoratorScreen from "../screens/RoomDecorator";
import VIPRoomDecoratorScreen from "../screens/VIPRoomDecoratorScreen";
import VIPPurchaseScreen from "../screens/VIPPurchaseScreen";
import AdminScreen from "../screens/AdminScreen";
import AdminLoginScreen from "../screens/AdminLoginScreen";
import FinalImageScreen from "../screens/FinalImageScreen";
import ProfileScreen from "../screens/ProfileScreen";


const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignUpScreen} />
      <Stack.Screen name="Features" component={FeaturesScreen} />
      <Stack.Screen name="RoomDecorator" component={RoomDecoratorScreen} />
      <Stack.Screen name="VIPRoomDecorator" component={VIPRoomDecoratorScreen} />
      <Stack.Screen name="VIPPurchase" component={VIPPurchaseScreen} />
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="Admin" component={AdminScreen} />
      <Stack.Screen name="FinalImageScreen" component={FinalImageScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />

    </Stack.Navigator>
  );
}
