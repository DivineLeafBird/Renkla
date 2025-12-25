import { View, Text, Switch } from "react-native";
import React, { useContext } from "react";
import { Button } from "react-native"; // Inside your component
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../lib/firebaseConfig";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Favorites = () => {
  const { user, setUser, setIsLoggedIn, viewedOnboarding } = useGlobalContext();
  const LogOut = async () => {
    try {
      // Sign out the user using Firebase auth
      await auth.signOut();

      // Clear the user from AsyncStorage
      await AsyncStorage.removeItem("user");

      // Clear user-related state in the context
      setUser(null);
      setIsLoggedIn(false);

      console.log("Sign Out Success!");

      // Optionally navigate the user to the sign-in screen
      router.replace("/sign-in"); // Use this if you're using Expo Router
      // or
      // navigation.replace("SignInScreen"); // Use this if you're using React Navigation
    } catch (err) {
      console.log("Error during sign-out and storage clearing:", err);
      // Optionally, show an alert or handle the error as needed
      Alert.alert("Error", "Something went wrong while signing out.");
    }
  };
  const clearStorage = async () => {
    try {
      // Sign out the user using Firebase auth
      await auth.signOut();
      // Clear the user from AsyncStorage
      await AsyncStorage.removeItem("user");
      // Clear user-related state in the context
      setUser(null);
      setIsLoggedIn(false);
      // Clear all data from AsyncStorage
      await AsyncStorage.clear();
      console.log("Storage Cleared!");

      // Optionally navigate the user to the sign-in screen
      router.replace("/"); // Use this if you're using Expo Router
      // or
      // navigation.replace("SignInScreen"); // Use this if you're using React Navigation
    } catch (err) {
      console.log("Error during storage clearing:", err);
      // Optionally, show an alert or handle the error as needed
      Alert.alert("Error", "Something went wrong while clearing storage.");
    }
  };
  const toggleOnboarding = () => {
    toggleOnboarding();
    console.log("viewedOnboarding:", viewedOnboarding);
  };
  return (
    <SafeAreaView className="w-screen">
      <View className="items-center mt-6 space-y-4">
        <Button title="logOut" onPress={LogOut} />
        <Text>Welcome, {user?.displayName}</Text>
        <Button title="clear Storage" onPress={clearStorage} />
        <Button
          title="Setup Biometric Verification"
          onPress={() => router.push("/biometric-setup")}
        />
        <Button title="Verify OTP" onPress={() => router.push("/otp-verify")} />

        <Button
          title="Custom"
          onPress={() => router.push("/feature-unavailable")}
        />

        <Button
          title="Phone Add"
          onPress={() => router.push("/onboarding-phone-add")}
        />

        <Switch value={viewedOnboarding} onValueChange={toggleOnboarding} />
        {viewedOnboarding && <Text style={{ marginTop: 20 }}>Toggled !</Text>}
      </View>
    </SafeAreaView>
  );
};

export default Favorites;
