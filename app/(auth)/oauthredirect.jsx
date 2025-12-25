import { View, ActivityIndicator, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const OAuthRedirect = () => {
  return (
    <SafeAreaView className="bg-brand-secondary h-full">
      <View className="mt-6 flex-1 items-center justify-center px-4">
        <View className="">
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{ transform: [{ scale: 1.2 }] }}
          />
          <Text className="text-center text-2xl font-kregular py-2 sm:py-4">
            Please wait...
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OAuthRedirect;
