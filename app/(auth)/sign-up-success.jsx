import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUpSuccess = () => {
  const { viewedOnboarding, toggleOnboarding } = useGlobalContext();

  const completeSignUp = () => {
    toggleOnboarding();
    router.replace("/home");
  };

  return (
    <SafeAreaView className="bg-brand-secondary h-full">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1  items-center justify-center  w-screen  min-h-screen px-4 bg-brand-secondary">
          <Image
            source={images.success}
            className="w-full h-1/4 "
            resizeMode="contain"
          />
          <Text className="text-brand-midnight text-center text-2xl font-kmedium">
            Congratulations!
          </Text>
          <Text className="text-brand-midnight text-center px-5 py-4 text-base font-kregular">
            Your account has been successfully created. Start shopping your
            favourite collections now!
          </Text>

          <CustomButton
            title="Okay"
            handlePress={completeSignUp}
            containerStyles="w-full sm:w-3/4 my-4"
            textStyles="text-sm font-kmedium sm:text-base "
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpSuccess;
