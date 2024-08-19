import { useState } from "react";
import { Button, Image, View, StyleSheet, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import api from "../Api";
import lien from "../lien";
import { useNavigation } from "@react-navigation/native";

export default function ImagePickerExample() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const resizedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 400 } }],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      setPhoto(result.assets[0].uri);

      console.log(photo);
    } else {
      alert("You did not select any image.");
    }
  };

  const publish = async () => {
    try {
      if (!photo) {
        console.error("No image selected");
        return;
      }

      const formData = new FormData();
      formData.append("description", description);
      formData.append("image", {
        uri: photo,
        type: "image/jpeg", // Use 'image/*' to accept all types of images
        name: "image.jpg",
      });
      console.log(formData);
      const response = await api.post(lien + "/new-post/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        // Handle success
        console.log("Post published successfully");
        navigation.navigate("Home", { resfresh: true });
      }
    } catch (error) {
      console.error("Error publishing post:", error);
    }
  };

  // const publish = async () => {
  //   try {
  //     const response = await api.post(
  //       lien + "/new-post/",
  //       {
  //         image: photo,
  //         description: description,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     navigation.navigate("Home");
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //   }
  // };
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter description"
        style={styles.commentInput}
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <Button title="Pick Image" onPress={pickImageAsync} />
      {photo && <Image source={{ uri: photo }} style={styles.image} />}
      <View style={styles.buttonContainer}>
        <Button title="Publish" onPress={publish} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  commentInput: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    paddingLeft: 10,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
});
