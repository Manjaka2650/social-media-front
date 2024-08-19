import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  Platform,
  Dimensions,
  Button,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { GiftedChat, Bubble, Send, Composer } from "react-native-gifted-chat";
import { router, useLocalSearchParams } from "expo-router";
import api from "../../Api";
import { getValue } from "../../components/fonction/fonction";
import Icn from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/FontAwesome6";
import lien, { socketLink } from "../../lien";
import DStyle from "../../components/style/style";
import * as ImagePicker from "expo-image-picker";
import { format, formatDate } from "date-fns";
// import Video from "react-native-video";
import { Video, ResizeMode, Audio } from "expo-av";
import { requestPermissionsAsync } from "expo-media-library";

const MAX_WIDTH = Dimensions.get("window").width * 0.75;
const MAX_HEIGHT = 250;

export default function SingleMessage() {
  const { room_name, other_user } = useLocalSearchParams();
  const socket = useRef(null);
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(1);
  const [userAvatar, setUserAvatar] = useState("/media/default.png");
  const [isTyping, setIsTyping] = useState(false);
  // ========================audio==========================//
  const [textInputVisible, setTextInputVisible] = useState(true);
  const [recordingaudio, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [messageLoading, setMesageLoading] = useState(false);
  // Load the user's username from AsyncStorage

  // Load initial messages from the server
  const getMessage = async () => {
    try {
      // setMesageLoading(true);

      const user = await getValue("username");
      const userId = await getValue("userId");
      const avatar = await getValue("avatar");
      setUsername(user);
      setUserId(userId);
      setUserAvatar(avatar);
      const token = await getValue("accessToken");

      const response = await api.get("/message/room/" + room_name, {
        headers: {
          Authorization: "Token " + token,
        },
      });
      if (response.status == 200) {
        // console.log(response.data)
        const d = response.data;
        // console.log("d", d);
        // if (d && d[0].sender) {
        const formatedData = d.map((element) => ({
          _id: element.id,
          text: element.content,
          createdAt: new Date(element.timestamp),
          user: {
            _id: element.sender.username,
            name: element.sender.username,
            avatar: `${lien}${element.sender.avatar}`,
          },

          ...(element.image && { image: `${lien}${element.image}` }),
          ...(element.video && { video: `${lien}${element.video}` }),
          ...(element.audio && { audio: `${lien}${element.audio}` }),
        }));

        setMessages(formatedData.reverse());
        setMesageLoading(false);
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    // getUsename();
    getMessage();
    socket.current = new WebSocket(`${socketLink}/chat/${room_name}`);
    socket.current.onopen = () => {
      console.log("WebSocket.current connected");
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(
          JSON.stringify({ type: "set_read_message", other_user: other_user })
        );
        console.log("sent");
      }
    };
    socket.current.onclose = () => {
      console.log("WebSocket.current closed");
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(
          JSON.stringify({ type: "set_read_message", other_user: other_user })
        );
        console.log("sent");
      }
    };
    socket.current.addEventListener("message", (e) => {
      const data = JSON.parse(e.data);

      const type_event = data["type"];
      if (type_event === "message") {
        const messageData = data["message"]["message"];

        if (messageData && messageData.sender) {
          console.log(messageData);
          const newMessage = {
            _id: messageData.id,
            text: messageData.content,
            createdAt: messageData.timestamp,
            user: {
              _id: messageData.sender.username,
              name: messageData.sender.name,
              avatar: `${lien}${messageData.sender.avatar}`,
            },
            ...(messageData.image && {
              image: `${lien}${messageData.image}`,
            }),
            ...(messageData.video && {
              video: `${lien}${messageData.video}`,
            }),

            ...(messageData.audio && {
              audio: `${lien}${messageData.audio}`,
            }),
          };
          // console.log(newMessage.user._id);
          setMessages((prevMessages) =>
            GiftedChat.append(prevMessages, newMessage)
          );
        }
      }
      if (type_event === "typing") {
        // console.log(data["isTyping"]["isTyping"]);
        // console.log(data["isTyping"]["user"] === "manjaka");
        if (data["isTyping"]["user"] === other_user) {
          setIsTyping(data["isTyping"]["isTyping"]);
        } else if (username === data["isTyping"]["user"]) setIsTyping(false);
      }
      if (type_event === "delete_message") {
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message._id !== data["messageid"])
        );
      }
    });

    return () => socket.current.close();
  }, [room_name]);

  const handleSend = (newMessages = []) => {
    const newMessage = newMessages[0];
    const messageData = {
      type: "send_message",
      room: room_name,
      sender: username,
      message: newMessage.text,
      image: null,
      new_message: null,
    };

    // console.log(messageData.message);

    // Send message to WebSocket.current server
    socket.current.send(JSON.stringify(messageData));

    // Append new message locally
    // setMessages((previousMessages) =>
    //   GiftedChat.append(previousMessages, newMessages)
    // );
  };

  const uploadImage = async (uri) => {
    const token = await getValue("accessToken");
    const usernam = await getValue("username");
    console.log("username", usernam);
    const formData = new FormData();
    formData.append("image", {
      uri: uri,
      type: "image/jpeg",
      name: "image.jpeg",
    });
    formData.append("room", room_name);
    formData.append("username", usernam);
    formData.append("message", "");
    const response = await api.post(
      "/message/create-image/" + usernam,
      formData,
      {
        headers: {
          Authorization: "Token " + token,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status == 200) return response.data;
    return null;
  };
  // handle send image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const image = await uploadImage(result.assets[0].uri);
      // console.log(image);
      socket.current.send(
        JSON.stringify({
          type: "send_message",
          room: room_name,
          sender: username,
          message: "",
          image: image.image ? image.image : null,
          new_message: image,
        })
      );
    }
  };

  // handle send video
  const uploadVideo = async (uri) => {
    const token = await getValue("accessToken");
    const usernam = await getValue("username");
    // console.log("username", usernam);
    const formData = new FormData();
    formData.append("video", {
      uri: uri,
      type: "video/*",
      name: "video.mp4",
    });
    formData.append("room", room_name);
    formData.append("username", usernam);
    formData.append("message", "");
    const response = await api.post(
      "/message/create-video/" + usernam,
      formData,
      {
        headers: {
          Authorization: "Token " + token,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status == 200) return response.data;
    return null;
  };

  const uploadAudio = async (uri) => {
    const token = await getValue("accessToken");
    const usernam = await getValue("username");
    console.log("username", usernam);
    const formData = new FormData();
    formData.append("audio", {
      uri: uri,
      type: "audio/*",
      name: "audio.mp3",
    });
    formData.append("room", room_name);
    formData.append("username", usernam);
    formData.append("message", "");
    const response = await api.post(
      "/message/create-audio/" + usernam,
      formData,
      {
        headers: {
          Authorization: "Token " + token,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.status == 200) return response.data;
    return null;
  };
  // handle send image
  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const video = await uploadVideo(result.assets[0].uri);
      // console.log(video);
      socket.current.send(
        JSON.stringify({
          type: "send_message",
          room: room_name,
          sender: username,
          message: "",
          video: video.video ? video.video : null,
          new_message: video,
        })
      );
    }
  };
  // send video

  const sendIstyping = async (text) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(
        JSON.stringify({ type: "typing", isTyping: !!text, sender: username })
      );
    } else console.log("Not ready");
  };

  // action for geting audio

  // the action  need
  const renderAction = (props) => {
    if (textInputVisible)
      return (
        <View
          style={[DStyle.flexDRow, { padding: 10, paddingRight: 0, gap: 10 }]}
        >
          <Pressable onPress={pickVideo}>
            <Icon name="video" size={26} color="purple" />
          </Pressable>
          <Pressable onPress={pickImage}>
            <Icon name="image" size={26} color="purple" />
          </Pressable>
          <Pressable
            onPress={() => {
              setTextInputVisible(false); // Hide text input and show recording UI
              startRecording();
            }}
          >
            <Icon name="microphone" size={26} color="purple" />
          </Pressable>
        </View>
      );
  };

  const [messageid, setMessageId] = useState(0);
  const [actionVisible, setActionVisible] = useState(false);
  // Customize message bubble style
  const renderBubble = (props) => {
    const { currentMessage } = props;
    // console.log("currentMessage", currentMessage._id);
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#DCF8C6",
          },
          left: { backgroundColor: "#E5E5EA" },
        }}
        onLongPress={() => {
          setMessageId(currentMessage._id);
          setActionVisible(true);
        }}
        textStyle={{
          right: { color: "black" },
          left: { color: "black" },
        }}
      />
    );
  };

  // Customize the send button
  const renderSend = (props) => (
    <Send {...props}>
      <View style={styles.sendingContainer}>
        <Icon name="paper-plane" size={26} color="purple" />
      </View>
    </Send>
  );

  // customize text input
  const renderTextInput = (props) =>
    textInputVisible ? (
      <Composer
        textInputStyle={styles.textInput}
        placeholder="Ecrire ..."
        {...props}
      />
    ) : (
      <View style={styles.recordingToolbar}>
        <Pressable onPress={stopRecording} style={styles.stopButton}>
          <Icon name="trash" size={24} color="purple" />
        </Pressable>
        <Text style={{ fontWeight: "condensed" }}> Recording ...</Text>
        <Pressable onPress={handleSendAudio} style={styles.sendButton}>
          <Icon name="paper-plane" size={24} color="purple" />
        </Pressable>
      </View>
    );

  //customize the time
  const renderTime = (props) => {
    const { currentMessage } = props;
    const temps = format(new Date(currentMessage.createdAt), "hh:mm a");
    if (!currentMessage.video)
      return (
        <Text
          {...props}
          style={{
            color: "gray",
            fontSize: 9,
            padding: 7,
          }}
        >
          {temps}
        </Text>
      );
    else return;
  };
  // customise the avatar
  const renderAvatar = (props) => {
    // console.log(props.currentMessage);
    const { user } = props;
    // console.log(user.avatar);
    return (
      <Pressable
        onPress={() => {
          if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(
              JSON.stringify({
                type: "set_read_message",
                other_user: other_user,
              })
            );
            console.log("sent");
          }
          router.push("/Profil/" + user.name);
        }}
      >
        <Image
          source={{ uri: user.avatar }}
          style={{ width: 35, height: 35, borderRadius: 100 }}
        />
      </Pressable>
    );
  };

  const [videoSize, setVideoSize] = useState({
    width: MAX_WIDTH,
    height: MAX_HEIGHT,
  });
  // render video
  const renderVideo = (props) => {
    const { currentMessage } = props;
    // const videoLoad = ({ name }) => {
    //   console.log("name", name);
    // };

    if (Platform.OS == "web")
      return (
        <video
          width="auto"
          height="auto"
          style={{ maxWidth: "250", maxHeight: 300 }}
          controls
        >
          <source src={currentMessage.video} />
        </video>
      );
    else
      return (
        <Video
          style={{
            height: videoSize.height,
            width: videoSize.width,
            maxWidth: MAX_WIDTH,
            maxHeight: MAX_HEIGHT,
            borderRadius: 9,
            backgroundColor: "#f1f1f1",
          }}
          source={{ uri: currentMessage.video }}
          // onReadyForDisplay={videoLoad}
          // shouldPlay
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          isLooping
        />
      );
  };
  // render audio component

  // useEffect(() => {
  //   return sound
  //     ? () => {
  //         console.log("uploading song ...", sound.getStatusAsync());
  //         // sound.uploadAsync();
  //       }
  //     : undefined;
  // }, [sound]);

  // handle send audio brother

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        console.log("permission Denied");
        await requestPermissionsAsync();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      console.log("started");
    } catch (error) {
      console.log(error);
    }
  };

  // sending

  const handleSendAudio = async () => {
    // d'abord stoper le recording

    if (!recordingaudio) return;
    try {
      setIsRecording(false);
      await recordingaudio.stopAndUnloadAsync();
      const uri = recordingaudio.getURI();
      setRecording(undefined);
      setAudioUri(uri);
      setTextInputVisible(true); // Switch back to text input
      // console.log("Recording stopped and stored at", uri);
      const audio = await uploadAudio(uri);
      console.log(audio);
      socket.current.send(
        JSON.stringify({
          type: "send_message",
          room: room_name,
          sender: username,
          message: "",
          audio: audio.audio ? audio.audio : null,
          new_message: audio,
        })
      );
    } catch (error) {}
  };

  //=================================stop recording================================//
  const stopRecording = async () => {
    if (!recordingaudio) return;

    setIsRecording(false);
    await recordingaudio.stopAndUnloadAsync();
    // const uri = recordingaudio.getURI();
    setRecording(undefined);
    // setAudioUri(uri);
    setTextInputVisible(true); // Switch back to text input
    // console.log("Recording stopped and stored at", uri);
  };

  // rehefa haza ilay audio no atao eto
  const AudioPlayer = ({ uri }) => {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [duration, setDuration] = useState(0);

    const formattime = (d) => {
      const minute = Math.floor(d / 60000);
      const second = ((d % 60000) / 1000).toFixed(0);
      return `${minute}:${second < 10 ? "0" : ""}${second}`;
    };
    async function playSound() {
      if (!uri) return;
      if (sound) setSound(null);
      setIsLoading(true);

      try {
        const { sound, status } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );
        setDuration(status.durationMillis);
        setSound(sound);
        // console.log(sound);
        setIsPlaying(true);
        await sound.playAsync();
        // setSound(null);
        // setIsPlaying(false);
      } catch (error) {
        console.error("Error playing sound", error);
      } finally {
        setIsLoading(false);
      }
    }

    async function stopSound() {
      if (sound) {
        // alert(isPlaying);
        // alert(sound);
        setIsPlaying(false);
        await sound.stopAsync();
        setSound(null);
        // alert(sound);
      }
    }

    return (
      <View style={styles.audioContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Pressable onPress={!isPlaying ? playSound : stopSound}>
            <View
              style={[
                DStyle.flexDRow,
                { justifyContent: "space-between", marginRight: 10, gap: 2 },
              ]}
            >
              <Text>
                <Icon
                  name={isPlaying ? "stop" : "play"}
                  color={"black"}
                  size={26}
                />
              </Text>
              <Text>
                {
                  <View style={[DStyle.flexDRow, { alignItems: "center" }]}>
                    <View style={[styles.bar, { height: 4 }]} />
                    <View style={[styles.bar, { height: 29 }]} />
                    <View style={[styles.bar, { height: 20 }]} />
                    <View style={[styles.bar, { height: 22 }]} />
                    <View style={[styles.bar, { height: 25 }]} />
                    <View style={[styles.bar, { height: 23 }]} />
                    <View style={[styles.bar, { height: 20 }]} />
                    <View style={[styles.bar, { height: 25 }]} />
                    <View style={[styles.bar, { height: 20 }]} />
                    <View style={[styles.bar, { height: 20 }]} />
                    <View style={[styles.bar, { height: 25 }]} />
                    <View style={[styles.bar, { height: 20 }]} />
                    {!isPlaying && (
                      <>
                        <View style={[styles.bar, { height: 20 }]} />
                        <View style={[styles.bar, { height: 25 }]} />
                        <View style={[styles.bar, { height: 20 }]} />
                      </>
                    )}
                  </View>
                }
              </Text>
              <Text style={{ fontSize: 17 }}>
                {isPlaying && <ActivityIndicator size="small" color="gray" />}
                {/* {isPlaying ? formattime(duration) : ""} */}
              </Text>
            </View>
          </Pressable>
        )}
      </View>
    );
  };

  const renderMessageAudio = (props) => {
    const { currentMessage } = props;
    // console.log(currentMessage.audio.status.durationMillis);

    if (currentMessage.audio) {
      return <AudioPlayer uri={currentMessage.audio} />;
    }

    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          DStyle.flexDRow,
          {
            justifyContent: "space-between",
            margin: 12,
            marginTop: Platform.OS == "web" ? 10 : 40,
          },
        ]}
      >
        <View style={[DStyle.flexDRow]}>
          <Pressable
            onPress={() => {
              if (
                socket.current &&
                socket.current.readyState === WebSocket.OPEN
              ) {
                socket.current.send(
                  JSON.stringify({
                    type: "set_read_message",
                    other_user: other_user,
                  })
                );
                console.log("sent");
              }
              router.back();
            }}
          >
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
            </View>
          </Pressable>
          <View style={[DStyle.flexDColumn]}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              @{other_user}
            </Text>
            {isTyping && (
              <Text style={{ fontSize: 10, fontWeight: "condensedBold" }}>
                entrain d'ecrire ...
              </Text>
            )}
          </View>
        </View>
        <View
          style={[
            DStyle.flexDRow,
            {
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
            },
          ]}
        >
          {/* video call */}
          {/* <Pressable
            onPress={() => {
              alert("Manjaka");
            }}
          >
            <Text>
              <Icn name="video" size={25} color="black" />
            </Text>
          </Pressable> */}
          <Pressable style={{ marginLeft: 12 }} onPress={() => alert(username)}>
            <Text>
              <Icn name="ellipsis-v" size={20} color="black" />
            </Text>
          </Pressable>
        </View>
      </View>
      {messageLoading && (
        <View>
          <ActivityIndicator size={"large"} color={"black"} />
        </View>
      )}
      <GiftedChat
        messages={messages}
        // loadEarlier
        isTyping={isTyping}
        scrollToBottom
        onSend={(messages) => handleSend(messages)}
        user={{
          _id: username,
          name: username,
          avatar: `${lien}${userAvatar}`,
        }}
        renderBubble={renderBubble} //bulle de message
        renderSend={renderSend} //send icon
        renderComposer={renderTextInput} //input type
        renderActions={renderAction} //photo video audio
        renderTime={renderTime} //temps
        renderAvatar={renderAvatar}
        onInputTextChanged={(text) => sendIstyping(text)}
        renderMessageVideo={renderVideo}
        renderMessageAudio={renderMessageAudio}
        // renderFooter={}
      />
      {actionVisible && (
        <Suggestion
          userconnected={username}
          setClose={() => setActionVisible(false)}
          messageid={messageid}
          socket={socket}
        />
      )}
    </View>
  );
}

