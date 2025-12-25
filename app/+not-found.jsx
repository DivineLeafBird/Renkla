import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { images } from "../constants";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const NotFound = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="bg-brand-secondary h-full">
      <View className="mt-6 justify-center items-center px-4">
        <Text className="text-center text-2xl font-kregular">Oop!...</Text>
        <Image
          source={images.notFound}
          resizeMode="contain"
          className="w-full h-1/2"
        />
        <Text className="text-center text-2xl font-kregular py-2 sm:py-4">
          Resource Not Found
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-brand-midnight my-20 w-3/4 rounded-lg"
        >
          <Text className="text-brand-primary font-kmedium text-sm sm:text-base px-4 py-2 text-center">
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NotFound;
