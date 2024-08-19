import { Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import Icn from "react-native-vector-icons/FontAwesome5";
import React from "react";
import { Link } from "expo-router";

export default function HeaderGlimer() {
  return (
    <View style={style.header}>
      <View style={style.titleView}>
        <Text style={{ fontSize: 40, fontWeight: "bold" }}>G</Text>
        <Text style={style.titleText}>limmer</Text>
      </View>
      <View style={style.iconsContainer}>
        <Pressable style={style.iconButton}>
          <Link href={"/Recherche"}>
            <Icn name="search" size={23} color="#000" />
          </Link>
        </Pressable>
        <Pressable style={style.iconButton}>
          <Link href={"/NewPost"}>
            <Icon name="plus" size={24} color="#000" />
          </Link>
        </Pressable>
        <Pressable style={style.iconButton}>
          <Link href={"/Parameter"}>
            <Icon name="bars" size={30} color="#000" />
          </Link>
        </Pressable>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 5,
    // Ajout de l'ombre portée
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Pour Android
  },
  titleView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  iconsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 120,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
