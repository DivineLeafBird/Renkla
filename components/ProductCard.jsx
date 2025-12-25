import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const ProductCard = () => {
  const [activeImage, setActiveImage] = useState(0);
  const images = [
    "https://www.freepik.com/free-psd/golden-dollar-sign-symbol-wealth-prosperity_410557561.htm#fromView=keyword&page=1&position=13&uuid=993a2724-a2ee-4880-898f-1e00327a3176&query=Assets",
  ];

  return (
    <View className="bg-brand-primary p-2 rounded-2xl shadow-lg w-[46%] border border-red-500 my-1 mx-1">
      {/* Image Carousel & Discount */}
      <View className="relative border border-red-500 rounded-2xl ">
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x /
                e.nativeEvent.layoutMeasurement.width
            );
            setActiveImage(index);
          }}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              className="w-full h-32 sm:h-48 rounded-2xl"
            />
          )}
        />
        <View className="absolute top-2 left-2 bg-red-500 px-2 py-1 rounded-lg">
          <Text className="text-white text-xs font-bold">50% OFF</Text>
          <Text className="text-white text-[10px]">Limited offer</Text>
        </View>
        <TouchableOpacity className="absolute top-2 right-2">
          <Ionicons name="heart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Carousel Indicators */}
      <View className="flex-row justify-center mt-2">
        {images.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              activeImage === index ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </View>

      {/* Rating */}
      <View className="flex-row items-center mt-2">
        <Text className="text-sm font-bold">4.6</Text>
        <FontAwesome name="star" size={16} color="red" className="ml-1" />
        <Text className="text-gray-500 text-xs ml-1">(319)</Text>
      </View>

      {/* Color Options */}
      <View className="flex-row mt-2 items-center">
        {["black", "gray", "olive", "brown"].map((color, index) => (
          <TouchableOpacity
            key={index}
            className={`w-6 h-6 rounded-lg mx-[2px] border-2 ${
              index === 0 ? "border-black" : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
        <Text className="text-gray-500 ml-2">+2</Text>
      </View>

      {/* Product Details */}
      {/* <Text className="text-sm sm:text-lg font-semibold mt-2">Hat</Text> */}
      <Text className="text-gray-500 mt-2">The North Face Beanie Hat</Text>

      {/* Pricing */}
      <View className="flex-row flex-wrap items-center mt-2">
        <Text className="text-sm sm:text-lg font-extrabold">KES 1500</Text>
        <Text className="text-gray-400 line-through ml-2">KES 3000</Text>
        <Text className="text-green-500 ml-2">50% off</Text>
      </View>
    </View>
  );
};

export default ProductCard;
