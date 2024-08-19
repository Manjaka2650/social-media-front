import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import React from "react";

export default function PhotoView({ image, onClose }) {
  return (
    <Modal
      onRequestClose={onClose}
      style={{ height: "100%", backgroundColor: "black" }}
    >
      <View>
        <Pressable onPress={onClose} style={{ alignSelf: "flex-end" }}>
          <View>
            <Text style={{ margin: 10, fontSize: 30, fontWeight: "bold" }}>
              X
            </Text>
          </View>
          <View style={{ width: "100%", height: "100%" }}>
            <Image
              style={{ width: 100, height: 100 }}
              source={{ uri: image }}
            />
          </View>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
