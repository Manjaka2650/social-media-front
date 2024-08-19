import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, View, SafeAreaView } from "react-native";
// import { mediaDevices, RTCView } from "react-native-webrtc";
import { useLocalSearchParams } from "expo-router";
import { socketLink } from "../../lien";
import DStyle from "../../components/style/style";

export default function VideoCall() {
  const { room_name, username, other_user } = useLocalSearchParams();
  const [isconnected, setIsconnected] = useState(false);
  const [peerConnection, setpeerConnection] = useState(null);
  const socket = useRef(null);

  return (
    <View
      style={[
        DStyle.flexDColumn,
        { justifyContent: "space-between", margin: 40 },
      ]}
    >
      <Text>{isconnected ? "connected" : "disconnected"}</Text>
      <Button title="Start call" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({});

//   const [username,setUsername]= useState('')
// this is for the socket handlers
//   useEffect(() => {
//     socket.current = new WebSocket(`${socketLink}/video-call/${room_name}`);
//     socket.current.onopen = () => {
//       console.log("video-call opend");
//       setIsconnected(true);
//     };
//     socket.current.onmessage = async (e) => {
//       const data = JSON.parse(e.data);
//       if (data.type == "offer") {
//         await peerConnection.setRemoteDescription(
//           new RTCSessionDescription(data.offer)
//         );
//         const answer = await peerConnection.createAnswer();
//         await peerConnection.setLocalDescription(answer);
//         socket.current.setIsconnected(
//           JSON.stringify({
//             action: "answer",
//             answer: answer,
//             to: data.from,
//           })
//         );
//       } else if (data.type == "answer") {
//         await peerConnection.setRemoteDescription(
//           new RTCSessionDescription(data.answer)
//         );
//       } else if (data.type == "ice-candidate") {
//         if (data.candidate) {
//           peerConnection.addIceCandidate(data.candidate);
//         }
//       }
//     };
//     socket.current.onclose = () => {
//       console.log("closed");
//       setIsconnected(false);
//     };
//     return () => socket.current.close();
//   }, [room_name, peerConnection]);

//   //   this is for getting media devices
//   useEffect(() => {
//     const pc = new RTCPeerConnection({
//       iceServers: [
//         {
//           urls: "stun:stun.l.google.com.19302",
//         },
//       ],
//     });

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.current.send(
//           JSON.stringify({
//             action: "ice-candidate",
//             candidate: event.candidate,
//             from: username,
//           })
//         );
//       }
//     };

//     // get the user's audio and video
//     mediaDevices
//       .getUserMedia({
//         audio: true,
//         video: true,
//       })
//       .then((stream) => {
//         stream.getTracks().forEach((track) => {
//           pc.addTrack(track, stream);
//         });
//       })
//       .catch((error) => console.log("Failed to get media:", error));
//     setpeerConnection(pc);
//   }, []);
//   const handleStartCall = async () => {
//     const offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(offer);
//     socket.current.send(
//       JSON.stringify({
//         action: "offer",
//         offer: offer,
//         from: username,
//       })
//     );
//   };
