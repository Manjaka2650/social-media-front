import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function PhotoView() {
  const { uri } = useLocalSearchParams();
  return (
    <View>
      <View>
        <Text>Retour</Text>
      </View>
      <View style={{ width: "100%", height: "100%", backgroundColor: "black" }}>
        <Image
          style={{ width: "100%", height: "100%" }}
          source={{ uri: `${uri}` }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
