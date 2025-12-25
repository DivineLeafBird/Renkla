import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="onboarding-auth" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding-phone-add"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="otp-verify" options={{ headerShown: false }} />
        <Stack.Screen name="biometric-setup" options={{ headerShown: false }} />
        <Stack.Screen
          name="biometric-setup-success"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="sign-up-success" options={{ headerShown: false }} />
        <Stack.Screen name="oauthredirect" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
};

export default AuthLayout;
