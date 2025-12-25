import { View, Text, ScrollView, Image, Alert, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images, icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import IconButton from "../../components/IconButton";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
// import env from "../../env-config";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

import { auth, db } from "../../lib/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
} from "firebase/auth";
import { useGlobalContext } from "../../context/GlobalProvider";

const OnboardingAuth = () => {
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingGoogle, setisLoadingGoogle] = useState(false);
  const [isLoadingApple, setisLoadingApple] = useState(false);

  const { viewedOnboarding, toggleOnboarding } = useGlobalContext();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Constants.expoConfig.extra.IOS_CLIENT_ID,
    androidClientId: Constants.expoConfig.extra.ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    let isMounted = true;
    if (response?.type === "success") {
      setisLoadingGoogle(true);

      const handleSignIn = async () => {
        try {
          const { id_token } = response.params;
          const credential = GoogleAuthProvider.credential(id_token);
          const userCredential = await signInWithCredential(auth, credential);

          if (!isMounted) return;

          const user = userCredential.user;
          console.log(user);

          if (user.metadata.creationTime === user.metadata.lastSignInTime) {
            // Update the user's profile with the Google data
            await updateProfile(auth.currentUser, {
              displayName: user.displayName,
              photoURL: user.photoURL,
            });

            // Store the user's data in Firestore
            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              isAdmin: false,

              createdAt: Timestamp.now(),
            });

            console.log("User created and data stored in Firestore");

            // Store the user object or token in AsyncStorage
            await AsyncStorage.setItem("user", JSON.stringify(user));
            console.log("Signed up with Google as:", user.displayName);

            router.replace("/onboarding-phone-add");
          } else {
            // Store the user object or token in AsyncStorage
            await AsyncStorage.setItem("user", JSON.stringify(user));
            console.log("User signed in with Google:", user.displayName);
            toggleOnboarding();
            router.replace("/home");
          }
        } catch (error) {
          console.error("Failed to sign up or update profile:", error);
        } finally {
          if (isMounted) setisLoadingGoogle(false);
        }
      };

      handleSignIn();
    } else if (response?.type === "error") {
      console.log("Google Auth Error: ", response.error);
      router.back();
      Alert.alert(
        "Error",
        "An error occurred while signing up with Google. Please try again."
      );
    }

    return () => {
      isMounted = false;
    };
  }, [response]);

  const promptGoogleSignUp = async () => {
    promptAsync();
  };

  return (
    <SafeAreaView className="bg-brand-secondary h-full">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="justify-center items-center px-4 mt-6 min-h-screen">
          <Image
            source={images.waistBag}
            resizeMode="contain"
            className="w-40 h-40 sm:h-80 sm:w-80"
          />
          <View
            className="grow rounded-t-3xl shadow-2xl p-2 w-screen"
            style={{ backgroundColor: "rgba(203, 212, 225, 0.2)" }}
          >
            <Link
              href={"/home"}
              className=" text-sm sm:text-base font-ksemibold text-informative-200 text-right px-2 sm:px-8"
            >
              Skip
            </Link>
            <View className="px-2 items-center">
              <Text className="text-2xl font-kmedium sm:text-3xl text-brand-midnight mb-8">
                Get Started
              </Text>
              <IconButton
                title="Continue with Google"
                containerStyles="w-full sm:w-3/4  mb-8"
                isLoading={isLoadingGoogle}
                disabled={isLoadingGoogle}
                handlePress={promptGoogleSignUp}
                icon={icons.google}
                iconColor=""
                textStyles="text-sm font-kmedium sm:text-base  "
              />
              {Platform.OS === "ios" && (
                <IconButton
                  title="Continue with Apple"
                  handlePress={() => router.push("/feature-unavailable")}
                  containerStyles="w-full sm:w-3/4 mb-8"
                  isLoading={isLoadingApple}
                  disabled={isLoadingApple}
                  icon={icons.apple}
                  iconColor=""
                  textStyles="text-sm font-kmedium sm:text-base  "
                />
              )}
              <View className="flex-row justify-center items-center mb-8">
                <View className="flex-1 h-[1px] sm:ml-24 bg-brand-silverChalice" />
                <Text className="text-base font-kregular text-brand-urbanGray px-2">
                  or
                </Text>
                <View className="flex-1 h-[1px] sm:mr-24 bg-brand-silverChalice" />
              </View>
              <CustomButton
                title="Continue with Email"
                handlePress={() => router.push("/sign-up")}
                containerStyles="w-full sm:w-3/4 mb-8"
                isLoading={isLoading}
                textStyles="text-sm font-kmedium sm:text-base "
              />
              <Text className="sm:w-3/4 mb-8 px-2 text-sm sm:text-base font-kregular text-brand-midnight text-center">
                Already have an account?
              </Text>
              <CustomButton
                title="Sign in"
                handlePress={() => router.push("/sign-in")}
                containerStyles="w-full sm:w-3/4 mb-8"
                isLoading={isLoading}
                textStyles="text-sm font-kmedium sm:text-base "
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OnboardingAuth;
