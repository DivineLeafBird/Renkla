import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import IconButton from "../../components/IconButton";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../lib/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { handleFirebaseError } from "../../utils/firebaseErrors";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  // State for checkbox
  const [checked, setChecked] = useState(false);

  // State for loading
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingGoogle, setisLoadingGoogle] = useState(false);
  const [isLoadingApple, setisLoadingApple] = useState(false);

  //State for Firebase Error
  const [firebaseError, setFirebaseError] = useState(null);

  // State for form data
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Handle form data change
  const handleChangeText = (field) => (e) => {
    const value = field === "email" ? e.toLowerCase() : e;
    // Update the form state with the input value
    setForm({ ...form, [field]: value });
    // Validate the input value
    validateField(field, value);
  };

  // State for form errors
  const [formError, setFormError] = useState({
    email: "",
    password: "",
  });

  // State for form validity
  const [isFormValid, setIsFormValid] = useState(false);

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

  // Function to sign-in a user with Email and Password
  const loginUser = async () => {
    if (isFormValid) {
      setisLoading(true);

      try {
        // Create the user with email and password
        const userCredential = await signInWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        const user = userCredential.user;
        // Store the user object or token in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(user));

        console.log("Sign-in Successful.", user);

        // Redirect to home
        router.replace("/home");

        // You might want to store additional data like the user's profile in Firestore here
      } catch (error) {
        console.log(error);
        const customErrorMessage = handleFirebaseError(error);
        setFirebaseError(customErrorMessage);
        Alert.alert("Error", customErrorMessage);
      } finally {
        setisLoading(false);
      }
    }
  };

  const submit = () => {
    loginUser();
  };

  // Set up the Google auth request
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: Constants.expoConfig.extra.IOS_CLIENT_ID,
    androidClientId: Constants.expoConfig.extra.ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleSignIn(authentication.idToken);
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken) => {
    setisLoadingGoogle(true);

    const credential = GoogleAuthProvider.credential(idToken);
    try {
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;
      console.log(user);

      // Store the user object or token in AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(user));
      console.log("Signed in successfully with Google as:", user.displayName);
      // Redirect to home
      router.replace("/home");
    } catch (error) {
      console.error("Failed to sign in with Google:", error);
      const customErrorMessage = handleFirebaseError(error);
      setFirebaseError(customErrorMessage);
      Alert.alert("Failed to sign in with Google", customErrorMessage);
    } finally {
      setisLoadingGoogle(false);
    }
  };

  // Prompt Function to sign-in a user with Google
  const promptGoogleSignin = async () => {
    promptAsync();
  };

  // Function to sign-in a user with Apple

  return (
    <SafeAreaView className="bg-brand-secondary flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          className=" min-h-screen  rounded-t-3xl shadow-2xl w-screen justify-center items-center space-y-2 px-4 mt-6"
          style={{ backgroundColor: "rgba(203, 212, 225, 0.2)" }}
        >
          <Text className="text-center text-2xl font-kmedium py-8">
            Welcome Back!
          </Text>
          <FormField
            title="Email"
            placeholder="Email"
            value={form.email}
            handleChangeText={handleChangeText("email")}
            error={formError.email}
            otherStyles="justify-between sm:w-3/4 mb-4"
            icon={icons.envelope}
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            placeholder="Password"
            value={form.password}
            handleChangeText={handleChangeText("password")}
            otherStyles="justify-between sm:w-3/4  mb-4"
            icon={icons.lock}
            keyboardType="password"
          />
          <View className="flex-row w-full justify-around items-center sm:w-3/4 mb-8">
            <Pressable
              onPress={() => setChecked(!checked)}
              className="flex-row space-x-2 justify-start items-center"
            >
              <TouchableOpacity
                onPress={() => setChecked(!checked)}
                className={`w-4 h-4 border-2 border-brand-midnight items-center justify-center rounded ${
                  checked ? "bg-brand-midnight" : ""
                } `}
              >
                {checked ? (
                  <Image
                    tintColor="#FFF"
                    source={icons.check}
                    resizeMode="contain"
                    className="w-6 h-6"
                  />
                ) : null}
              </TouchableOpacity>
              <Text className="text-sm sm:text-base font-kregular text-brand-midnight text-center">
                Remember me
              </Text>
            </Pressable>
            <Link
              href={"/forgot-password"}
              className="text-sm sm:text-base font-kregular text-informative-200 text-center"
            >
              Forgot Password?
            </Link>
          </View>
          <CustomButton
            title="Login"
            handlePress={submit}
            containerStyles="w-full sm:w-3/4 my-2"
            disabled={!form.email || !form.password || isLoading}
            isLoading={isLoading}
            textStyles="text-sm font-kmedium sm:text-base "
          />
          <View className="flex-row justify-center items-center mb-8">
            <View className="flex-1 h-[1px] sm:ml-24 bg-brand-silverChalice" />
            <Text className="text-base font-kregular text-brand-urbanGray px-2">
              or
            </Text>
            <View className="flex-1 h-[1px] sm:mr-24 bg-brand-silverChalice" />
          </View>
          <IconButton
            title="Continue with Google"
            handlePress={promptGoogleSignin}
            containerStyles="w-full sm:w-3/4  mb-8"
            disabled={isLoadingGoogle}
            isLoading={isLoadingGoogle}
            icon={icons.google}
            iconColor=""
            textStyles="text-sm font-kmedium sm:text-base  "
          />
          {Platform.OS === "ios" && (
            <IconButton
              title="Continue with Apple"
              handlePress={() => router.push("/feature-unavailable")}
              containerStyles="w-full sm:w-3/4 mb-8"
              isLoading={isLoadingApple}
              disabled={isLoadingApple}
              icon={icons.apple}
              iconColor=""
              textStyles="text-sm font-kmedium sm:text-base  "
            />
          )}

          <Text className="text-sm sm:text-base font-kregular text-brand-midnight text-center mb-8">
            Don't have an account?
            <Link
              href={"/onboarding-auth"}
              className="text-informative-200 font-ksemibold"
            >
              {" "}
              Sign Up
            </Link>{" "}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
