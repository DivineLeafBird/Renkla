import { View, Animated, useWindowDimensions } from "react-native";
import React from "react";

const FluidPaginator = ({ data, scrollX }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={{ flexDirection: "row", height: 2 }}>
      {data.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={index}
            style={{
              width: dotWidth,
              opacity,
              height: 4,
              marginHorizontal: 4,
              borderRadius: 2,
              backgroundColor: "#FF66C4",
            }}
          />
        );
      })}
    </View>
  );
};

export default FluidPaginator;
