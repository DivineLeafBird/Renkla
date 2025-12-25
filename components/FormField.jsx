import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

const FormField = ({
  title,
  value,
  icon,
  otherStyles,
  placeholder,
  handleChangeText,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="w-full mb-4 items-center">
      {/* Display error message above the input field */}
      {error ? (
        <Text className="mb-2 px-4 text-sm sm:text-base font-kregular text-negative-200">
          {error}
        </Text>
      ) : null}
      <View
        className={`flex-row items-center px-6 h-14 rounded-2xl bg-brand-overlay bg-opacity-40 ${
          error ? "bg-negative-100 border-2 border-negative-200" : ""
        } ${otherStyles}`}
      >
        {/* Icon on the left side */}
        {icon && (
          <Image source={icon} resizeMode="contain" className="w-6 h-6 mr-4" />
        )}

        {/* Input field */}
        <TextInput
          className="flex-1 bg-transparent text-brand-midnight text-base font-kregular"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#797979"
          onChangeText={handleChangeText}
          secureTextEntry={
            (title === "Password" || title === "Confirm Password") &&
            !showPassword
          }
          {...props}
        />

        {/* Password visibility toggle */}
        {(title === "Password" || title === "Confirm Password") && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eyeClosed : icons.eyeOpen}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
