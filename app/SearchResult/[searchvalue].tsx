import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import api from "../../Api";
import { getValue } from "../../components/fonction/fonction";
import DStyle from "../../components/style/style";
import Icon from "react-native-vector-icons/FontAwesome6";
import Post from "../../components/Post";
import { Suggestion } from "../Home";
import { Amis } from "../Recherche";

export default function SearchResult() {
  const { searchvalue } = useLocalSearchParams();
  const [dataUser, setDataUser] = useState([]);
  const [dataPost, setDataPost] = useState([]);
  const [modalVisible, setmodalVisible] = useState(null); //
  const [username, setusername] = useState("");
  const getValueData = async () => {
    try {
      const us = await getValue("username");
      setusername(us);
      const token = await getValue("accessToken");
      const respone = await api.get("/search/" + searchvalue, {
        headers: { Authorization: "Token " + token },
      });
      if (respone.status == 200) {
        setDataPost(respone.data.dataPost);
        setDataUser(respone.data.dataUser);
      }
    } catch (error) {}
  };
  const [textSuivre, settextSuivre] = useState("Suivre +");

  const followAction = async (user) => {
    settextSuivre("...");
    const token = await getValue("accessToken");

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
      // alert("Envoye avec succes");
      settextSuivre("Suivre +");
      //   getValueData();
    }
  };

  useEffect(() => {
    getValueData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* header */}
      <View
        style={[
          DStyle.flexDRow,
          {
            justifyContent: "space-between",
            margin: 12,
            borderBottomWidth: 1,
            paddingBottom: 17,
            paddingTop: 30,
          },
        ]}
      >
        <Pressable onPress={() => router.back()}>
          <View style={[DStyle.flexDRow, {}]}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                marginRight: 12,
              }}
            >
              <Icon name="arrow-left" size={20} />
            </Text>
            <Text style={{ fontWeight: "bold" }}>Resultat de recherche</Text>
          </View>
        </Pressable>
      </View>

      <Pressable onPress={() => router.back()}>
        <Text style={{ alignSelf: "center" }}>{searchvalue}</Text>
      </Pressable>
      <View>
        {/* user */}

        <ScrollView>
          <View>
            <Text style={{ fontWeight: "bold" }}>Utilisateur</Text>
          </View>
          {dataUser &&
            dataUser.map((value, index) => (
              <View key={index}>
                <Amis
                  username={username}
                  followed={value.followed}
                  textSuivre={textSuivre}
                  name={value.name}
                  image={`${value.avatar}`}
                  user={value.username}
                  followAction={followAction}
                />
              </View>
            ))}
          {/* post */}

          <Text style={{ fontWeight: "bold" }}>Posts</Text>

          {dataPost &&
            dataPost.map((value) => (
              <View key={value.id} style={style.item}>
                <Post
                  saved={value.saved}
                  postId={value.id}
                  utilisateur={value.utilisateur}
                  created={value.created}
                  description={value.description}
                  image={value.image}
                  nombre_like={value.nombre_like}
                  liked={value.liked}
                  modalVisible={modalVisible}
                  setmodalVisible={setmodalVisible}
                />
                {modalVisible === value.id && (
                  <Suggestion
                    image={value.image}
                    postId={value.id}
                    setClose={() => setmodalVisible(false)}
                    setModifier={() => setmodalVisible(false)}
                    userconnected={username == value.utilisateur.username}
                    visible={modalVisible === value.id}
                  />
                )}
              </View>
            ))}
        </ScrollView>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  suggestionContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    height: "auto",
    gap: 20,
  },
  overlay: {
    position: "absolute",
    // backgroundColor: "rgba(0,0,0,0.4)",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  scrollStyle: {
    gap: 10,
    backgroundColor: "whitesmoke",
  },
  bellow_image: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    width: "100%",
  },
  image: {
    width: "100%",
    height: 180,
    borderBlockColor: "black",
    borderRadius: 4,
  },
  item: {
    borderColor: "black",
    shadowColor: "black",
    borderRadius: 10,
    backgroundColor: "white",
    margin: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 5,
  },
  commentaire: {
    width: "auto",
    borderBlockColor: "black",
    borderColor: "black",
    borderWidth: 1,
    display: "flex",
  },
  likebtn: {},
  textnombreLike: { fontWeight: "bold" },
  publicationTop: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
});
