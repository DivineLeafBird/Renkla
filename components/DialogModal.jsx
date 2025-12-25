import { View, Text, Modal, ScrollView, TouchableOpacity } from "react-native";
import React from "react";

const DialogModal = ({
  modalVisible,
  toggleModalVisible,
  getSummary,
  handleAction,
  title,
  message,
  actionBtnText,
  BtnStyles,
}) => {
  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModalVisible}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl w-[80%] max-w-md">
            <Text className="text-xl font-kbold text-brand-midnight mb-2">
              {title}
            </Text>
            <Text className="text-base font-kmedium text-brand-urbanGray mb-2">
              {message}
            </Text>

            <ScrollView
              className="max-h-56 mb-4"
              showsVerticalScrollIndicator={true}
            >
              {getSummary()?.map((item, index) => (
                <View key={index} className="py-1 border-b border-gray-100">
                  <Text className="text-sm font-kmedium text-brand-midnight">
                    {item}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View className="flex-row justify-end gap-4">
              <TouchableOpacity
                onPress={toggleModalVisible}
                className="px-4 py-2"
              >
                <Text className="text-base font-kmedium text-brand-urbanGray">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAction}
                className={`px-4 py-2 rounded-lg ${BtnStyles}`}
              >
                <Text className="text-base font-kmedium text-white">
                  {actionBtnText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default DialogModal;
