import {
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome6";
import api from "../Api";
import { router } from "expo-router";
import DStyle from "./style/style";
import lien from "../lien";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StoreValue, getValue, removeValue } from "./fonction/fonction";
import AwaitScreen from "./awaitScreen";

const Login = () => {
  const [info, setInfo] = useState({
    username: "",
    password: "",
  });

  const [awaitVisible, setAwaitVisible] = useState(false);
  const handleLogin = async () => {
    setAwaitVisible(true);
    try {
      const response = await api.post(lien + "/login/", {
        username: info.username,
        password: info.password,
      });
      if (response.status == 200) {
        const data = await api.get(lien + "/user/" + info.username, {
          headers: {
            Authorization: `Token ${response.data.token}`,
          },
        });
        if (data.status == 200) {
          try {
            await StoreValue("username", data.data.username);
            await StoreValue("accessToken", response.data.token);
            await StoreValue("userId", JSON.stringify(data.data.id));
            await StoreValue("username", data.data.username);
            await StoreValue("email", data.data.email);
            await StoreValue("avatar", data.data.avatar);
            await StoreValue("bio", data.data.bio ? data.data.bio : "");
            await StoreValue("name", data.data.name ? data.data.name : "");
            router.replace("/Home");
          } catch (error) {
            alert(error);
          }
        } else alert("Mot de passe ou username error");
      } else alert("Mot de passe ou username error");
    } catch (error) {
      alert(error);
    } finally {
      setAwaitVisible(false);
    }
  };

  const rm = async () => {
    alert(await getValue("accessToken"));
  };

  const [isEnable, setisEnable] = useState(false);
  const fullfil = (name, value) => {
    setInfo({ ...info, [name]: value });
  };
  useEffect(() => {
    setisEnable(info.username.trim() === "" || info.password.trim() === "");
  }, [info]);

  return (
    <View
      style={[
        DStyle.flexDColumn,
        {
          gap: 30,
          padding: 20,
          justifyContent: "space-between",
          backgroundColor: "#fff",
          height: "100%",
        },
      ]}
    >
      <AwaitScreen
        visible={awaitVisible}
        onClose={() => setAwaitVisible(false)}
      />
      <View style={[DStyle.flexDColumn, { gap: 10 }]}>
        <View
          style={{
            height: "35%",
            alignSelf: "center",
          }}
        >
          <Image
            source={require("../assets/images/background.jpg")}
            style={{
              width: 120,
              height: 120,
              borderRadius: 100,
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            alignSelf: "center",
            paddingBottom: 20,
          }}
        >
          Login
        </Text>
        <TextInput
          style={style.commentFocused}
          value={info.username}
          placeholder="Username"
          onChangeText={(text) => fullfil("username", text)}
        />
        <TextInput
          style={style.commentFocused}
          value={info.password}
          placeholder="Password"
          onChangeText={(text) => fullfil("password", text)}
        />

        <Pressable
          style={{
            width: "100%",
            backgroundColor: !isEnable ? "purple" : "#9999",
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
          }}
          onPress={() => (!isEnable ? handleLogin() : null)}
        >
          <Text style={{ color: "white", fontSize: 20 }}>Login</Text>
        </Pressable>

        <Pressable
          style={{
            width: "100%",
            backgroundColor: "white",
            height: 50,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "blue",
            justifyContent: "center",
            borderRadius: 10,
          }}
          onPress={() => {
            router.push("/Register");
          }}
        >
          <Text style={{ color: "royalblue", fontSize: 20 }}>
            Creer un compte
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Login;

const style = StyleSheet.create({
  commentFocused: {
    height: 60,
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
});
