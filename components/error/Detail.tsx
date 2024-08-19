import React, { useState } from "react";
import { View, Pressable, TextInput, StyleSheet } from "react-native";

import Icon from "react-native-vector-icons/FontAwesome6";

import { Audio } from "expo-av";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";

const ChatScreen = () => {
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [textInputVisible, setTextInputVisible] = useState(true);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(recording);
        setIsRecording(true);
      } else {
        console.log("Permission to access microphone denied");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(undefined);
    setAudioUri(uri);
    setTextInputVisible(true); // Switch back to text input
    console.log("Recording stopped and stored at", uri);
  };

  const renderActions = (props) => (
    <View style={styles.actionsContainer}>
      <Pressable style={styles.actionButton}>
        <Icon name={"camera"} size={24} color="black" />
      </Pressable>
      <Pressable style={styles.actionButton}>
        <Icon name={"video"} size={24} color="black" />
      </Pressable>
      <Pressable
        style={styles.actionButton}
        onPress={() => {
          setTextInputVisible(false); // Hide text input and show recording UI
          startRecording();
        }}
      >
        <Icon name="microphone" size={24} color="black" />
      </Pressable>
    </View>
  );

  const handleSendAudio = async () => {
    if (audioUri) {
      // You can send the audio file to your backend here using axios
      console.log("Send audio:", audioUri);
      setAudioUri(null); // Clear the recorded audio after sending
    }
  };

  return (
    <GiftedChat
      renderActions={renderActions}
      renderInputToolbar={(props) =>
        textInputVisible ? (
          <InputToolbar {...props} />
        ) : (
          <View style={styles.recordingToolbar}>
            <Pressable onPress={stopRecording} style={styles.stopButton}>
              <Icon name="stop" size={24} color="red" />
            </Pressable>
            <Pressable onPress={handleSendAudio} style={styles.sendButton}>
              <Icon name="paper-plane" size={24} color="black" />
            </Pressable>
          </View>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    marginBottom: 5,
    marginLeft: 5,
  },
  actionButton: {
    marginHorizontal: 5,
  },
  recordingToolbar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f1f1f1",
  },
  stopButton: {
    marginRight: 10,
  },
  sendButton: {
    marginLeft: "auto",
  },
});

export default ChatScreen;

//================================================================================================//
// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   StyleSheet,
//   Image,
//   Pressable,
// } from "react-native";

// // import { WebSocket } from "react-native-websocket";
// import Icon from "react-native-vector-icons/FontAwesome6";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import lien, { socketLink } from "../../lien";
// import { router, useLocalSearchParams } from "expo-router";
// import api from "../../Api";
// import { getValue } from "../../components/fonction/fonction";
// import DStyle from "../../components/style/style";
// import { formatDistanceToNow } from "date-fns";
// import { fr } from "date-fns/locale";

// export default function SingleMessage() {
//   const { room_name, other_user } = useLocalSearchParams();
//   const socket = new WebSocket(`${socketLink}/chat/${room_name}`);
//   const [message, setMessage] = useState("");
//   const [messages, setDataMessages] = useState([]);
//   const [username, setUsername] = useState("");
//   const getUser = async () => {
//     const storedUsername = await AsyncStorage.getItem("username");
//     setUsername(storedUsername);
//   };

//   const [isButtonDisabled, setIsButtonDisabled] = useState(true);

//   const getMessage = async () => {
//     const token = await getValue("accessToken");
//     const response = await api.get("/message/room/" + room_name, {
//       headers: {
//         Authorization: "Token " + token,
//       },
//     });
//     if (response.status == 200) {
//       setDataMessages(response.data);
//     }
//   };

//   useEffect(() => {
//     getUser();

//     getMessage();
//     socket.onopen = (event) => {
//       console.log("Websocket connected room name");
//     };
//     socket.onclose = (event) => {
//       console.log("closed roomname");
//     };

//     socket.onmessage = (e) => {};
//     socket.addEventListener("message", (e) => {
//       const data = JSON.parse(e.data);
//       console.log(data);
//       const k = data[0];
//       // alert(k);
//       const t = data["message"];
//       // console.log([...messages, t["message"]]);
//       const z = t["message"];
//       if (z && z.sender && z.content)
//         setDataMessages((prevMessages) => [...prevMessages, z]);
//       // console.log(messages);
//     });

//     return () => socket.close();
//   }, [room_name]);

//   const scrolViewref = useRef();

//   useEffect(() => {
//     setIsButtonDisabled(message.trim() === "");
//   }, [message]);

//   const sendMessage = () => {
//     socket.send(
//       JSON.stringify({
//         message: message,
//         room_name: room_name,
//         sender: username,
//       })
//     );
//     setMessage("");
//   };

