import {
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAllRequest, getValue } from "../components/fonction/fonction";
import api from "../Api";
import Header from "../components/Header";
import Nav from "../components/Navigation";

export default function Request() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllRequest(setData);
  }, [data]);

  const [txts, settextSuivre] = useState("Suivre en retour");

  const followAction = async (user) => {
    settextSuivre("...");
    const token = await getValue("accessToken");
    const username = await getValue("username");
    const respone = await api.post(
      "/follow-action-friend/" + username,
      { user: user },
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );
    if (respone.status == 200) {
      settextSuivre("Suivre +");
      getAllRequest();
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollStyle1}>
        {data &&
          data.map((value) => (
            <View key={value.id} style={styles.boxmessage1}>
              <Invit
                reqid={value.id}
                user={value.username}
                notif={"Vous a suivi  "}
                image={`${value.avatar}`}
                heure={value.heure}
                textee={txts}
                followAction={followAction}
              />
            </View>
          ))}
      </ScrollView>
      <Nav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
  },
  scrollStyle1: {
    flex: 1,
    gap: 10,
    backgroundColor: "whitesmoke",
  },
  boxmessage1: {
    backgroundColor: "white",
    borderRadius: 10,
    flex: 1,
    marginTop: 7,
    marginLeft: 7,
    marginRight: 7,
  },
  boxmessage: {
    backgroundColor: "white",
    borderRadius: 10,
    flex: 1,
    margin: 15,
    display: "flex",
    flexDirection: "row",
    height: 80,
  },
  boldtext: {
    fontWeight: "bold",
  },
  nav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});

const Invit = ({ user, notif, image, heure, followAction, textee, reqid }) => {
  return (
    <View style={styles.boxmessage}>
      <View>
        <Image
          source={{ uri: image }}
          style={{ width: 60, height: 60, borderRadius: 100 }}
        />
      </View>
      <View style={{ marginLeft: 15, flex: 1 }}>
        <Text style={styles.boldtext}>{user}</Text>
        <Text>{notif}</Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            style={{
              borderRadius: 5,
              backgroundColor: "#B3A1C4",
              height: 40,
              width: 150,
              justifyContent: "center",
              padding: 10,
            }}
            onPress={() => followAction(user)}
          >
            <Text style={{ textAlign: "center" }}>{textee}</Text>
          </Pressable>
        </View>
        <Text style={{ marginLeft: 220 }}>{heure}</Text>
      </View>
    </View>
  );
};
