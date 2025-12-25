import { View, Text, Modal, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "./CustomButton";

const Picker = ({
  modalVisible,
  onClose,
  data,
  onSelect,
  title = "Select an Option",
  modalStyles = "bg-brand-primary rounded-lg p-5 my-7 mx-4",
  textStyles = "text-brand-midnight text-lg font-kmedium",
}) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelect = (item) => {
    // Toggle selection
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
      onSelect(null); // Clear selection
    } else {
      setSelectedItem(item);
      onSelect(item);
      modalVisible && onClose(); // Close modal if open
    }
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <View className={modalStyles}>
          <Text className="text-center text-xl font-bold mb-4">{title}</Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item.code || item.id}
            renderItem={({ item }) => {
              const isSelected = selectedItem?.id === item.id;

              return (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className="flex-row items-center justify-between px-4 py-2 border-b border-b-[#ccc] overflow-hidden"
                >
                  <>
                    <Text className={textStyles}>
                      {item.flag ? `${item.flag} ${item.name}` : item.name}
                    </Text>
                    {item.dialCode && (
                      <Text className={textStyles}>+{item.dialCode}</Text>
                    )}
                  </>
                  {isSelected && (
                    <Ionicons name="checkmark" size={20} color="#000" />
                  )}
                </TouchableOpacity>
              );
            }}
          />
          <CustomButton
            title="Close"
            handlePress={onClose}
            containerStyles="px-10 mt-5 py-2 rounded-lg"
            textStyles="font-kmedium"
          />
        </View>
      </View>
    </Modal>
  );
};

export default Picker;
