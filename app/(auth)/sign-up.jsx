import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { useEffect, useState } from "react";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithCredential,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../../lib/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { handleFirebaseError } from "../../utils/firebaseErrors";

const SignUp = () => {
  // State for checkbox
  const [checked, setChecked] = useState(false);

  //State for Firebase Error
  const [firebaseError, setFirebaseError] = useState(null);

  // State for form data
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // State for form validity
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate input and update errors
  const validateField = (field, value) => {
    let newErrors = { ...formError };

    switch (field) {
      case "name":
        if (value.length < 3) {
          newErrors[field] = "Name must be at least 3 characters long.";
        } else {
          newErrors[field] = "";
        }
        break;

      case "email":
        const emailPattern = /\S+@\S+\.\S+/;
        if (!emailPattern.test(value)) {
          newErrors[field] = "Email is invalid.";
        } else {
          newErrors[field] = "";
        }
        break;

      case "password":
        if (value.length < 8) {
          newErrors[field] = "Password must be at least 8 characters long.";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          newErrors[field] =
            "Password must contain at least one special character.";
        } else {
          newErrors[field] = "";
        }
        break;

      case "confirmPassword":
        if (value !== form.password) {
          newErrors[field] = "Password does not match.";
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

  // Function to create a new user
  const createUser = async () => {
    const { confirmPassword, ...formData } = form;

    if (isFormValid && checked) {
      setisLoading(true);

      try {
        // Create the user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        const user = userCredential.user;

        const getInitials = (name) => {
          const initials = name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();
          return initials;
        };

        const generateAvatarUrl = (name) => {
          const initials = getInitials(name);
          // Example URL using a service that creates avatars from initials
          return `https://ui-avatars.com/api/?name=${initials}&background=random&size=128`;
        };

        const avatarUrl = generateAvatarUrl(form.name);

        // Update the user's profile with the username
        await updateProfile(user, {
          displayName: form.name,
          photoURL: avatarUrl,
        });

        // Store the user's data in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isAdmin: false,

          createdAt: Timestamp.now(),
        });

        console.log("User created and data stored in Firestore");

        // Store the user object or token in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(user));

        // Log the user object
        console.log("Sign-up Successful.", user);

        await sendEmailVerification(userCredential.user);
        alert("Verification email sent. Please check your inbox.");

        // Redirect to add phone number
        router.replace("/onboarding-phone-add");
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

  const [isLoading, setisLoading] = useState(false);
  const submit = () => {
    createUser();
  };
  return (
    <SafeAreaView className="bg-brand-secondary h-full">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          className="min-h-screen rounded-t-3xl shadow-2xl w-screen justify-center items-center px-4 mt-6"
          style={{ backgroundColor: "rgba(203, 212, 225, 0.2)" }}
        >
          <Text className="text-center text-2xl font-kmedium py-8 sm:py-20">
            Create Account
          </Text>
          <FormField
            title="Name"
            placeholder="Full Name"
            value={form.name}
            handleChangeText={handleChangeText("name")}
            error={formError.name}
            otherStyles="justify-between sm:w-3/4 mb-4 "
            icon={icons.user}
          />
          <FormField
            title="Email"
            placeholder="Email"
            value={form.email}
            handleChangeText={handleChangeText("email")}
            error={formError.email}
            otherStyles="justify-between sm:w-3/4  mb-4"
            icon={icons.envelope}
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            placeholder="Password"
            value={form.password}
            handleChangeText={handleChangeText("password")}
            error={formError.password}
            otherStyles="justify-between sm:w-3/4  mb-4"
            icon={icons.lock}
            keyboardType="password"
          />
          <FormField
            title="Confirm Password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            handleChangeText={handleChangeText("confirmPassword")}
            error={formError.confirmPassword}
            otherStyles="justify-between sm:w-3/4  mb-4"
            icon={icons.lock}
          />
          <Pressable
            onPress={() => setChecked(!checked)}
            className="flex-row justify-start px-1 sm:w-3/4  items-center mb-8"
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
            <Text className="text-sm font-kregular align-top text-brand-midnight ml-2">
              By signing up, you agree to the{" "}
              <Link href={"/TBA"} className="text-informative-200">
                terms of service
              </Link>
              {""}
              and{" "}
              <Link href={"/TBA"} className="text-informative-200">
                privacy policy
              </Link>{" "}
              , including{" "}
              <Link href={"/TBA"} className="text-informative-200">
                cookie use
              </Link>
            </Text>
          </Pressable>
          <CustomButton
            title="Create Account"
            handlePress={submit}
            containerStyles="w-full sm:w-3/4 mb-8"
            disabled={!isFormValid || !checked || isLoading}
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
          <Text className="sm:w-3/4 mb-8 px-2 text-sm sm:text-base font-kmedium text-brand-midnight text-center">
            Already have an account?
          </Text>
          <CustomButton
            title="Sign in"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full sm:w-3/4 mb-8"
            textStyles="text-sm font-kmedium sm:text-base "
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
