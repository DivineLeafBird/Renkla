import { View, Text, Image, TouchableOpacity } from "react-native";
import { Tabs, Redirect, router } from "expo-router";
import { icons, images } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "../../context/GlobalProvider";

const TabItems = [
  {
    name: "home",
    title: "Home",
    icon: icons.home,
  },
  {
    name: "categories",
    title: "Categories",
    icon: icons.category,
  },
  {
    name: "favorites",
    title: "Favorites",
    icon: icons.favorite,
  },
  {
    name: "orders",
    title: "Orders",
    icon: icons.order,
  },
  {
    name: "notifications",
    title: "Notifications",
    icon: icons.notification,
  },
];

const BadgeCount = () => {
  return (
    <View className="absolute -top-1 -right-1 rounded-full w-4 h-4 items-center justify-center bg-brand-coralRed ">
      <Text className="text-xs font-kmedium text-brand-primary">3</Text>
    </View>
  );
};

// Custom Header Component for Tabs

// Home

const HomeHeader = () => {
  const { user } = useGlobalContext();
  return (
    <View className="flex-row w-full  items-center justify-between bg-brand-secondary">
      <TouchableOpacity>
        <Ionicons name="menu-outline" size={32} color="#000" />
      </TouchableOpacity>
      <Image
        source={images.banner}
        resizeMode="contain"
        className="w-16 h-12 ml-14"
      />
      <View className="flex-row items-end justify-center space-x-4">
        <TouchableOpacity>
          <Ionicons name="search-outline" size={26} color="#000" />
        </TouchableOpacity>
        {user ? (
          <View className="relative flex-row items-center justify-center space-x-4">
            <TouchableOpacity>
              <Ionicons name="cart-outline" size={26} color="#000" />
              <View className="absolute -top-1 -right-2 rounded-full w-4 h-4 items-center justify-center bg-brand-coralRed ">
                <Text className="text-xs font-kmedium text-brand-primary">
                  3
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={{ uri: user.photoURL }}
                className="w-8 h-8 rounded-full"
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => router.push("/sign-in")}>
            <View className="w-16 h-7 bg-brand-midnight items-center justify-center rounded-2xl ">
              <Text className="text-brand-primary font-kmedium text-sm text-center">
                Sign in
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Categories

const CategoriesHeader = () => {
  return (
    <View className="flex-row w-full items-center justify-between bg-brand-secondary">
      <Text></Text>
      <Text className="text-xl font-kbold text-brand-midnight">Categories</Text>
      <TouchableOpacity
        className="relative p-1 rounded-full border border-brand-midnight"
        style={{ backgroundColor: "rgba(203, 212, 225, 0.3)" }}
      >
        <Ionicons name="cart-outline" size={24} color="#000" />
        <BadgeCount />
      </TouchableOpacity>
    </View>
  );
};

// Favorites

const FavoritesHeader = () => {
  return (
    <View className="flex-row w-full items-center justify-between bg-brand-secondary">
      <Text></Text>
      <Text className="text-xl font-kbold text-brand-midnight">Favorites</Text>
      <TouchableOpacity
        className="relative p-1 rounded-full border border-brand-midnight"
        style={{ backgroundColor: "rgba(203, 212, 225, 0.3)" }}
      >
        <Ionicons name="cart-outline" size={24} color="#000" />
        <BadgeCount />
      </TouchableOpacity>
    </View>
  );
};

// Orders
const OrdersHeader = () => {
  return (
    <View className="flex-row w-full items-center justify-between bg-brand-secondary">
      <Text></Text>
      <Text className="text-xl font-kbold text-brand-midnight">Orders</Text>
      <TouchableOpacity
        className="relative p-1 rounded-full border border-brand-midnight"
        style={{ backgroundColor: "rgba(203, 212, 225, 0.3)" }}
      >
        <Ionicons name="cart-outline" size={24} color="#000" />
        <BadgeCount />
      </TouchableOpacity>
    </View>
  );
};

// Notifications

const NotificationsHeader = () => {
  return (
    <View className="flex-row w-full items-center justify-between bg-brand-secondary">
      <Text className="text-xl font-kbold text-brand-midnight">
        Notifications
      </Text>
      <TouchableOpacity>
        <Ionicons name="ellipsis-vertical" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

// Define dynamic headers based on screen name
const getHeaderComponent = (screenName) => {
  switch (screenName) {
    case "home":
      return <HomeHeader />;
    case "categories":
      return <CategoriesHeader />;
    case "favorites":
      return <FavoritesHeader />;
    case "orders":
      return <OrdersHeader />;
    case "notifications":
      return <NotificationsHeader />;
    default:
      return <Text className="text-lg font-bold text-white">{screenName}</Text>;
  }
};

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="w-20 -mb-3 items-center justify-center gap-1">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      {name === "Notifications" && (
        <View className="absolute -top-1 left-9 rounded-full w-4 h-4 items-center justify-center bg-brand-coralRed ">
          <Text className="text-xs font-kmedium text-brand-primary">3</Text>
        </View>
      )}
      <Text
        className={`text-xs text-center ${
          focused ? "font-kbold" : "font-kregular"
        }`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#F2930D",
          tabBarInactiveTintColor: "#FFFFFF",
          tabBarStyle: {
            backgroundColor: "#1A1C29",
            borderTopWidth: 1,
            borderTopColor: "#1A1C29",
            height: 64,
          },
        }}
      >
        {TabItems.map((tab, index) => (
          <Tabs.Screen
            key={index}
            name={tab.name}
            options={{
              title: tab.title,
              headerShown: true,
              headerTitle: () => getHeaderComponent(tab.name), // Use dynamic header based on tab name
              headerStyle: {
                backgroundColor: "#F6F8FB",
              },
              headerTintColor: "#1A1C29",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={tab.icon}
                  color={color}
                  name={tab.title}
                  focused={focused}
                />
              ),
            }}
          />
        ))}
      </Tabs>
    </>
  );
};

export default TabsLayout;
