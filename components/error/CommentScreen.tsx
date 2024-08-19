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
import { commented, getComment, getPost } from "../fonction/fonction";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome6";
import DStyle from "../style/style";
import lien from "../../lien";

const CommentScreen = ({ modalVisible, onclose, postId, username }) => {
  const [height, setHeight] = useState(new Animated.Value(400));
  const [photo, setPhoto] = useState(null);
  const [commentaire, setCommentaire] = useState([]);
  const [textComment, setTextComment] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        Animated.timing(height, {
          toValue: 300 + gestureState.dy,
          duration: 0,
          useNativeDriver: false,
        }).start();
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        setHeight(new Animated.Value(300 + gestureState.dy));
      }
    },
  });

  useEffect(() => {
    getComment(setCommentaire, postId);
  }, [postId]);

  useEffect(() => {
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

  const formateDate = (date) => {
    return formatDistanceToNow(new Date(date), { locale: fr });
  };

  return (
    <Modal animationType="slide" visible={modalVisible} transparent={true}>
      <TouchableWithoutFeedback onPress={onclose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[styles.modal, { height }]}
              {...panResponder.panHandlers}
            >
              <ScrollView>
                <View style={styles.commentContainer}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentHeaderText}>
                      Publication de {username}
                    </Text>
                  </View>
                  {commentaire.map((valeur) => (
                    <View key={valeur.id} style={DStyle.flexDRow}>
                      <View style={styles.commentAvatar}>
                        <Image
                          source={{
                            uri: `${lien}${valeur.utilisateur.avatar}`,
                          }}
                          style={styles.avatarImage}
                        />
                      </View>
                      <View style={[DStyle.flexDColumn, { gap: 0 }]}>
                        <View style={styles.commentValue}>
                          <Text style={styles.commentUserName}>
                            {valeur.utilisateur.username}
                          </Text>
                          <Text>{valeur.contenue}</Text>
                        </View>
                        <Text style={styles.commentDate}>
                          {formateDate(valeur.created)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
              {photo && (
                <View>
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
                <Button title="Pic" onPress={pickImageAsync} />

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
                      ? () =>
                          commented(
                            setTextComment,
                            setCommentaire,
                            getComment,
                            textComment,
                            photo,
                            postId
                          )
                      : null
                  }
                >
                  <Icon
                    name="paper-plane"
                    size={26}
                    color={isButtonDisabled ? "gray" : "#000"}
                  />
                </Pressable>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  modal: {
    width: "100%",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
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
    backgroundColor: "gray",
    padding: 10,
  },
  commentUserName: {
    fontSize: 12,
    fontWeight: "bold",
  },
  commentDate: {
    marginLeft: 15,
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
