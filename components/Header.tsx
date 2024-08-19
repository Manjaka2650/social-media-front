import { Link, router } from "expo-router";
import * as React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import DStyle from "./style/style";
import * as SecureStore from "expo-secure-store";
import api from "../Api";
import lien, { socketLink } from "../lien";
import { getToken, getValue, removeValue } from "./fonction/fonction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouteInfo } from "expo-router/build/hooks";
import HeaderGlimer from "./HeaderGlimer";

const Header = () => {
  const route = useRouteInfo();
  const place = route.segments[0];
  const [username, setUsername] = React.useState("");
  const i = async () => {
    setUsername(await getValue("username"));
  };
  // const [notif, setNotif] = React.useState(0);
  React.useEffect(() => {
    i();
  }, []);

  return (
    <View style={{ backgroundColor: "white", marginTop: 2 }}>
      <HeaderGlimer />
    </View>
  );
};

export default Header;

const style = StyleSheet.create({
  header: {
    paddingTop: 8,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    margin: 8,
    marginLeft: 15,
    marginRight: 30,
  },
  button: {
    alignItems: "center",
  },
  titleView: {
    paddingTop: 20,
    paddingBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 8,
    marginLeft: 10,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "condensedBold",
    // fontStyle: "italic",
  },
});
