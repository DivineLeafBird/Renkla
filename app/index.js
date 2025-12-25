import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
import onboardingItems from "../data/onboarding";
import FluidPaginator from "../components/FluidPaginator";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../context/GlobalProvider";

const App = () => {
  const { isLoading } = useGlobalContext();

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  if (isLoading) {
    return null;
  }
  return (
    <SafeAreaView className="bg-brand-secondary flex-1">
      <View className="w-screen justify-center items-center max-h-screen">
        <View className="mt-6 h-[96%]">
          {/* Slider */}
          <ScrollView
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}
            ref={slideRef}
          >
            {onboardingItems.map((item) => (
              <View key={item.id} className="w-screen items-center">
                <View className="w-5/6 h-full  rounded-3xl overflow-hidden">
                  <ImageBackground
                    source={item.image}
                    className="w-full h-full"
                    style={{
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                    resizeMethod="contain"
                  >
                    <Text className="text-4xl font-ksemibold text-brand-midnight mt-6 px-3 sm:text-6xl sm:mt-12 sm:px-6">
                      {item.title}
                    </Text>
                    <Text className="text-lg font-kmedium text-brand-primary mb-6 px-3 sm:text-3xl sm:px-6">
                      {item.description}
                    </Text>
                  </ImageBackground>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Slider Pagination */}
          <View className="flex items-center mt-6">
            <FluidPaginator data={onboardingItems} scrollX={scrollX} />
          </View>

          {/* Next Button */}
          <View
            className="justify-center items-center grow min-h-48  rounded-t-3xl shadow-2xl mt-6 p-2"
            style={{ backgroundColor: "rgba(203, 212, 225, 0.2)" }}
          >
            <Text className="text-2xl font-kmedium text-brand-midnight">
              Welcome to R<Text className="text-brand">e</Text>nkl
              <Text className="text-brand">a</Text>
            </Text>
            <Text className="text-sm sm:text-lg font-kregular text-brand-urbanGray my-4 text-center">
              “Where elegance meets exclusivity. Let's get started on your style
              journey!" Discover exclusive styles and personalized shopping
              experiences.
            </Text>
            <CustomButton
              title="Get Started"
              handlePress={() => router.push("/onboarding-auth")}
              containerStyles="w-full my-4 "
              textStyles="font-ksemibold"
            />
          </View>
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default App;
