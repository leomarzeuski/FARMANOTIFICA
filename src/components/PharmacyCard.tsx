import React from "react";
import { TouchableOpacity, TouchableOpacityProps, Linking } from "react-native";
import { Card, Text, IconButton, Avatar } from "react-native-paper";
import { StyleSheet } from "react-native";
import theme from "src/theme";

type Props = TouchableOpacityProps & {
  title: string;
  status: string;
  action: string;
  isPartner?: boolean;
};

export function PharmacyCard({
  title,
  status,
  action,
  isPartner,
  ...rest
}: Props) {
  const handlePress = () => {
    if (isPartner) {
      Linking.openURL(
        "https://www.drogasil.com.br/search?w=isotretinoina+20+mg&origin=autocomplete&ranking=2&p=iso"
      );
    } else {
      rest.onPress && rest.onPress;
    }
  };

  return (
    <TouchableOpacity {...rest} style={styles.touchable} onPress={handlePress}>
      <Card style={[styles.card, isPartner && styles.partnerCard]}>
        <Card.Title
          title={title}
          titleStyle={[styles.title, isPartner && styles.partnerTitle]}
          left={(props) => (
            <Avatar.Image
              {...props}
              source={{
                uri: "https://noticiasdepaulinia.com.br/wp-content/uploads/2024/01/Farmacia-Autos-Custo-de-Paulinia.jpeg",
              }}
              size={48}
              style={styles.avatar}
            />
          )}
          right={(props) => (
            <IconButton
              {...props}
              icon="chevron-right"
              iconColor={isPartner ? "#ffffff" : theme.colors.primary}
              size={24}
            />
          )}
        />
        <Card.Content>
          <Text style={[styles.status, isPartner && styles.partnerText]}>
            {status}
          </Text>
          <Text style={[styles.action, isPartner && styles.partnerText]}>
            {action}
          </Text>
          {isPartner && (
            <Text style={styles.recommendedText}>
              Recomendado por Farmanotifica{"\n"}(Desconto Garantido!)
            </Text>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 15,
    elevation: 3,
  },
  partnerCard: {
    backgroundColor: "#00B37E",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#00B37E",
    shadowColor: "#0d0f0d",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  partnerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  avatar: {
    backgroundColor: "transparent",
  },
  status: {
    color: "#b0b0b0",
    marginTop: 8,
    fontSize: 14,
  },
  action: {
    color: "#b0b0b0",
    marginTop: 4,
    fontSize: 14,
  },
  partnerText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  recommendedText: {
    marginTop: 10,
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
});
