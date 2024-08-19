import { router } from "expo-router";
import api from "../../Api";
import lien, { socketLink } from "../../lien";
import AsyncStorage from "@react-native-async-storage/async-storage";

// avoir post et nombre de like
export const getPost = async (setPost, setnombre_like, postId) => {
  try {
    const token = await getValue("accessToken");

    const response = await api.get("/post/" + postId, {
      headers: { Authorization: "Token " + token },
    });

    if (response.data) {
      setPost(response.data);
      setnombre_like(response.data.nombre_like);
    }
  } catch (error) {
    console.log(error);
  }
};

// avoir tout commentaire
export const getComment = async (setCommentaire, postId) => {
  try {
    const token = await getValue("accessToken");
    const response = await api.get("/commentaire/" + postId, {
      headers: { Authorization: "Token " + token },
    });
    if (response.data) {
      setCommentaire(response.data);
    }
  } catch (error) {
    console.log(error);
  }
};

// like or dislike
export const likeAction = async (setnombre_like, setAlready, postId) => {
  const token = await getValue("accessToken");
  try {
    const response = await api.post(
      lien + "/likeAction/" + postId,
      {},
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );
    setnombre_like(response.data.nombre_like);
    setAlready(response.data.liked);
  } catch (error) {
    console.log(error);
  }
};

export const commented = async (
  setTextComment,
  setCommentaire,
  getComment,
  setPhoto,
  textComment,
  photo,
  postId
) => {
  try {
    const token = await getValue("accessToken");
    const formData = new FormData();
    formData.append("textComment", textComment);
    console.log(photo);
    if (photo != null) {
      formData.append("image", {
        uri: photo,
        type: "image/jpeg",
        name: "image.jpeg",
      });
    }
    console.log(formData);
    setTextComment("");
    setPhoto(null);

    const response = await api.post(
      lien + "/setCommentaire/" + postId,
      formData,
      {
        headers: {
          Authorization: "Token " + token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status == 200) {
      // Handle success
      getComment(setCommentaire, postId);
      console.log("Post published successfully");
    }
  } catch (error) {
    console.error("Error publishing post:", error);
  }
};

export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem("accessToken");
    return value;
  } catch (error) {
    return null;
  }
};

export const getValue = async (item) => {
  try {
    const value = await AsyncStorage.getItem(item);
    if (value != null) return value;
    else return "";
  } catch (error) {
    return null;
  }
};

export const removeValue = async (item) => {
  try {
    await AsyncStorage.removeItem(item);
  } catch (error) {}
};
export const StoreValue = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
};

export const disconnect = async () => {
  try {
    await removeValue("accessToken");
    await removeValue("userId");
    await removeValue("username");
    await removeValue("email");
    await removeValue("avatar");
    await removeValue("name");
    await removeValue("bio");
    router.navigate("/Login");
  } catch (error) {
    alert(error);
  }
};

// export const socket = new WebSocket(`${socketLink}/notification/${username}`);
export const getAllNotification = async (setData) => {
  try {
    const token = await getValue("accessToken");
    const usernam = await getValue("username");
    const response = await api.get(`/message/allnotification/${usernam}/`, {
      headers: {
        Authorization: "Token " + token,
      },
    });
    if (response.status == 200) {
      setData(response.data);
    }
  } catch (error) {
    console.log("Error : " + error);
  }
};

export const getAllMessages = async (
  setData,
  setUserMessaged,
  setMesageLoading
) => {
  try {
    const token = await getValue("accessToken");
    const usernam = await getValue("username");

    const response = await api.get(`/message/usermessaged/${usernam}/`, {
      headers: {
        Authorization: "Token " + token,
      },
    });
    if (response.status == 200) {
      setData(response.data.message);
      setUserMessaged(response.data.usermessaged);
    }
  } catch (error) {
    console.log("Error : " + error);
  } finally {
    setMesageLoading(false);
  }
};

export const getAllRequest = async (setData) => {
  const token = await getValue("accessToken");
  const usernam = await getValue("username");
  const response = await api.get(`/all-friend-request/${usernam}`, {
    headers: {
      Authorization: "Token " + token,
    },
  });
  if (response.status == 200) {
    setData(response.data);
    // console.log("getting data");
  }
};
