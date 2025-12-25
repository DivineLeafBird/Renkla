import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      className={`bg-brand-midnight rounded-xl min-h-[42px] flex-row justify-center items-center ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${containerStyles} `}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : (
        <Text className={`text-brand-primary  text-base ${textStyles}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
