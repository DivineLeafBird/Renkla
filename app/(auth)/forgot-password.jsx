import { View, Text, Alert, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../lib/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import FormField from "../../components/FormField";
import { icons, images } from "../../constants";
import CustomButton from "../../components/CustomButton";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  // State for form data
  const [form, setForm] = useState({
    email: "",
  });

  // State for form errors
  const [formError, setFormError] = useState({
    email: "",
  });

  // State for form validity
  const [isFormValid, setIsFormValid] = useState(false);

  // Handle form data change
  const handleChangeText = (field) => (e) => {
    const value = field === "email" ? e.toLowerCase() : e;
    // Update the form state with the input value
    setForm({ ...form, [field]: value });
    // Validate the input value
    validateField(field, value);
  };

  // Validate input and update errors
  const validateField = (field, value) => {
    let newErrors = { ...formError };
    switch (field) {
      case "email":
        const emailPattern = /\S+@\S+\.\S+/;
        if (!emailPattern.test(value)) {
          newErrors[field] = "Email is invalid.";
        } else {
          newErrors[field] = "";
        }
        break;

      default:
        break;
    }

    setFormError(newErrors);
  };

  // Check if form is valid
  useEffect(() => {
    const formIsValid =
      Object.values(form).every((value) => value !== "") &&
      Object.values(formError).every((error) => error === "");
    setIsFormValid(formIsValid);
  }, [form, formError]);

  // Forgot Password
  const forgotPassword = async (email) => {
    if (isFormValid) {
      setIsLoading(true);
      try {
        await sendPasswordResetEmail(auth, email);
        Alert.alert(
          "Email Sent",
          "A password reset link has been sent to your email."
        );
        // Clear the form and errors
        setForm({ email: "" });
        setFormError({ email: "" });
      } catch (error) {
        console.error("Error sending password reset email:", error);
        Alert.alert("Error", "Failed to send password reset email.");
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert("Error", "Please enter a valid email address.");
    }
  };

  const handleForgotPassword = () => {
    if (form.email) {
      forgotPassword(form.email);
    }
  };

  return (
    <SafeAreaView className="bg-brand-secondary flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-4"
      >
        <View className="items-center px-4 mt-6 ">
          <Image
            source={images.banner}
            resizeMode="contain"
            className="w-full h-1/5 my-4"
          />
          <Text className="text-center text-2xl text-brand-midnight font-kmedium">
            Password Reset
          </Text>
          <Text className="text-center my-4 text-base font-kregular text-brand-midnight">
            Enter your email address to reset your password.
          </Text>

          <FormField
            title="Email"
            placeholder="Email"
            value={form.email}
            handleChangeText={handleChangeText("email")}
            error={formError.email}
            keyboardType="email-address"
            otherStyles="justify-between sm:w-3/4 my-4"
            icon={icons.envelope}
          />
          <Text className="text-center my-2 text-sm font-kregular text-brand-midnight">
            We will send a password reset link to your email.
          </Text>

          <CustomButton
            title="Reset Password"
            containerStyles="w-full sm:w-3/4 my-4"
            handlePress={handleForgotPassword}
            disabled={!form.email || !isFormValid || isLoading}
            isLoading={isLoading}
            textStyles="text-sm font-kmedium sm:text-base  "
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPassword;
