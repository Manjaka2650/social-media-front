import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  View,
  Animated,
  PanResponder,
  ScrollView,
  Image,
} from "react-native";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome6";
import {
  commented,
  getComment,
  getValue,
} from "../../components/fonction/fonction";
import DStyle from "../../components/style/style";
import lien, { socketLink } from "../../lien";
import { router, useLocalSearchParams } from "expo-router";

const CommentScreen = () => {
  const { postId, username, description } = useLocalSearchParams();
  const [photo, setPhoto] = useState(null);
  const [commentaire, setCommentaire] = useState([]);
  const [textComment, setTextComment] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [connectedUser, setConnectedUser] = useState("");

  const getConnectedUser = async () => {
    const reponse = await getValue("username");
    setConnectedUser(reponse);
  };
  useEffect(() => {
    getComment(setCommentaire, postId);
  }, [postId]);

  useEffect(() => {
    console.log(postId);
    setIsButtonDisabled(textComment.trim() === "");
  }, [textComment]);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const socket = new WebSocket(`${socketLink}/notification/${username}`);
  useEffect(() => {
    getConnectedUser();
    socket.onopen = (event) => {
      console.log("Websocket connected post");
      // console.log(`${socketLink}/notification/${username}`);
      // console.log(username);
    };
    socket.onclose = (event) => {
      console.log("closed post");
    };

    socket.onmessage = (e) => {};

    return () => socket.close();
  }, [username]);

  const sendNotif = () => {
    socket.send(
      JSON.stringify({
        action: connectedUser + " a commenter votre publications ",
        sender: connectedUser,
        postId: postId,
      })
    );
  };

  const formateDate = (date) => {
    return formatDistanceToNow(new Date(date), { locale: fr });
  };

  return (
    <TouchableWithoutFeedback onPress={() => router.back()}>
      <View
        style={{
          height: "100%",
          paddingTop: "70%",
          backgroundColor: "rgba(0,0,0,0.4)",
        }}
      >
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={styles.modal}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentHeaderText}>
                Publication de {username}
              </Text>
            </View>
            <ScrollView>
              <View style={styles.commentContainer}>
                {commentaire.map((valeur) => (
                  <View
                    key={valeur.id}
                    style={[DStyle.flexDRow, { paddingBottom: 23 }]}
                  >
                    <View style={styles.commentAvatar}>
                      <Pressable
                        onPress={() =>
                          router.replace(
                            "/Profil/" + valeur.utilisateur.username
                          )
                        }
                      >
                        <Image
                          source={{
                            uri: `${lien}${valeur.utilisateur.avatar}`,
                          }}
                          style={styles.avatarImage}
                        />
                      </Pressable>
                    </View>
                    <View style={[DStyle.flexDColumn, { gap: 0 }]}>
                      <View style={styles.commentValue}>
                        <Pressable
                          onPress={() =>
                            router.replace(
                              "/Profil/" + valeur.utilisateur.username
                            )
                          }
                        >
                          <Text style={styles.commentUserName}>
                            {valeur.utilisateur.username}
                          </Text>
                        </Pressable>
                        <Text>{valeur.contenue}</Text>
                      </View>
                      {valeur.image && (
                        <Image
                          source={{
                            uri: `${lien}${valeur.image}`,
                          }}
                          style={{
                            width: 100,
                            height: 150,
                            marginTop: 10,
                            marginLeft: 15,
                            borderRadius: 10,
                          }}
                        />
                      )}
                      <Text style={styles.commentDate}>
                        {formateDate(valeur.created)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
            {photo && (
              <View style={{}}>
                <Pressable
                  onPress={() => setPhoto(null)}
                  style={styles.trashIcon}
                >
                  <Icon name="trash" size={20} color="black" />
                </Pressable>
                <Image source={{ uri: photo }} style={styles.image} />
              </View>
            )}
            <View style={styles.commentSection}>
              {/* <Button title="Pic" onPress={pickImageAsync} /> */}
              <Pressable onPress={pickImageAsync}>
                <Icon name="image" size={30} color="purple" />
              </Pressable>
              <TextInput
                placeholder="Commentaire"
                style={styles.commentInput}
                value={textComment}
                onChangeText={setTextComment}
                autoFocus={true}
                multiline={true}
              />

              <Pressable
                onPress={
                  !isButtonDisabled
                    ? () => {
                        commented(
                          setTextComment,
                          setCommentaire,
                          getComment,
                          setPhoto,
                          textComment,
                          photo,
                          postId
                        );
                        sendNotif();
                      }
                    : null
                }
              >
                <Icon
                  name="paper-plane"
                  size={26}
                  color={isButtonDisabled ? "#f0f0f0" : "purple"}
                />
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  modal: {
    // width: "100%",
    // flex: 1,
    backgroundColor: "white",
    padding: 10,
    justifyContent: "flex-end",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "100%",
  },
  commentContainer: {
    width: "100%",
  },
  commentHeader: {
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
  },
  commentHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
    alignSelf: "center",
  },
  commentAvatar: {
    borderRadius: 100,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  commentValue: {
    maxWidth: "90%",
    minWidth: "90%",
    marginLeft: 9,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  commentUserName: {
    fontSize: 12,
    fontWeight: "bold",
  },
  commentDate: {
    marginLeft: 15,
    fontSize: 12,
  },
  commentSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 7,
    paddingTop: 5,
    borderTopWidth: 1,
  },
  commentInput: {
    flex: 1,
    height: 37,
    marginLeft: 1,
    borderColor: "black",
    borderRadius: 10,
    paddingLeft: 8,
  },
  trashIcon: {
    alignSelf: "flex-end",
    width: 50,
    height: 50,
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default CommentScreen;
