import React, { useEffect, useState } from "react";
// import { Button, StyleSheet, TextInput, View } from "react-native";
// import api from "../Api";
// import Login from "../components/Login";
import { getValue } from "../components/fonction/fonction";
// import HomeScreen from "./Home";
import { Redirect, router } from "expo-router";

export default function index() {
  const [oui, setOui] = useState(null);

  useEffect(() => {
    const i = async () => {
      const token = await getValue("accessToken");

      setOui(token ? true : false);
    };
    i();
  }, []);
  if (oui === null) {
    return;
  }

  if (oui) return <Redirect href={"/Home"} />;
  // }, []);
  else return <Redirect href={"/Home"} />;
}