// =================================================================================================//

const Suggestion = ({ messageid, setClose, userconnected, socket }) => {
  const confirm = () => {
    Alert.alert(
      "Alert",
      "Etes vous sur de vouloir supprimer?",
      [
        {
          text: "Non",
          onPress: () => {},
          style: "cancel",
        },

        { text: "ok", onPress: () => deleteAction() },
      ],
      { cancelable: true }
    );
  };
  const deleteAction = async () => {
    // const token = await getValue("accessToken");
    // const respone = await api.post(
    //   "/message/delete-message/" + messageid,
    //   {},
    //   { headers: { Authorization: "Token " + token } }
    // );
    // if (respone.status == 200) {
    //   alert("Suppression avec succes");

    // }
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(
        JSON.stringify({ type: "delete_message", messageid: messageid })
      );
      setClose();
    } else console.log("not ready");
  };

  return (
    <TouchableWithoutFeedback onPress={setClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={[DStyle.flexDColumn, styles.suggestionContainer]}>
            {userconnected && (
              <Pressable
                onPress={confirm}
                style={{
                  width: "100%",
                  alignContent: "center",
                  alignItems: "center",
                  paddingTop: 12,
                }}
              >
                <View
                  style={[
                    DStyle.flexDRow,
                    {
                      gap: 12,
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Text style={{ fontSize: 22 }}>
                    <Icon name="trash" size={20} color="red" />
                  </Text>
                  <Text style={{ fontSize: 22 }}>Supprimer</Text>
                </View>
              </Pressable>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};
//=====================================audio player=============================//

//======================================audio recorder=============================================//

// const AudioRecorder = () => {
//   const [recordingaudio, setRecording] = useState();
//   const [audioUri, setAudioUri] = useState(null);
//   const [isRecording, setIsRecording] = useState(false);
//   async function startRecording() {
//     try {
//       const permission = await Audio.requestPermissionsAsync();
//       if (permission.status !== "granted") {
//         console.log("permission Denied");
//         await requestPermissionsAsync();
//       }
//       await Audio.setAudioModeAsync({
//         allowsRecordingIOS: true,
//         playsInSilentModeIOS: true,
//       });
//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RecordingOptionsPresets.HIGH_QUALITY
//       );
//       setRecording(recording);
//       setIsRecording(true);
//       console.log("started");
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   async function stopRecording() {
//     console.log("stoping...");
//     await recordingaudio.stopAndUnloadAsync();
//     await Audio.setAudioModeAsync({
//       allowsRecordingIOS: false,
//     });
//     const uri = recordingaudio.getUri();
//     console.log("uri:", uri);
//   }
//   return (
//     <Pressable onPress={recordingaudio ? stopRecording : startRecording}>
//       <Text>
//         <Icon name={recordingaudio ? "stop" : "play"} size={30} color="black" />
//       </Text>
//     </Pressable>
//   );
// };
const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    height: "100%",
    // borderWidth: 1,
  },
  textInput: {
    color: "#000",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    marginHorizontal: 10,
    height: 50,
  },
  actionsContainer: {
    flexDirection: "row",
    marginBottom: 5,
    marginLeft: 5,
  },
  actionButton: {
    marginHorizontal: 5,
  },
  recordingToolbar: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: "#f1f1f1",
    justifyContent: "space-between",
    width: "100%",
  },
  stopButton: {
    marginRight: 10,
  },
  sendButton: {
    marginLeft: "auto",
  },
  audioContainer: {
    marginVertical: 5,
    padding: 5,
    paddingLeft: 10,
    borderRadius: 10,
    width: 200,
    marginTop: 10,
  },
  bar: {
    width: 4,
    marginHorizontal: 2,
    borderRadius: 2,
    backgroundColor: "gray",
  },
  suggestionContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    height: "30%",

    gap: 20,
    width: "100%",
  },
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.4)",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
});
