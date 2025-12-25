import { View, Text, Image, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import { images } from "../../constants";
import OtpInputField from "../../components/OtpInputField";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebaseConfig";

const OtpVerify = () => {
  const { phoneNumber, verificationId } = useLocalSearchParams();
  const [otp, setOtp] = useState(""); // State to store the full OTP entered by the user
  const [isLoading, setIsLoading] = useState(false);

  // Function to censor the phone number
  const censorPhoneNumber = (phone) => {
    if (!phone) return ""; // Return empty string if phoneNumber is undefined or empty
    const firstThree = phone.slice(0, 4);
    const lastDigit = phone.slice(-2);
    return `${firstThree}******${lastDigit}`;
  };

  // Verify the OTP code
  const verifyOTP = async () => {
    setIsLoading(true);
    try {
      // Get credential from verification ID and OTP
      const credential = PhoneAuthProvider.credential(verificationId, otp);

      // Sign in with the credential
      await signInWithCredential(auth, credential);
      Alert.alert("Phone number verified!");

      // Add the phone number in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        phoneNumber: phoneNumber,
      });

      // Redirect to biometric setup
      router.push("/biometric-setup");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-brand-secondary h-full">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1  items-center justify-center   min-h-screen px-4 bg-brand-secondary">
          <Image
            source={images.authentication}
            className="w-full h-1/4 my-4"
            resizeMode="contain"
          />
          <Text className="text-brand-midnight my-8 text-2xl font-kmedium">
            Enter Verification Code
          </Text>
          <Text className="text-brand-midnight text-base px-4 mb-6 font-kregular">
            We have sent a verification code to your phone number{" "}
            {censorPhoneNumber(phoneNumber)}
          </Text>

          <OtpInputField setOtp={setOtp} />

          <View className="flex-row justify-between items-center mt-4">
            <Text className="text-brand-midnight text-sm font-kregular">
              Didn't receive the code?{" "}
            </Text>
            <Text className="text-informative-200 text-sm font-kmedium">
              Resend Code
            </Text>
          </View>

          <CustomButton
            title="Verify"
            handlePress={verifyOTP}
            containerStyles="w-full sm:w-3/4 mt-12 mb-8"
            isLoading={isLoading}
            textStyles="text-sm font-kmedium sm:text-base "
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OtpVerify;
