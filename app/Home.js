import Header from "../components/Header";
import Nav from "../components/Navigation";
import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome6";

import Post from "../components/Post";
import api from "../Api";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import moment from "moment";
import { getValue } from "../components/fonction/fonction";
import DStyle from "../components/style/style";

import * as FileSystem from "expo-file-system";
import lien from "../lien";
import HeaderGlimer from "../components/HeaderGlimer";
import Navigation from "../components/Navigation";
// import { PanGestureHandlerEventPayload } from "react-native-screens/lib/typescript/native-stack/types";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { router } from "expo-router";
export default function HomeScreen() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState([]);
  // const [isLoading, setisLoading] = useState(true);
  const getData = async () => {
    const token = await getValue("accessToken");
    // alert(token);
    try {
      const response = await api.get("/posts/", {
        headers: {
          Authorization: "Token " + token,
        },
      });
      if (response.status === 200) {
        setData(response.data);
        // setisLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // useFocusEffect(
  //   useCallback(() => {
  //   }, [])
  // );
  useEffect(() => {
    getData();
  }, []);

  const r = async () => {
    const u = await getValue("username");
    setUsername(u);
  };
  const [modalVisible, setmodalVisible] = useState(null); //

  useEffect(() => {
    r();
  }, []);
  // if (isLoading) return <Text>Loading ...</Text>;

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Header />
      </View>
      <ScrollView style={style.scrollStyle}>
        {data &&
          data.map((value) => (
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
      <Nav />
    </View>
  );
}

export const Suggestion = ({
  postId,
  setClose,
  visible,
  setModifier,
  userconnected,
  image,
}) => {
  const confirm = () => {
    Alert.alert(
      "Alert",
      "Etes vous sur de vouloir supprimer?",
      [
        {
          text: "Non",
          onPress: () => {},
          style: "cancel",
        },

        { text: "ok", onPress: () => deleteAction() },
      ],
      { cancelable: true }
    );
  };
  const deleteAction = async () => {
    const respone = await api.post("/delete-post/" + postId);
    if (respone.status == 200) {
      alert("Suppression avec succes");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={setClose}>
      <View style={style.overlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={[DStyle.flexDColumn, style.suggestionContainer]}>
            {/* {userconnected && (
              <Pressable onPress={() => {}}>
                <View>
                  <Text>
                    <Icon name="pencil" size={20} color="black" />
                    modifier
                  </Text>
                </View>
              </Pressable>
            )} */}

            <Pressable onPress={() => {}}>
              <View>
                <Text>
                  <Icon name="save" size={20} color="black" />
                  enregistrer
                </Text>
              </View>
            </Pressable>
            {userconnected && (
              <Pressable onPress={confirm}>
                <View>
                  <Text>
                    <Icon name="trash" size={20} color="black" />
                    Supprimer
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

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
