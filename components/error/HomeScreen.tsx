import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import lien from "../../lien";
import { useFocusEffect } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/FontAwesome6";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Post from "../Post";

const api = axios.create({
  baseURL: lien,
  timeout: 10000,
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error) {
      console.log(error);
    }
  }
);

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [postId, setpostId] = useState(0);

  const getData = async () => {
    try {
      const response = await api.get("/posts");
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const likeAction = async (postId) => {
    try {
      const response = await api.post("/likeAction/" + postId, {});
      if (response.data) {
        setData((prevData) =>
          prevData.map((post) =>
            post.id === postId ? { ...post, nombre_like: response.data } : post
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const formateDate = (date) => {
  //   var fd = new Date(date);
  //   return formatDistanceToNow(date, { locale: fr });
  // };
  return (
    <ScrollView style={style.scrollStyle}>
      {data &&
        data.map((value) => (
          // <View key={value.id} style={style.item}>
          //   <View style={style.publicationTop}>
          //     {/* <Image /> */}
          //     <View
          //       style={{
          //         width: 30,
          //         height: 30,
          //         borderWidth: 1,
          //         borderRadius: 100,
          //       }}
          //     ></View>
          //     <View style={{ display: "flex", flexDirection: "column" }}>
          //       <Text>@Manjaka </Text>
          //       <View>
          //         <Text>il y a {formateDate(value.created)}</Text>
          //       </View>
          //     </View>
          //   </View>
          //   <Text>{value.description}</Text>
          //   <Image
          //     source={{ uri: `${lien}${value.image}` }}
          //     style={style.image}
          //   ></Image>
          //   <Text style={style.textnombreLike}>
          //     {value.nombre_like} persones
          //   </Text>

          //   {/* conteneur de tout en dessous de l'iamage */}
          //   <View style={style.bellow_image}>
          //     {/* like */}
          //     <Pressable
          //       style={style.likebtn}
          //       onPress={() => {
          //         setpostId(value.id);
          //         likeAction(value.id);
          //       }}
          //     >
          //       <Text>
          //         <Icon name="heart" size={26} color="#000" />
          //       </Text>
          //     </Pressable>
          //     {/* commentaire */}
          //     <Pressable
          //       style={style.likebtn}
          //       onPress={() =>
          //         navigation.navigate("Posts", { postId: value.id })
          //       }
          //     >
          //       <Text>
          //         <Icon name="comment" size={26} color="#000" />
          //       </Text>
          //     </Pressable>

          //     {/* sauvegarde */}

          //     <Pressable
          //       style={style.likebtn}
          //       onPress={() => {
          //         setpostId(value.id);
          //         likeAction(value.id);
          //       }}
          //     >
          //       <Text>
          //         <Icon name="bookmark" size={26} color="#000" />
          //       </Text>
          //     </Pressable>
          //   </View>
          // </View>
          <View key={value.id} style={style.item}>
            <Post
              postId={value.id}
              utilisateur={value.utilisateur.username}
              description={value.description}
              image={value.image}
              nombre_like={value.nombre_like}
              created={""}
              liked={""}
              key={1}
            />
          </View>
        ))}
    </ScrollView>
  );
};

export default HomeScreen;
const style = StyleSheet.create({
  scrollStyle: {
    gap: 10,
    //  backgroundColor: "#9370DB"
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
