import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const FeatureUnavailable = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className=" w-screen mt-6 items-center px-4 bg-white min-h-screen">
          <Image
            source={require("../assets/gifs/feature-unavailable.gif")}
            className="w-full h-1/2"
            resizeMode="contain"
          />
          <Text className="text-base text-center font-kregular mt-6 text-brand-midnight">
            This feature is currently under development. We apologize for any
            inconvenience {"\n"} {"\n"} Please check back later. {"\n"}
          </Text>
          <Text className="text-xl sm:text-2xl text-center font-kmedium mt-6 text-brand-midnight">
            Thank you for your patience.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-brand-midnight my-8 w-3/4 rounded-lg"
          >
            <Text className="text-brand-primary font-kmedium text-sm sm:text-base px-4 py-2 text-center">
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeatureUnavailable;
