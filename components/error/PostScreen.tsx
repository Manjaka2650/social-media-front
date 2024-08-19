import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import lien from "../../lien";
import {
  commented,
  getComment,
  getPost,
  likeAction,
} from "../fonction/fonction";
import Icon from "react-native-vector-icons/FontAwesome6";

import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Post from "../Post";
import DStyle from "../style/style";

const PostScreen = ({ route }) => {
  const { postId, username, avatar, created, description, image, nombre_like } =
    route.params;
  const [commentaire, setCommentaire] = useState([]);
  const [textComment, setTextComment] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    getComment(setCommentaire, postId);
  }, [postId]);

  useEffect(() => {
    setIsButtonDisabled(textComment.trim() === "");
  }, [textComment]);
  const formateDate = (date) => {
    var fd = new Date(date);
    return formatDistanceToNow(date, { locale: fr });
  };
  return (
    <>
      <ScrollView style={styles.scrolview}>
        <View key={postId} style={DStyle.flexDColumn}>
          {/* <Post
            postId={postId}
      utilisateu
            created={created}
            description={description}
            image={image}
            nombre_like={nombre_like}
          /> */}
        </View>
      </ScrollView>
      {/* commentaire */}
      <ScrollView>
        <View style={styles.commentConteneur}>
          {commentaire &&
            commentaire.map((valeur) => (
              <View key={valeur.id} style={DStyle.flexDRow}>
                {/* <Image /> */}
                <View style={{ width: 40, height: 40, borderRadius: 100 }}>
                  <Image
                    source={{ uri: `${lien}${valeur.utilisateur.avatar}` }}
                    style={{ width: "100%", height: 40, borderRadius: 100 }}
                  />
                </View>
                <View style={DStyle.flexDColumn}>
                  <View style={styles.commentValue}>
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      {valeur.utilisateur.username}
                    </Text>
                    <Text>{valeur.contenue}</Text>
                    {/* date */}
                  </View>
                  <Text>{formateDate("")}</Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
      <View style={styles.comment_section}>
        <TextInput
          placeholder="Commentaire"
          style={styles.commentFocused}
          value={textComment}
          onChangeText={(e) => setTextComment(e)}
          autoFocus={true}
          multiline={true}
        />
        <View style={styles.commentButton}>
          <Pressable
            style={{}}
            onPress={
              !isButtonDisabled
                ? () =>
                    commented(
                      setTextComment,
                      setCommentaire,
                      textComment,
                      getComment,
                      postId
                    )
                : null
            }
          >
            <Text>
              <Icon
                name="paper-plane"
                size={26}
                color={isButtonDisabled ? "white" : "#000"}
              />
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  image: { width: "100%", height: 400, borderRadius: 4 },
  barre_commentaire: { width: "80%", height: 15 },
  comment_section: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingBottom: 7,
    paddingTop: 5,
  },

  commentFocused: {
    flex: 1,
    height: 37,
    marginLeft: 10,
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft: 8,
  },
  commentButton: {
    width: 40,
    height: 40,
    borderBlockColor: "black",
    padding: 3,
  },
  scrolview: {
    padding: 2,
    paddingTop: 10,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  commentValue: {
    width: "auto",
    maxWidth: "80%",
    height: "auto",
    margin: 15,
    borderRadius: 10,
    backgroundColor: "gray",
    minHeight: 40,
    minWidth: "50%",
    padding: 10,
  },
  commentConteneur: {
    width: "100%",
  },
  publicationTop: {
    width: "100%",
    display: "flex",
    paddingTop: 10,
    marginLeft: 10,
    flexDirection: "row",
  },
  bellow_image: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    width: "100%",
  },
  textnombreLike: { fontWeight: "bold" },
  postStyle: {
    backgroundColor: "white",
    borderRadius: 10,
  },
});
