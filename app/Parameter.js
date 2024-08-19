import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome6";
import Icn from "react-native-vector-icons/FontAwesome5";
import { Link, router } from "expo-router";
import { disconnect, getValue } from "../components/fonction/fonction";
import lien from "../lien";
import DStyle from "../components/style/style";

export default function Parameter() {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");

  const getUserInfo = async () => {
    const us = await getValue("username");
    const avatar = await getValue("avatar");

    const e = await getValue("email");
    setEmail(e);
    setUsername(us);
    setAvatar(avatar);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const confirm = () => {
    Alert.alert(
      "Deconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        { text: "Non", style: "cancel" },
        { text: "Oui", onPress: async () => await disconnect() },
      ],
      { cancelable: true }
    );
  };

  const confirm2 = () => {
    Alert.alert(
      "Changer de compte",
      "Voulez-vous vraiment changer de compte ?",
      [
        { text: "Non", style: "cancel" },
        {
          text: "Oui",
          onPress: async () => {
            await disconnect();
            router.replace("/Login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <Link href={"/Home"}>
          <View style={styles.headerContent}>
            <Icon name="arrow-left" size={20} />
            <Text style={styles.headerText}>Paramètres</Text>
          </View>
        </Link>
      </View>

      {/* Options */}
      <ScrollView>
        <View
          style={[
            DStyle.flexDColumn,
            {
              alignSelf: "center",
              paddingBottom: 50,
              alignContent: "center",
              alignItems: "center",
              gap: 20,
            },
          ]}
        >
          <Image
            source={{ uri: `${lien}${avatar}` }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 100,
              borderWidth: 5,
              borderColor: "white",
            }}
          />
          <View
            style={[
              DStyle.flexDColumn,
              { alignContent: "center", alignItems: "center" },
            ]}
          >
            <Text style={{ fontWeight: "bold", fontSize: 24 }}>{username}</Text>
            <Text style={{ fontWeight: "condensed", fontSize: 18 }}>
              {email}
            </Text>
          </View>
        </View>
        <Pressable onPress={() => router.push(`/Profil/${username}`)}>
          <View style={styles.option}>
            <View
              style={[
                DStyle.flexDRow,
                { alignContent: "center", alignItems: "center" },
              ]}
            >
              <MaterialIcons name="account-circle" size={30} color="black" />
              {/* <Image source={{ uri: `${lien}${avatar}` }} style={styles.avatar} /> */}
              <Text style={styles.optionText}>Mon profil </Text>
            </View>
            <View>
              <Icon name="angle-right" size={25} color="gray" />
            </View>
          </View>
        </Pressable>

        <Pressable onPress={() => router.push("/SavedPost")}>
          <View style={styles.option}>
            <View
              style={[
                DStyle.flexDRow,
                { alignContent: "center", alignItems: "center" },
              ]}
            >
              {/* <Icon name="bookmark" size={40} color="purple" solid /> */}
              <Feather name="bookmark" size={30} color="black" />
              <Text style={styles.optionText}>Posts sauvegardés</Text>
            </View>
            <View>
              <Icon name="angle-right" size={25} color="gray" />
            </View>
          </View>
        </Pressable>

        <Pressable onPress={confirm2}>
          <View style={styles.option}>
            <View
              style={[
                DStyle.flexDRow,
                { alignContent: "center", alignItems: "center" },
              ]}
            >
              {/* <Icn name="user" size={35} color="black" solid /> */}
              <MaterialIcons name="switch-account" size={30} color="black" />
              <Text style={styles.optionText}>Changer de compte</Text>
            </View>
            <View>
              <Icon name="angle-right" size={25} color="gray" />
            </View>
          </View>
        </Pressable>

        <Pressable onPress={confirm}>
          <View style={styles.option}>
            {/* <Icn name="door-open" size={35} color="black" /> */}
            <View
              style={[
                DStyle.flexDRow,
                { alignContent: "center", alignItems: "center" },
              ]}
            >
              <MaterialCommunityIcons name="logout" size={30} color="black" />
              <Text style={styles.optionText}>Déconnexion</Text>
            </View>
            <View>
              <Icon name="angle-right" size={25} color="gray" />
            </View>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  option: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 15,
  },
});
