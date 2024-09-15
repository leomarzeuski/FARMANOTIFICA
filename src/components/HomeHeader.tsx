import React from "react";
import { Headline, Text, IconButton } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import theme from "src/theme";
import { Row } from "./Row";
import { UserPhoto } from "./UserPhoto";
import { useAuth } from "@routes/AuthContext";

interface homeHeaderProps {
  userName: string | undefined;
}

export const HomeHeader: React.FC<homeHeaderProps> = ({ userName }) => {
  const { signOut, user } = useAuth();
  const photo = user.urlFoto ? user.urlFoto : "";

  const handleLogout = () => {
    signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <UserPhoto uri={photo} />
        <View style={styles.textcontainer}>
          <Text style={styles.greetingText}>Olá,</Text>
          <Headline style={styles.headline}>{userName}</Headline>
        </View>
        <IconButton
          icon="logout"
          iconColor={theme.colors.primary}
          size={28}
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 30,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  textcontainer: {
    marginLeft: 10,
  },
  greetingText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
  },
  headline: {
    fontWeight: "bold",
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
  },
  logoutButton: {
    marginLeft: "auto",
  },
});
