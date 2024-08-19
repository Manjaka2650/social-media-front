import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Nav from "../components/Navigation";
import {
  getAllMessages,
  getAllNotification,
  getValue,
} from "../components/fonction/fonction";
import api from "../Api";
import DStyle from "../components/style/style";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import lien from "../lien";
import { router } from "expo-router";
import AwaitScreen from "../components/awaitScreen";
import HeaderGlimer from "../components/HeaderGlimer";
import Navigation from "../components/Navigation";

const Notification = () => {
  const [username, setUsername] = useState("");
  const [awaitsc, setAwaitsc] = useState(false);
  const [data, setData] = useState([]);
  // const [messageN, setMessageN] = useState(0);
  // const [notifN, setNotifN] = useState(0);
  // const filterMesage = () => {
  //   const f = d.filter(
  //     (element) =>
  //       element.last_message.is_read == false &&
  //       element.last_message.sender != username
  //   );
  //   console.log("f.length", f.length);
  //   setMessageN(f.length);
  // };
  // const [u, setUserMessaged] = useState([]);
  // const [m, setMesageLoading] = useState(false);
  // const [d, setD] = useState([]);
  useEffect(() => {
    // getAllMessages(setD, setUserMessaged, setMesageLoading);
    // filterMesage();
    getAllNotification(setData);
    // setMessageN(data.length);
  }, [data]);

  const formateDate = (date) => {
    var fd = new Date(date);
    return formatDistanceToNow(date, { locale: fr });
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        <Header />
      </View>
      <View style={{ margin: 1, flex: 1 }}>
        <ScrollView style={styles.scrollStyle1}>
          {data &&
            data.map((value) => (
              <View
                key={value.id}
                style={[
                  styles.boxmessage1,
                  { backgroundColor: !value.is_read ? "#E5E5EA" : "white" },
                ]}
              >
                <Notif
                  user={value.sender.username}
                  notif={value.content}
                  image={`${lien}${value.sender.avatar}`}
                  heure={formateDate(value.created_at)}
                  post={value.post}
                  isRead={value.is_read}
                  id={value.id}
                  setAwaitsc={setAwaitsc}
                />
              </View>
            ))}
        </ScrollView>
        {awaitsc && (
          <AwaitScreen onClose={() => setAwaitsc(false)} visible={awaitsc} />
        )}
      </View>
      <Nav />
    </View>
  );
};

export default Notification;

const Notif = ({ user, notif, image, heure, post, isRead, id, setAwaitsc }) => {
  const setReadnotif = async () => {
    if (!isRead) {
      try {
        const token = await getValue("accessToken");
        const response = await api.post(
          "/message/setread-notif/" + id + "/",
          {},

          { headers: { Authorization: "Token " + token } }
        );
        console.log(response.status);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Pressable
      onPress={async () => {
        setAwaitsc(true);
        await setReadnotif();
        setAwaitsc(false);
        router.push("/PostScreens/?postId=" + post);
      }}
    >
      <View
        style={[
          styles.boxmessage,
          { backgroundColor: isRead ? "white" : "#E5E5EA" },
        ]}
      >
        <View>
          <Image
            source={{ uri: image }}
            style={{ width: 50, height: 50, borderRadius: 100 }}
          />
        </View>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.boldtext}>{user}</Text>
          <Text>{notif}</Text>
          <View style={[DStyle.flexDRow, { justifyContent: "space-between" }]}>
            <View></View>
            <Text style={{ marginRight: 7, fontSize: 12 }}>{heure}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  scrollStyle1: {
    backgroundColor: "whitesmoke",
    flex: 1,
  },
  scrollStyle: {
    gap: 10,
    backgroundColor: "white",
    flex: 1,
  },
  boxmessage1: {
    borderRadius: 10,
    flex: 1,
    marginTop: 7,
    marginLeft: 7,
    marginRight: 7,
  },
  boxmessage: {
    borderRadius: 10,
    flex: 1,
    margin: 15,
    display: "flex",
    flexDirection: "row",
  },
  boldtext: {
    fontWeight: "bold",
  },
});
