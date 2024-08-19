import { useEffect, useState } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import api from "../Api";
import { router } from "expo-router";
import lien from "../lien";
import { StoreValue } from "../components/fonction/fonction";
import AwaitScreen from "../components/awaitScreen";
export default function Register() {
  const [isEnable, setisEnable] = useState(false);
  const [awaitVisible, setAwaitVisible] = useState(false);

  const [info, setInfo] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const fullfil = (name, value) => {
    setInfo({ ...info, [name]: value });
  };
  useEffect(() => {
    setisEnable(
      info.username.trim() === "" ||
        info.email.trim() === "" ||
        info.password.trim() === "" ||
        info.confirmPassword.trim() === "" ||
        info.password !== info.confirmPassword
    );
  }, [info]);

  const createAccount = async () => {
    setAwaitVisible(true);
    try {
      const response = await api.post(lien + "/auth/register/", info);
      setInfo({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      if (response.status == 200) {
        try {
          await StoreValue("username", response.data.username);
          await StoreValue("accessToken", response.data.token);
          await StoreValue("userId", JSON.stringify(response.data.id));
          await StoreValue("username", response.data.username);
          await StoreValue("email", response.data.email);
          await StoreValue("avatar", response.data.avatar);
          await StoreValue("bio", response.data.bio ? response.data.bio : "");
          await StoreValue(
            "name",
            response.data.name ? response.data.name : ""
          );
          router.replace("/Home");
        } catch (error) {
          throw error;
        }
      } else alert("Votre email et votre nom d'utilisateur doit etre unique ");
    } catch (error) {
      console.log("Error : " + error);
    } finally {
      setAwaitVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          height: "20%",
          alignSelf: "center",
        }}
      >
        <AwaitScreen
          visible={awaitVisible}
          onClose={() => setAwaitVisible(false)}
        />
        <Image
          source={require("../assets/images/background.jpg")}
          style={{
            width: 120,
            height: 120,
            borderRadius: 100,
          }}
        />
      </View>
      <Text style={{ fontSize: 20, fontWeight: "condensed" }}>
        S'enregistrer
      </Text>
      <TextInput
        placeholder="Nom d'utilisateur"
        style={styles.commentInput}
        value={info.username}
        onChangeText={(text) => fullfil("username", text)}
      />

      <TextInput
        placeholder="Email"
        style={styles.commentInput}
        value={info.email}
        onChangeText={(text) => fullfil("email", text)}
      />
      <TextInput
        placeholder="Mot de passe"
        style={styles.commentInput}
        value={info.password}
        onChangeText={(text) => fullfil("password", text)}
      />
      <TextInput
        placeholder="Confirmer mot de passe"
        style={styles.commentInput}
        value={info.confirmPassword}
        onChangeText={(text) => fullfil("confirmPassword", text)}
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
        onPress={() => {
          !isEnable ? createAccount() : null;
        }}
      >
        <Text style={{ color: "white", fontSize: 20 }}>Creer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  commentInput: {
    height: 60,
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
});
