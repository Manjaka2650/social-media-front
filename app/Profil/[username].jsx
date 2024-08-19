import {
  Button,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome6";
import { Link, router, useLocalSearchParams } from "expo-router";
import DStyle from "../../components/style/style";
import {
  StoreValue,
  disconnect,
  getValue,
} from "../../components/fonction/fonction";
import api from "../../Api";
import * as ImagePicker from "expo-image-picker";
import lien from "../../lien";
import Post from "../../components/Post";
import PhotoView from "../../components/PhotoView";
// import AwaitScreen from "../../components/awaitScreen";

export default function Profil() {
  const { username } = useLocalSearchParams();
  const [photo, setPhoto] = useState(null);
  const [picView, setPicView] = useState(false);
  const [pView, setPView] = useState(null);

  const [yes, setyes] = useState(false);
  const [userInfo, setUserInfo] = useState({
    avatar: "",
    username: "",
    email: "",
    name: "",
    bio: "",
    follower: 0,
    following: 0,
    nombre_post: 0,
  });

  const [bio, setBio] = useState("");
  const [data, setData] = useState([]);
  const [is, setIs] = useState(false);
  const getUserInfo = async () => {
    const us = await getValue("username");

    const token = await getValue("accessToken");
    const response = await api.get("/profileUser/" + username, {
      headers: {
        Authorization: "Token " + token,
      },
    });
    if (response.status == 200) {
      setUserInfo({
        avatar: response.data.user.avatar,
        username: response.data.user.username,
        email: response.data.user.email,
        name: response.data.user.name,
        bio: response.data.user.bio,
        follower: response.data.follower,
        following: response.data.following,
        nombre_post: response.data.nombrePost,
      });
      setIs(response.data.isTheConnected);
    }
  };
  const getUserPost = async () => {
    const token = await getValue("accessToken");

    const response = await api.get("/postUser/" + username, {
      headers: {
        Authorization: "Token " + token,
      },
    });
    if (response.status == 200) {
      setData(response.data);
    }
  };

  useEffect(() => {
    getUserInfo();
    getUserPost();
  }, []);

  // change pofile picture

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
      setyes(true);

      // console.log(result.assets[0].uri);
    }
  };

  const confirm = () => {
    Alert.alert(
      "Deconnexion",
      "Etes vous sur de vouloir vous deconneceter?",
      [
        {
          text: "Non",
          onPress: () => {},
          style: "cancel",
        },

        { text: "ok", onPress: () => disconnect() },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[DStyle.flexDColumn, { flex: 1 }]}>
      {/* entete */}
      {/* {loading && <AwaitScreen />} */}

      <View
        style={[
          DStyle.flexDRow,
          {
            justifyContent: "space-between",
            margin: 12,
            borderBottomWidth: 1,
            paddingBottom: 17,
            marginTop: 40,
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
            <Text style={{ fontWeight: "bold" }}>Profil d'utilisateur</Text>
          </View>
        </Pressable>
      </View>

      <ScrollView>
        {/* header */}
        <View
          style={[
            DStyle.flexDColumn,
            {
              borderBottomWidth: 1,

              alignContent: "center",
              alignItems: "center",
            },
          ]}
        >
          {/* image et autre */}

          <View style={{ padding: 6 }}>
            {/* avatar */}
            <View>
              <Pressable
                onPress={() => {
                  is ? pickImageAsync() : () => {};
                }}
              >
                <Image
                  source={{ uri: `${lien}${userInfo.avatar}` }}
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 100,
                    borderWidth: 5,
                    borderColor: "white",
                  }}
                />
              </Pressable>
            </View>
            {/* username */}
            <View style={{ marginTop: 10, marginLeft: 18 }}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                @{userInfo.username}
              </Text>
            </View>
            {/* Bio */}

            <View
              style={[
                DStyle.flexDRow,
                { gap: 20, marginLeft: 19, marginTop: 16 },
              ]}
            >
              <View>
                <Text>{userInfo.follower} Follower(s)</Text>
              </View>
              <View>
                <Text>{userInfo.following} Following(s)</Text>
              </View>
              <View>
                <Text>{userInfo.nombre_post} Post(s)</Text>
              </View>
            </View>
          </View>

          {/* amis post */}
        </View>

        {/* Posts */}
        <View
          style={[
            DStyle.flexDColumn,
            { backgroundColor: "#f0f0f0", gap: 10, padding: 10 },
          ]}
        >
          <Text style={{ marginTop: 10 }}>Tous les photos</Text>
          <ScrollView horizontal>
            {data &&
              data.map((value) => (
                <View key={value.id} style={style.item}>
                  <Pressable
                    onPress={() => {
                      setPView(value.image);
                      setPicView(true);
                    }}
                  >
                    <Image
                      source={{ uri: `${value.image}` }}
                      style={{ width: 140, height: 140, borderRadius: 12 }}
                    />
                  </Pressable>
                </View>
              ))}
          </ScrollView>

          <Text style={{ fontSize: 18 }}>Tout les posts</Text>

          {data &&
            data.map((value) => (
              <View key={value.id} style={style.item}>
                <Post
                  postId={value.id}
                  utilisateur={value.utilisateur}
                  created={value.created}
                  description={value.description}
                  image={value.image}
                  nombre_like={value.nombre_like}
                  liked={value.liked}
                />
              </View>
            ))}
        </View>
      </ScrollView>
      {yes && (
        <PhotoConfirmationChange
          photo={photo}
          username={username}
          setUserInfo={setUserInfo}
          onPress={() => setyes(false)}
        />
      )}
      {/* {picView && <PhotoView image={pView} onClose={() => setPView(false)} />} */}
    </View>
  );
}

const style = StyleSheet.create({
  item: {
    borderColor: "black",
    shadowColor: "black",
    borderRadius: 10,
    backgroundColor: "white",
    margin: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 5,
  },
});

const PhotoConfirmationChange = ({ photo, username, onPress, setUserInfo }) => {
  const saveChange = async () => {
    try {
      const token = await getValue("accessToken");
      const formData = new FormData();
      // console.log(photo);
      if (photo != null) {
        formData.append("image", {
          uri: photo,
          type: "image/jpeg",
          name: "image.jpeg",
        });
      } else {
        alert("Photo null");
      }

      const response = await api.post(
        "/change-profile-image/" + username,
        formData,
        {
          headers: {
            Authorization: "Token " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        // Handle successo
        onPress();
        setUserInfo((prevData) => ({
          ...prevData,
          avatar: response.data.avatar,
        }));

        await StoreValue("avatar", response.data.avatar);

        console.log("Pic changed successfully");
      }
    } catch (error) {
      console.error("erreur :", error);
    } finally {
      // setLoading(false);
      // setPhoto(null);
    }
  };
  return (
    <Modal
      onRequestClose={onPress}
      // transparent={true}
      style={{ height: "100%", width: "100%" }}
    >
      <View
        style={{
          backgroundColor: "white",
          marginTop: "50%",
          height: "100%",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <View>
          <Text>Sauvegarder le changement?</Text>
        </View>
        <Image
          source={{ uri: photo }}
          width={100}
          height={100}
          style={{ borderRadius: 100 }}
        />
        <Button title="Sauvegarder" onPress={saveChange} />
      </View>
    </Modal>
  );
};
