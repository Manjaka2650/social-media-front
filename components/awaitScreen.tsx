import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function AwaitScreen({ visible, onClose }) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <View style={styles.modal}>
        <ActivityIndicator size={"small"} color={"purple"} />
      </View>
    </Modal>
  );
}

// export default AwaitScreen

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});
