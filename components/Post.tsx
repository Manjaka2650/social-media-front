import Icon from "react-native-vector-icons/FontAwesome6";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { getValue, likeAction } from "./fonction/fonction";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import DStyle from "./style/style";
import { useNavigation } from "@react-navigation/native";
import { Link, router } from "expo-router";
import CommentScreen from "./error/CommentScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { socketLink } from "../lien";
import api from "../Api";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
const Post = ({
  postId,
  utilisateur,
  created,
  description,
  image,
  nombre_like,
  liked,
  saved,
  setmodalVisible,
  modalVisible,
}) => {
  const [nombre, setnombre_like] = useState(nombre_like);
  const [already, setAlready] = useState(liked);
  const [save, setSaved] = useState(saved);
  const [username, setUsername] = useState("");
  const [followedd, setFollowedd] = useState(utilisateur.followed);
  // const [modalVisible, setmodalVisible] = useState(true);
  // const [modifier, setModifier] = useState(false);

  const [textAboveLike, setTextAboveLike] = useState("personnes");

  const followAction = async (user) => {
    // settextSuivre("...");
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
      // alert("operation avec succes");
      setFollowedd(respone.data);
      // settextSuivre("Suivre +");
      // getData();
    }
  };

  useEffect(() => {
    if (already && nombre == 1) setTextAboveLike("Vous");
    else if (already && nombre > 1)
      setTextAboveLike(`Vous et ${nombre} personnes`);
    else if (!already && nombre < 1) setTextAboveLike("");
    else if (!already && nombre > 1)
      setTextAboveLike(`${nombre - 1} autres personnes`);
  }, [textAboveLike, nombre, nombre_like]);

  const formateDate = (date) => {
    var fd = new Date(date);
    return formatDistanceToNow(date, { locale: fr });
  };

  const getUser = async () => {
    const storedUsername = await AsyncStorage.getItem("username");
    setUsername(storedUsername);
  };

  const socket = useRef(null);

  useEffect(() => {
    getUser();
    socket.current = new WebSocket(
      `${socketLink}/notification/${utilisateur.username}`
    );
    socket.current.onopen = (event) => {
      console.log("Websocket connected post");
      console.log(`${socketLink}/notification/${utilisateur.username}`);
      console.log(username);
    };
    socket.current.onclose = (event) => {
      console.log("closed post");
    };

    socket.current.onmessage = (e) => {};

    return () => socket.current.close();
  }, [username]);

  const sendNotif = () => {
    socket.current.send(
      JSON.stringify({
        action: username + " a reagit a votre publication",
        sender: username,
        postId: postId,
      })
    );
  };

  const savePost = async () => {
    const token = await getValue("accessToken");
    const username = await getValue("username");

    const response = await api.post(
      "/save-post/" + username,
      { postId: postId },
      { headers: { Authorization: "Token " + token } }
    );
    if (response.status == 200) {
      setSaved(response.data.saved);
    }
  };
  const handleGesture = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      const { translationX, translationY } = event.nativeEvent;
      if (
        Math.abs(translationX) > Math.abs(translationY) &&
        translationX < -150
      )
        router.push("/Parameter");
    }
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={handleGesture}>
        <View style={style.postStyle}>
          {/* header */}
          <View style={DStyle.flexDColumn}>
            {/* date image nom */}
            <View
              style={[DStyle.flexDRow, { justifyContent: "space-between" }]}
            >
              {/* image et date+nom */}
              <View style={[DStyle.flexDRow]}>
                <View style={{ width: 40, height: 40, borderRadius: 100 }}>
                  <Pressable
                    onPress={() =>
                      router.push("/Profil/" + utilisateur.username)
                    }
                  >
                    <Image
                      source={{ uri: `${utilisateur.avatar}` }}
                      style={{ width: "100%", height: 40, borderRadius: 100 }}
                    />
                  </Pressable>
                </View>
                {/* username and date */}
                <Pressable
                  onPress={() => router.push("/Profil/" + utilisateur.username)}
                >
                  <View
                    style={[
                      DStyle.flexDColumn,
                      {
                        marginLeft: 4,
                      },
                    ]}
                  >
                    {/* Username */}
                    <View style={[DStyle.flexDRow]}>
                      <Text style={{ fontWeight: "bold" }}>
                        @{utilisateur.username}
                      </Text>
                      <Pressable
                        style={{ marginLeft: 10 }}
                        onPress={() => followAction(utilisateur.username)}
                      >
                        <Text style={{ color: "blue" }}>
                          {/* {"" + utilisateur.followed} */}
                          {!followedd ? "follow" : "unfollow"}
                        </Text>
                      </Pressable>
                    </View>
                    {/* date */}
                    <Text style={{ fontSize: 11 }}>
                      il y a {formateDate(created)}
                    </Text>
                  </View>
                </Pressable>
              </View>

              {/* Trois points */}
              <Pressable
                style={{ top: -20 }}
                onPress={() => setmodalVisible(postId)}
              >
                <Text style={{ fontSize: 30, fontWeight: "bold" }}>...</Text>
              </Pressable>

              {/* Suggestion Modal */}
              {/* Afficher le modal si l'ID du post correspond */}
            </View>
            {/* legende */}
            <View>
              <Text>{description}</Text>
            </View>
          </View>

          {/* image */}
          <View style={style.conteneurImage}>
            <Image
              source={{ uri: `${image}` }}
              style={{ width: "100%", height: 250 }}
            />
          </View>
          {/* footer */}
          <View style={style.conteneurFooter}>
            <Text style={style.textnombreLike}>
              {already && nombre == 1
                ? "Vous"
                : already && nombre > 1
                ? `Vous et ${nombre - 1} autre personne`
                : !already && nombre >= 1
                ? `${nombre} personnes `
                : ``}
            </Text>
            {/* comment section */}
            <View
              style={[DStyle.flexDRow, { justifyContent: "space-between" }]}
            >
              {/* like */}
              <Pressable
                onLongPress={() => {
                  alert("Hello");
                }}
                onPress={() => {
                  likeAction(setnombre_like, setAlready, postId);
                  already ? sendNotif() : null;
                }}
              >
                <Text>
                  <Icon name="heart" solid={already} size={26} color="#000" />
                </Text>
              </Pressable>
              {/* comment */}
              <Pressable
                onPress={() => {
                  router.push(
                    "/Commentaire/" +
                      postId +
                      "?username=" +
                      utilisateur.username +
                      "?description=" +
                      description
                  );
                }}
              >
                <Text>
                  <Icon name="comment" size={26} color="#000" />
                </Text>
              </Pressable>
              {/* save */}
              <Pressable onPress={savePost}>
                <Text>
                  <Icon name="bookmark" size={26} solid={save} color="#000" />
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default Post;

const style = StyleSheet.create({
  postStyle: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    width: "100%",
    padding: 4,
    backgroundColor: "white",
  },
  conteneurImage: { padding: 2 },
  conteneurFooter: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 12,
    width: "100%",
  },
  textnombreLike: { fontWeight: "bold" },
  imageStyle: { width: "100%", borderRadius: 5, height: 100 },

  suggestionContainer: {
    position: "absolute",
    right: 0, // Positionne le modal à gauche
    top: 0, // Ajuste la hauteur pour qu'il apparaisse sous les trois points
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
});
