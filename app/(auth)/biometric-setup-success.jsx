import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const BiometricSetupSuccess = () => {
  return (
    <SafeAreaView className="bg-brand-secondary h-full">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1  items-center  w-screen  min-h-screen px-4 bg-brand-secondary">
          <View className="h-2/3 w-screen ">
            <LinearGradient
              colors={[
                "rgba(246, 248, 251, 0.80)",
                "rgba(186, 255, 251, 0.80)",
                "rgba(246, 248, 251, 0.80)",
              ]}
              locations={[0.251, 0.5806, 0.7454]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1 }}
            >
              <View className="flex-1 items-center justify-end px-4 ">
                <Ionicons
                  name="finger-print-outline"
                  size={58}
                  margin={32}
                  color="#F14A58"
                />
                <Text className="text-brand-midnight my-1 text-center text-2xl font-kmedium">
                  Biometric Authentication is now enabled!
                </Text>
                <Text className="text-brand-midnight text-center px-5 pt-8 text-base font-kregular">
                  You can disable it anytime from settings.
                </Text>
              </View>
            </LinearGradient>
          </View>
          <CustomButton
            title="Continue"
            handlePress={() => router.push("/sign-up-success")}
            containerStyles="w-full sm:w-3/4 my-14"
            textStyles="text-sm font-kmedium sm:text-base "
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BiometricSetupSuccess;
