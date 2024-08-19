import { Link, router } from "expo-router";
import * as React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";

import { useRouteInfo } from "expo-router/build/hooks";
import DStyle from "./style/style";
import api from "../Api";
import { getValue } from "./fonction/fonction";

export default function Navigation() {
  const route = useRouteInfo();
  const place = route.segments[0];
  const [notif, setNotif] = React.useState({
    message: 0,
    notif: 0,
    request: 0,
  });

  const gd = async () => {
    const u = await getValue("username");
    const token = await getValue("accessToken");
    const r = await api.get("/message/notif-count/" + u, {
      headers: { Authorization: "Token " + token },
    });
    if (r.status == 200) {
      setNotif({
        message: r.data.message,
        notif: r.data.notif,
        request: r.data.request,
      });
    }
  };

  React.useEffect(() => {
    gd();
  }, [notif]);

  return (
    <View style={style.header}>
      <Pressable
        style={[style.button, place === "Home" && style.activeButton]}
        onPress={() => router.replace("/Home")}
      >
        <Icon
          name="house"
          size={25}
          color={place === "Home" ? "black" : "gray"}
          solid={place === "Home"}
        />
      </Pressable>

      <Pressable
        style={[style.button, place === "Request" && style.activeButton]}
        onPress={() => router.push("/Request")}
      >
        <Icon
          name="user"
          size={25}
          color={place === "Request" ? "black" : "gray"}
          solid={place === "Request"}
        />
        {notif.request !== 0 && <NombreN countNotif={notif.request} />}
      </Pressable>

      <Pressable
        style={[style.button, place === "Messages" && style.activeButton]}
        onPress={() => router.push("/Messages")}
      >
        <Icon
          name="envelope"
          size={25}
          color={place === "Messages" ? "black" : "gray"}
          solid={place === "Messages"}
        />
        {notif.message !== 0 && <NombreN countNotif={notif.message} />}
      </Pressable>

      <Pressable
        style={[style.button, place === "Notification" && style.activeButton]}
        onPress={() => router.push("/Notification")}
      >
        <Icon
          name="bell"
          size={25}
          color={place === "Notification" ? "black" : "gray"}
          solid={place === "Notification"}
        />
        {notif.notif !== 0 && <NombreN countNotif={notif.notif} />}
      </Pressable>
    </View>
  );
}

const style = StyleSheet.create({
  header: {
    paddingTop: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 5,
    // Ajout de l'ombre portée
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Pour Android
  },
  button: {
    alignItems: "center",
    padding: 10,
  },
});

const NombreN = ({ countNotif }) => {
  return (
    <View
      style={{
        right: -4,
        top: 0,
        width: 17,
        height: 17,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green",
        position: "absolute",
      }}
    >
      <Text style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>
        {countNotif}
      </Text>
    </View>
  );
};
