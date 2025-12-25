import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  ToastAndroid,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { useGlobalContext } from "../../context/GlobalProvider";

const BiometricSetup = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const { biometricEnabled, toggleBiometric } = useGlobalContext();

  useEffect(() => {
    // Check if hardware supports biometrics
    const checkBiometricSupport = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    };

    checkBiometricSupport();
  }, []);

  const handleBiometricAuth = async () => {
    try {
      if (!biometricEnabled) {
        // Check if biometrics are enrolled (face/fingerprint)
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!enrolled) {
          Alert.alert(
            "Biometric Authentication",
            "No biometrics found. Please enroll biometrics on your device."
          );
          return;
        }

        // Authenticate the user
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Verify that it's you",
          fallbackLabel: "Use Passcode",
        });

        if (result.success) {
          setAuthenticated(true);
          toggleBiometric();
          ToastAndroid.show("Biometrics Enabled!", ToastAndroid.SHORT);
          router.push("/biometric-setup-success");
        } else {
          Alert.alert("Authentication Failed", "Please try again.");
        }
      } else {
        toggleBiometric();
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      Alert.alert(
        "Authentication Error",
        "An error occurred during authentication. Please try again."
      );
    }
  };

  return (
    <SafeAreaView className="bg-brand-secondary h-full">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-4"
      >
        <View className="flex-1  items-center justify-center   min-h-screen px-4 bg-brand-secondary">
          <Image
            source={images.biometric}
            className="w-full h-1/4 my-4"
            resizeMode="contain"
          />
          <Text className="text-brand-midnight text-center my-4 text-2xl font-kmedium">
            Setup Biometric Verification
          </Text>
          <Text className="text-brand-midnight text-center px-5 text-base font-kregular">
            Biometric verification is an easier, more secure way to access your
            Renkla account. {`\n`} You can turn off this feature any time from
            settings.
          </Text>
          <Ionicons
            name="finger-print-outline"
            size={58}
            margin={32}
            color="#F14A58"
          />
          <CustomButton
            title="Yes, Enable"
            handlePress={handleBiometricAuth}
            containerStyles="w-full sm:w-3/4 my-2"
            textStyles="text-sm font-kmedium sm:text-base "
          />
          <CustomButton
            title="Not now"
            handlePress={() => router.push("/sign-up-success")}
            containerStyles="w-full sm:w-3/4 my-2 bg-brand-primary border-2 border-brand-midnight"
            textStyles="text-sm font-kmedium sm:text-base text-brand-midnight"
          />

          {/* <Switch
            value={biometricEnabled}
            onValueChange={handleBiometricAuth}
          />
          {biometricEnabled && (
            <Text style={{ marginTop: 20 }}>
              Biometric Authentication is enabled!
            </Text>
          )} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BiometricSetup;
