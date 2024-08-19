import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import Icon from "react-native-vector-icons/FontAwesome5";
import DStyle from "../components/style/style";
import { router } from "expo-router";
import api from "../Api";
import { getValue } from "../components/fonction/fonction";
import lien from "../lien";

export default function Recherche() {
  // const [data, setData] = useState([]);
  // const [username, setusername] = useState("");
  const [searchValue, setsearchValue] = useState("");

  // const [searchconnected, setsearchconnected] = useState(false);

  // const getData = async () => {
  //   const usernam = await getValue("username");
  //   const token = await getValue("accessToken");
  //   setusername(usernam);
  //   const response = await api.get("/non-followed-user/" + usernam, {
  //     headers: { Authorization: "Token " + token },
  //   });
  //   if (response.status == 200) {
  //     setData(response.data);
  //   }
  // };
  // useEffect(() => {
  //   getData();
  // }, []);
  // const [textSuivre, settextSuivre] = useState("Suivre +");

  // const followAction = async (user) => {
  //   settextSuivre("...");
  //   const token = await getValue("accessToken");

  //   const respone = await api.post(
  //     "/follow-action-friend/" + username,
  //     { user: user },
  //     {
  //       headers: {
  //         Authorization: "Token " + token,
  //       },
  //     }
  //   );
  //   if (respone.status == 200) {
  //     // alert("Envoye avec succes");
  //     settextSuivre("Suivre +");
  //     getData();
  //   }
  // };

  return (
    <View style={{ marginTop: 40 }}>
      {/* header */}
      <View
        style={[
          DStyle.flexDRow,
          {
            margin: 10,
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            <Icon name="arrow-left" size={20} />
          </Text>
        </Pressable>
        <TextInput
          style={{ padding: 10, height: 40, width: "65%" }}
          placeholder="Rechercher ..."
          value={searchValue}
          onChangeText={setsearchValue}
          autoFocus
        />
        <Pressable onPress={() => router.push("/SearchResult/" + searchValue)}>
          <View style={[DStyle.flexDRow, { gap: 12, alignItems: "center" }]}>
            <Icon name="search" size={24} color="black" />
          </View>
        </Pressable>
      </View>

      {/* <View>
        <ScrollView>
          {data &&
            data.map((value, index) => (
              <View key={index}>
                <Amis
                  followed={value.followed}
                  textSuivre={textSuivre}
                  name={value.name}
                  image={`${value.avatar}`}
                  user={value.username}
                  username={username}
                  followAction={followAction}
                />
              </View>
            ))}
        </ScrollView>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollStyle1: {
    gap: 10,
    backgroundColor: "#B3A1C4",
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
    margin: 5,
    display: "flex",
    flexDirection: "row",
    height: 100,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  boldtext: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
export const Amis = ({
  user,
  image,
  followAction,
  username,
  name,
  textSuivre,
  followed,
}) => {
  return (
    <View style={styles.boxmessage}>
      <View>
        <Pressable onPress={() => router.replace("/Profil/" + user)}>
          <Image
            source={{ uri: image }}
            style={{ width: 70, height: 70, borderRadius: 100 }}
          />
        </Pressable>
      </View>
      <View style={{ marginLeft: 15, flex: 1 }}>
        <Pressable onPress={() => router.replace("/Profil/" + user)}>
          <View style={[DStyle.flexDRow, { alignItems: "center" }]}>
            <Text>@</Text>
            <Text style={styles.boldtext}>{user}</Text>
          </View>
        </Pressable>
        {name && (
          <View>
            <Text>nom:{name}</Text>
          </View>
        )}
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
            onPress={() =>
              username != user
                ? followAction(user)
                : router.push("/Profil/" + username)
            }
          >
            {username == user ? (
              <Text>Voir votre profil</Text>
            ) : (
              <Text style={{ textAlign: "center" }}>
                {!followed ? textSuivre : "unfollow"}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};
