import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome6";
import { getValue } from "../components/fonction/fonction";
import Post from "../components/Post";
import DStyle from "../components/style/style";
import { Link } from "expo-router";
import api from "../Api";
import { Suggestion } from "./Home";
// import { useFocusEffect } from "expo-router";

export default function SavedPost() {
  const [data, setData] = useState([]);
  const [modalVisible, setmodalVisible] = useState(null); //
  const getData = async () => {
    const username = await getValue("username");
    const token = await getValue("accessToken");

    // alert(token);
    try {
      const response = await api.get("/saved-post/" + username, {
        headers: {
          Authorization: "Token " + token,
        },
      });
      if (response.status === 200) {
        setData(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <View
        style={[
          DStyle.flexDRow,
          {
            justifyContent: "space-between",
            margin: 12,
            marginTop: 40,
            marginBottom: 30,
          },
        ]}
      >
        <Link href={"/Home"}>
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
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              Your saved post
            </Text>
          </View>
        </Link>
      </View>
      <ScrollView style={style.scrollStyle}>
        {data &&
          data.map((value, index) => (
            <View key={index} style={style.item}>
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
            </View>
          ))}
        {modalVisible === data.id && (
          <Suggestion
            image={value.image}
            postId={value.id}
            setClose={() => setmodalVisible(false)}
            setModifier={() => setmodalVisible(false)}
            userconnected={username == value.utilisateur.username}
            visible={modalVisible === value.id}
          />
        )}
      </ScrollView>
    </>
  );
}

const style = StyleSheet.create({
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
