import { useEffect, useState } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import api from "../Api";
import lien from "../lien";
import Icon from "react-native-vector-icons/FontAwesome6";
import DStyle from "../components/style/style";
import { Link, router } from "expo-router";
import { getValue } from "../components/fonction/fonction";

export default function NewPost() {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const get = async () => {
      setAvatar(await getValue("avatar"));
      setUsername(await getValue("username"));
    };
    get();
  }, []);

  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const publish = async () => {
    try {
      const token = await getValue("accessToken");
      const formData = new FormData();
      formData.append("description", description);
      if (photo) {
        formData.append("image", {
          uri: photo,
          type: "image/jpeg",
          name: "image.jpeg",
        });
      }
      const response = await api.post(lien + "/new-post/", formData, {
        headers: {
          Authorization: "Token " + token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        router.replace("/Home");
      }
    } catch (error) {
      console.error("Error publishing post:", error);
    }
  };

  const [isenable, setisEnable] = useState(false);

  useEffect(() => {
    setisEnable(photo !== "" && description.trim() !== "");
  }, [photo, description]);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.replace("Home")}>
        <View style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#000" />
        </View>
      </Pressable>
      <View style={styles.content}>
        <View style={styles.userInfo}>
          <Image source={{ uri: `${lien}${avatar}` }} style={styles.avatar} />
          <Text style={styles.username}>{username}</Text>
        </View>
        <TextInput
          placeholder="Enter description"
          style={styles.textInput}
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TouchableOpacity
          onPress={pickImageAsync}
          style={styles.pickImageButton}
        >
          <Text style={styles.pickImageText}>
            <Icon name="image" size={20} color="green" /> Select Image
          </Text>
        </TouchableOpacity>
        {photo && <Image source={{ uri: photo }} style={styles.image} />}
        <View style={styles.buttonContainer}>
          <Button title="Publish" onPress={publish} disabled={!isenable} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  backButton: {
    marginTop: 30,
    marginBottom: 20,
  },
  content: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    padding: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    height: 80,
    marginBottom: 10,
  },
  pickImageButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  pickImageText: {
    fontSize: 16,
    color: "green",
    marginLeft: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
