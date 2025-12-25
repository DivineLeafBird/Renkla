import { TouchableOpacity, Text, Image } from "react-native";

const IconButton = ({
  title,
  icon,
  iconColor,
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
      className={`bg-brand-midnight rounded-xl min-h-[42px] flex-row justify-center items-center space-x-4 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${containerStyles} `}
    >
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={iconColor}
        className="w-6 h-6"
      />
      <Text
        className={`text-brand-primary font-ksemibold text-base ${textStyles}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default IconButton;
