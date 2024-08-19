import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import api from "../Api";
import { getValue } from "../components/fonction/fonction";
import Post from "../components/Post";
import DStyle from "../components/style/style";
import Icon from "react-native-vector-icons/FontAwesome6";
import Comment from "../components/Comment";
import { Suggestion } from "./Home";

export default function PostScreen() {
  const { postId } = useLocalSearchParams();

  const [data, setData] = useState({
    postId: postId,
    utilisateur: {
      username: "manjaka",
      email: "manjaka@mail.com",
    },
    created: "2024-07-21T16:00:54.264577Z",
    description: "Hehe",
    image: "/media/default.png",
    nombre_like: 2,
    liked: true,
  });

  const [modalVisible, setmodalVisible] = useState(null); //

  const getpost = async () => {
    // alert(postId);
    try {
      const token = await getValue("accessToken");
      const response = await api.get("/post/" + postId, {
        headers: { Authorization: "Token " + token },
      });
      if (response.status == 200) {
        console.log(response.data[0].created);

        console.log(response.data[0].utilisateur);
        setData({
          ...data,
          postId: postId,
          created: response.data[0].created,
          description: response.data[0].description,
          image: response.data[0].image,
          liked: response.data[0].liked,
          nombre_like: response.data[0].nombre_like,
          utilisateur: response.data[0].utilisateur,
        });
        console.log(data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getpost();
  }, [data]);
  return (
    <View style={{ marginTop: 20 }}>
      <View
        style={[
          DStyle.flexDRow,
          {
            justifyContent: "space-between",
            margin: 12,
            borderBottomWidth: 1,
            paddingBottom: 17,
          },
        ]}
      >
        <Link href={"/Notification"}>
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
            <Text style={{ fontWeight: "bold" }}>Votre publication</Text>
          </View>
        </Link>
      </View>

      {data && (
        <Post
          saved={data.saved}
          postId={data.postId}
          utilisateur={data.utilisateur}
          created={data.created}
          description={data.description}
          image={data.image}
          nombre_like={data.nombre_like}
          liked={data.liked}
          modalVisible={modalVisible}
          setmodalVisible={setmodalVisible}
        />
      )}
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
    </View>
  );
}

const CommentModal = () => {
  return (
    <Moda style={{ zIndex: 1000, backgroundColor: "rgba(0,0,0,0.4)" }}>
      <Comment />
    </Moda>
  );
};

const styles = StyleSheet.create({});
