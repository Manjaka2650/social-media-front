import React, { useState } from "react";
import { View, Button, ActivityIndicator, StyleSheet } from "react-native";
import { Audio } from "expo-av";

const AudioPlayer = ({ uri }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function playSound() {
    if (!uri) return;

    setIsLoading(true);

    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      setSound(sound);
      setIsPlaying(true);
      await sound.playAsync();
      setIsPlaying(false);
      setSound(null);
    } catch (error) {
      console.error("Error playing sound", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function stopSound() {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setSound(null);
    }
  }

  return (
    <View style={styles.audioContainer}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <Button
          title={isPlaying ? "Stop" : "Play"}
          onPress={isPlaying ? stopSound : playSound}
          color={isPlaying ? "red" : "green"}
        />
      )}
    </View>
  );
};

const renderMessageAudio = (props) => {
  const { currentMessage } = props;

  if (currentMessage.audio) {
    return <AudioPlayer uri={currentMessage.audio} />;
  }

  return null;
};

const styles = StyleSheet.create({
  audioContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
  },
});
