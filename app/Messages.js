import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Icon from "react-native-vector-icons/FontAwesome6";
import { Link, router } from "expo-router";
import DStyle from "../components/style/style";
import api from "../Api";
import {
  getAllMessages,
  getAllNotification,
  getValue,
} from "../components/fonction/fonction";
import lien from "../lien";
import Navigation from "../components/Navigation";
import { format } from "date-fns";

const Messages = () => {
  const [username, setUsername] = useState("");
  const [usermessaged, setUserMessaged] = useState([]);
  const [messageLoading, setMesageLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllMessages(setData, setUserMessaged, setMesageLoading);
  }, [data]);

  return (
    <View style={styles.container}>
      {/* Si tu as besoin d'inclure un header, décommente cette ligne */}
      {/* <Header /> */}

      {messageLoading && (
        <View>
          <ActivityIndicator size={"large"} color={"black"} />
        </View>
      )}

      {/* Connected user messages */}
      {/* <ScrollView
        style={[
          styles.scrollStyle,
          {
            height: 110,
            padding: 10,
            overflow: "hidden",
            backgroundColor: "black",
          },
        ]}
        horizontal={true}
      >
        {usermessaged &&
          usermessaged.map((value) => (
            <View key={value.id}>
              <Connecter
                image={`${lien}${value.other_user.avatar}`}
                user={value.other_user.username}
                room_name={value.room_name}
                other_user={value.other_user}
              />
            </View>
          ))}
      </ScrollView> */}

      <ScrollView style={styles.scrollStyle1}>
        {data &&
          data.map((value) => (
            <View key={value.id} style={styles.boxmessage1}>
              <Mess
                user={value.other_user.username}
                message={value.last_message}
                image={`${lien}${value.other_user.avatar}`}
                username={username}
                room_name={value.room_name}
                other_user={value.other_user}
              />
            </View>
          ))}
      </ScrollView>

      {/* Barre de navigation fixe en bas */}
      <Navigation style={styles.nav} />
    </View>
  );
};

export default Messages;

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
  scrollStyle: {
    gap: 10,
    backgroundColor: "white",
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

const Mess = ({ user, message, image, username, room_name, other_user }) => {
  return (
    <Pressable
      onPress={async () => {
        router.push(
          "SingleMessage/" + room_name + "?other_user=" + other_user.username
        );
      }}
    >
      <View style={styles.boxmessage}>
        <View>
          <Image
            source={{ uri: image }}
            style={{ width: 50, height: 50, borderRadius: 100 }}
          />
        </View>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.boldtext}>{user}</Text>
          {message ? (
            user !== message.sender.username ? (
              <View style={[DStyle.flexDRow]}>
                <Text>
                  Vous : {message.content.slice(0, 24).split("\n")[0]}...
                </Text>
              </View>
            ) : (
              <Text style={{ fontWeight: message.is_read ? "" : "bold" }}>
                {user} : {message.content.slice(0, 24).split("\n")[0]}...
              </Text>
            )
          ) : (
            <Text>Pas encore de message</Text>
          )}
          {message && (
            <Text style={{ alignSelf: "flex-end", fontSize: 12 }}>
              {format(new Date(message.timestamp), "hh:mm a")}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const Connecter = ({ user, image, room_name, other_user }) => {
  return (
    <View style={[DStyle.flexDColumn, { alignItems: "center" }]}>
      <Pressable
        style={{
          margin: 5,
          borderWidth: 4,
          borderRadius: 100,
          borderColor: "#9370DB",
        }}
        onPress={() =>
          router.replace(
            "SingleMessage/" + room_name + "?other_user=" + other_user.username
          )
        }
      >
        <Image
          source={{ uri: image }}
          style={{ width: 50, height: 50, borderRadius: 100 }}
        />
      </Pressable>
      <Text>{user}</Text>
    </View>
  );
};