//   const formateDate = (date) => {
//     var fd = new Date(date);
//     return formatDistanceToNow(date, { locale: fr });
//   };
//   return (
//     <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
//       <View
//         style={[
//           DStyle.flexDRow,
//           { justifyContent: "space-between", margin: 12, marginTop: 40 },
//         ]}
//       >
//         <Pressable onPress={() => router.replace("/Messages")}>
//           <View style={[DStyle.flexDRow, {}]}>
//             <Text
//               style={{
//                 fontSize: 17,
//                 fontWeight: "bold",
//                 marginRight: 12,
//               }}
//             >
//               <Icon name="arrow-left" size={20} />
//             </Text>
//             <Text style={{ fontWeight: "bold", fontSize: 20 }}>
//               Message avec {other_user}
//             </Text>
//           </View>
//         </Pressable>
//       </View>

//       <ScrollView
//         style={{ padding: 10, paddingBottom: 0 }}
//         onContentSizeChange={() =>
//           scrolViewref.current?.scrollToEnd({ animated: true })
//         }
//         snapToEnd={true}
//       >
//         {messages &&
//           messages.map((item, index) => (
//             <View key={item.id || index}>
//               {item.sender.username !== username ? (
//                 <MessageView
//                   avatar={item.sender.avatar}
//                   alignSelf={"flex-start"}
//                   color={"#E5E5EA"}
//                   content={item.content}
//                   date={formateDate(item.timestamp)}
//                   username={item.sender.username}
//                 />
//               ) : (
//                 <MessageView
//                   avatar={null}
//                   alignSelf={"flex-end"}
//                   color={"#DCF8C6"}
//                   date={formateDate(item.timestamp)}
//                   content={item.content}
//                   username={username}
//                 />
//               )}
//               {/* <View>
//                 {item.sender.username !== username && (
//                   <Pressable
//                     onPress={() =>
//                       router.replace("/Profil/" + item.sender.username)
//                     }
//                   >
//                     <Image
//                       source={{ uri: `${lien}${item.sender.avatar}` }}
//                       style={{ width: 40, height: 40, borderRadius: 100 }}
//                     />
//                   </Pressable>
//                 )}
//                 <View
//                   style={{
//                     backgroundColor:
//                       item.sender.username === username ? "purple" : "gray",
//                     borderWidth: 1,
//                     borderRadius: 10,
//                     alignSelf:
//                       item.sender.username === username
//                         ? "flex-end"
//                         : "flex-start",
//                     padding: 10,
//                     margin: 3,
//                     maxWidth: 200,
//                   }}
//                 >
//                   <Text>{item.content}</Text>
//                 </View>
//               </View> */}
//             </View>
//           ))}
//       </ScrollView>

//       <View style={styles.commentSection}>
//         <TextInput
//           placeholder="Ecrire ..."
//           style={styles.commentInput}
//           value={message}
//           onChangeText={setMessage}
//           autoFocus={true}
//           multiline={true}
//         />

//         <Pressable
//           onPress={!isButtonDisabled ? () => sendMessage() : null}
//           style={{ marginRight: 10 }}
//         >
//           <Icon
//             name="paper-plane"
//             size={26}
//             color={isButtonDisabled ? "#f0f0f0" : "purple"}
//           />
//         </Pressable>
//       </View>
//     </View>
//   );
// }

// const MessageView = ({ avatar, username, color, alignSelf, content, date }) => {
//   return (
//     <View style={[avatar ? [DStyle.flexDRow, { alignItems: "flex-end" }] : {}]}>
//       {avatar && (
//         <Pressable onPress={() => router.replace("/Profil/" + username)}>
//           <Image
//             source={{ uri: `${lien}${avatar}` }}
//             style={{
//               width: 30,
//               height: 30,
//               borderRadius: 100,
//             }}
//           />
//         </Pressable>
//       )}
//       <View
//         style={{
//           backgroundColor: color,
//           borderRadius: 10,
//           alignSelf: alignSelf,
//           padding: 10,
//           margin: 3,
//           maxWidth: 200,
//         }}
//       >
//         <Text style={{ fontSize: 14 }}>{content}</Text>
//         <Text style={{ fontSize: 9 }}>{date}</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.2)",
//   },
//   modal: {
//     backgroundColor: "white",
//     padding: 10,
//     justifyContent: "flex-end",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     height: "100%",
//   },
//   commentContainer: {
//     width: "100%",
//   },
//   commentHeader: {
//     alignItems: "center",
//     marginBottom: 20,
//     borderBottomWidth: 1,
//   },
//   commentHeaderText: {
//     fontWeight: "bold",
//     fontSize: 16,
//     alignSelf: "center",
//   },
//   commentAvatar: {
//     borderRadius: 100,
//   },
//   avatarImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 100,
//   },
//   commentValue: {
//     maxWidth: "90%",
//     minWidth: "90%",
//     marginLeft: 9,
//     borderRadius: 10,
//     backgroundColor: "#f0f0f0",
//     padding: 10,
//   },
//   commentUserName: {
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   commentDate: {
//     marginLeft: 15,
//     fontSize: 12,
//   },
//   commentSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingBottom: 7,
//     paddingTop: 5,
//     borderTopWidth: 1,
//   },
//   commentInput: {
//     flex: 1,
//     height: 37,
//     marginLeft: 1,
//     borderColor: "black",
//     borderRadius: 10,
//     paddingLeft: 8,
//   },
//   trashIcon: {
//     alignSelf: "flex-end",
//     width: 50,
//     height: 50,
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//   },
// });
