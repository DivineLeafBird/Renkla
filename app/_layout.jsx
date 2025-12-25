import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import GlobalProvider from "../context/GlobalProvider";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "KumbhSans-Black": require("../assets/fonts/KumbhSans-Black.ttf"),
    "KumbhSans-Bold": require("../assets/fonts/KumbhSans-Bold.ttf"),
    "KumbhSans-ExtraBold": require("../assets/fonts/KumbhSans-ExtraBold.ttf"),
    "KumbhSans-ExtraLight": require("../assets/fonts/KumbhSans-ExtraLight.ttf"),
    "KumbhSans-Light": require("../assets/fonts/KumbhSans-Light.ttf"),
    "KumbhSans-Medium": require("../assets/fonts/KumbhSans-Medium.ttf"),
    "KumbhSans-Regular": require("../assets/fonts/KumbhSans-Regular.ttf"),
    "KumbhSans-SemiBold": require("../assets/fonts/KumbhSans-SemiBold.ttf"),
    "KumbhSans-Thin": require("../assets/fonts/KumbhSans-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        <Stack.Screen
          name="feature-unavailable"
          options={{ headerShown: false }}
        />
      </Stack>
    </GlobalProvider>
  );
};

export default RootLayout;
