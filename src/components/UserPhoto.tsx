import React from "react";
import { Avatar } from "react-native-paper";
import { Image, StyleSheet } from "react-native";
import DefaultImage from "@assets/userPhotoDefault.png";

type Props = {
  size?: number;
  uri?: string;
};

export function UserPhoto({ size = 50, uri }: Props) {
  const imageSource = uri ? { uri } : DefaultImage;

  return (
    <Avatar.Image size={size} source={imageSource} style={styles.avatar} />
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 50,
  },
});
