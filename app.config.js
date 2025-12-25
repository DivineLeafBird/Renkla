import "dotenv/config";

export default {
  expo: {
    name: "Renkla",
    slug: "renkla",
    scheme: "renkla",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icons/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/icons/splash.png",
      resizeMode: "contain",
      backgroundColor: "#F6F8FB",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.divineleafbird.renkla",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icons/adaptive-icon.png",
        backgroundColor: "#F6F8FB",
      },
      package: "com.divineleafbird.renkla",
    },
    web: {
      favicon: "",
    },
    plugins: ["expo-router"],
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "2d494210-4f60-42cf-a871-ecee1d4917c4",
      },
      API_KEY: process.env.API_KEY,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      PROJECT_ID: process.env.PROJECT_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      APP_ID: process.env.APP_ID,
      IOS_CLIENT_ID: process.env.IOS_CLIENT_ID,
      ANDROID_CLIENT_ID: process.env.ANDROID_CLIENT_ID,
    },
    owner: "divineleafbird",
  },
};
