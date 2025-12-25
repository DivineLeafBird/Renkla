import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import { db } from "../../lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const countryData = [
  { name: "Kenya", code: "KE", dialCode: "254", flag: "🇰🇪" },
];

const OnboardingPhoneAdd = () => {
  const [selectedCountry, setSelectedCountry] = useState(countryData[0] || {});
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { isLoggedIn } = useGlobalContext();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const { user } = useGlobalContext();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const selectCountry = (country) => {
    if (country) {
      setSelectedCountry(country);
    }

    toggleModal();
  };

  const toggleConfirmModal = () => {
    setConfirmModalVisible(!confirmModalVisible);
  };

  const handleChangeText = (text) => {
    setPhoneNumber(text);
  };

  const formatPhoneNumber = (phone) => {
    // Remove any non-digit characters like spaces, dashes, etc.
    let cleaned = phone.replace(/[^0-9]/g, "");

    // If the number starts with '0', replace it with the country code
    if (cleaned.startsWith("0")) {
      cleaned = selectedCountry.dialCode + cleaned.slice(1);
    }

    // If the number already starts with the country code, ensure it's in the right format
    if (cleaned.startsWith(selectedCountry.dialCode)) {
      cleaned = `+${cleaned}`;
    }

    // If the number starts with '7', it's a mobile number, add the country code
    if (cleaned.startsWith("7")) {
      cleaned = `${selectedCountry.dialCode}${cleaned}`;
    }

    // If the number starts with a '+', it's already in international format
    if (!cleaned.startsWith("+")) {
      cleaned = `+${cleaned}`;
    }

    // Validate the number length based on expected phone number lengths (optional)
    if (cleaned.length > 13 || cleaned.length < 13) {
      return "";
    }
    return cleaned;
  };

  const standardPhoneNumber = formatPhoneNumber(phoneNumber);

  // Check and update the verified phone numbers
  const updatePhoneNumber = async () => {
    if (isLoggedIn) {
      setIsLoading(true);
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          data = userSnap.data();

          // Destructure phoneNumbers as an object and get values as an array
          const phoneNumbers = Object.values(data.phoneNumbers || {});

          // If phone number already exists, show alert
          if (phoneNumbers.includes(standardPhoneNumber)) {
            Alert.alert(
              "Phone Number Already Exists!",
              `${standardPhoneNumber} \n Please enter a different phone number.`
            );
            return;
          }

          // Ensure only two numbers, and one is primary
          if (phoneNumbers.length >= 2) {
            Alert.alert(
              "Maximum phone numbers reached!",
              "You can only add two phone numbers."
            );
            return;
          }

          // Destructure the current phone numbers or use empty strings as defaults
          const { primary = "", secondary = "" } = data.phoneNumbers || {};

          // Determine which field to update based on availability
          let phoneNumbersUpdate = {};
          if (!primary) {
            phoneNumbersUpdate = {
              "phoneNumbers.primary": standardPhoneNumber,
            };
          } else if (!secondary) {
            phoneNumbersUpdate = {
              "phoneNumbers.secondary": standardPhoneNumber,
            };
          } else {
            Alert.alert(
              "Both primary and secondary phone numbers are already set."
            );
            return;
          }

          // Update the Firestore document with the new phone number
          await updateDoc(userRef, phoneNumbersUpdate);

          console.log("Phone number added successfully!");
          Alert.alert("Phone number added Successfully!");
          router.push("/biometric-setup");
        }
      } catch (error) {
        console.error("Error adding phone number: ", error);
        Alert.alert(
          "Error adding phone number",
          "An error occurred while adding phone number. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert("Please sign in first");
      router.push("/sign-in");
    }
  };

  return (
    <SafeAreaView className="bg-brand-secondary h-full">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1  items-center  min-h-screen px-4 bg-brand-secondary">
          <Image
            source={images.onboarding4}
            className="w-full h-1/4 my-4"
            resizeMode="contain"
          />
          <Text className="text-brand-midnight my-8 text-2xl font-kregular">
            Add Your Phone Number
          </Text>
          <View className="container p-5">
            <View className="flex-row items-center justify-center border-b border-b-brand-urbanGray py-1 ">
              <TouchableOpacity
                onPress={toggleModal}
                className="flex-row items-center mr-3"
              >
                <Text className="text-brand-midnight text-2xl ml-4 mr-2 font-kmedium">
                  {selectedCountry.flag || "🌍"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#000" />
              </TouchableOpacity>

              <TextInput
                className="flex-1 items-center mb-1 ml-4  text-brand-midnight text-lg font-kmedium"
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handleChangeText}
              />
              {error ? (
                <Text className="mb-2 px-4 text-sm sm:text-base font-kregular text-negative-200">
                  <AntDesign
                    name="exclamationcircleo"
                    size={18}
                    color="#B1000F"
                  />{" "}
                  {error}
                </Text>
              ) : null}
            </View>

            {/* Country picker modal */}
            <Modal
              visible={modalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={toggleModal}
            >
              <View
                className="flex-1 justify-center"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <View className="bg-brand-primary rounded-lg p-5 my-7 mx-4">
                  <FlatList
                    data={countryData}
                    keyExtractor={(item) => item.code}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => selectCountry(item)}
                        className="flex-row items-center justify-between py-2 border-b border-b-[#ccc]  overflow-hidden"
                      >
                        <Text className="text-brand-midnight text-lg mr-2 font-kmedium">
                          {item.flag} {""} {item.name}
                        </Text>
                        <Text className="text-brand-midnight text-lg font-kmedium">
                          +{item.dialCode}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />

                  <CustomButton
                    title="Close"
                    handlePress={toggleModal}
                    containerStyles={"px-10 mt-5 py-2  rounded-lg"}
                    textStyles={"font-kmedium "}
                  />
                </View>
              </View>
            </Modal>
          </View>
          {/* Confirm Phone Number Modal */}
          <Modal
            visible={confirmModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={toggleConfirmModal}
          >
            <View
              className="flex-1 justify-center"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <View className="bg-brand-primary rounded-lg p-5 my-7 mx-4">
                <Text className="text-brand-midnight text-lg font-kmedium">
                  Confirm Phone Number
                </Text>
                <Text className="text-positive-200 text-lg font-kmedium">
                  {standardPhoneNumber}
                </Text>
                <CustomButton
                  title="Confirm"
                  handlePress={() => {
                    updatePhoneNumber();
                    toggleConfirmModal();
                  }}
                  containerStyles={"px-10 mt-5 py-2  rounded-lg"}
                  textStyles={"font-kmedium "}
                />
                <CustomButton
                  title="Cancel"
                  handlePress={toggleConfirmModal}
                  containerStyles={
                    "px-10 mt-5 py-2  rounded-lg bg-brand-primary border-2 border-brand-midnight"
                  }
                  textStyles={"font-kmedium text-brand-midnight"}
                />
              </View>
            </View>
          </Modal>

          <CustomButton
            title="Add Phone Number"
            handlePress={toggleConfirmModal}
            disabled={!standardPhoneNumber}
            containerStyles="w-full sm:w-3/4 mt-12 mb-8"
            isLoading={isLoading}
            textStyles="text-sm font-kmedium sm:text-base "
          />
          <CustomButton
            title="Not now"
            handlePress={() => router.push("/biometric-setup")}
            containerStyles="w-full sm:w-3/4 mb-8 bg-brand-primary border-2 border-brand-midnight"
            textStyles="text-sm font-kmedium sm:text-base text-brand-midnight"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OnboardingPhoneAdd;
