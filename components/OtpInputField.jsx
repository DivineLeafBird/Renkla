import { View, Text, TextInput } from "react-native";
import React, { useRef, useState, useEffect } from "react";

const OtpInputField = ({ setOtp }) => {
  const [otp, setLocalOtp] = useState(["", "", "", "", "", ""]); // For 6-digit OTP
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setLocalOtp(newOtp);

    // Call the callback function to update OTP in parent component
    setOtp(newOtp.join("")); // Combine OTP digits and update parent component

    // Move focus to next input if the current input has a value
    if (text && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus(); // Move focus to previous input on backspace
    }
  };

  return (
    <View className="flex-row justify-between p-6">
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(input) => (inputs.current[index] = input)} // Reference to each input
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          className="w-8 mx-2 border-none border-b-[3px] border-brand-urbanGray   focus:border-interactive focus:outline-none text-center text-2xl font-ksemibold"
        />
      ))}
    </View>
  );
};

export default OtpInputField;
