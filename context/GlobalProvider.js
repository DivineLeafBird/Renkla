import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import { router } from "expo-router";

// Create the Global Context
const GlobalContext = createContext();
// Create a custom hook to use the Global Context
// This hook will be used in all components that need access to the global state
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [viewedOnboarding, setViewedOnboarding] = useState(false);

  // Helper function to load a setting from AsyncStorage
  const loadSetting = async (key, setter) => {
    try {
      const storedValue = await AsyncStorage.getItem(key);
      if (storedValue !== null) {
        setter(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
    }
  };

  // Helper function to toggle and save a setting in AsyncStorage
  const toggleSetting = async (key, currentValue, setter) => {
    try {
      const newValue = !currentValue;
      setter(newValue);
      await AsyncStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  };

  // Load onboarding and biometric settings on app startup
  useEffect(() => {
    loadSetting("viewedOnboarding", setViewedOnboarding);
    loadSetting("biometricEnabled", setBiometricEnabled);
  }, []);

  // Check user authentication status on app startup
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        // Load user from AsyncStorage
        const storedUser = await AsyncStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
          router.replace("/home");
        } else {
          const viewedOnboarding = await AsyncStorage.getItem(
            "viewedOnboarding"
          );
          if (viewedOnboarding !== "true") {
            await auth.signOut();
            setIsLoggedIn(false);
            router.replace("/");
          } else {
            await auth.signOut();
            setIsLoggedIn(false);
            router.replace("/sign-in");
          }
        }

        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
          if (authUser) {
            setUser(authUser);
            setIsLoggedIn(true);
            await AsyncStorage.setItem("user", JSON.stringify(authUser));
          } else {
            setIsLoggedIn(false);
            setUser(null);
            await AsyncStorage.removeItem("user");
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error("Failed to load user from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAuth();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        biometricEnabled,
        toggleBiometric: () =>
          toggleSetting(
            "biometricEnabled",
            biometricEnabled,
            setBiometricEnabled
          ),
        viewedOnboarding,
        toggleOnboarding: () =>
          toggleSetting(
            "viewedOnboarding",
            viewedOnboarding,
            setViewedOnboarding
          ),
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
