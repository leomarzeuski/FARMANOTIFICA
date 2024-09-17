import React, { useState } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import {
  Text,
  Card,
  IconButton,
  Button,
  Menu,
  Title,
  Modal,
  Portal,
  Provider,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "src/theme";
import { useAuth } from "@routes/AuthContext";

export const PharmacyDetails = () => {
  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const route = useRoute<any>();
  const { unidade, medicamento, medicamentos, unidadeMedicamento } =
    route.params;
  const selectedMedication = medicamento;
  const additionalInformation = medicamentos.find(
    (med: any) => med.dsMedicamento === selectedMedication
  );

  const [modalVisible, setModalVisible] = useState(false);

  function handleGoBack() {
    navigation.goBack();
  }

  console.log({ medicamentos, unidadeMedicamento });

  function handleReserve() {
    if (selectedMedication) {
      navigation.navigate("history", {
        medication: selectedMedication ?? "",
        medicamentos: unidadeMedicamento ?? [],
        cdPessoa: user.cdPessoa,
      });
    } else {
      alert("Por favor, selecione um medicamento.");
    }
  }

  function handleOpenMaps() {
    const url = `https://www.google.com/maps/search/?api=1&query=${unidade.dsCidade},${unidade.dsEndereco}`;
    Linking.openURL(url);
  }

  function handleOpenModal() {
    setModalVisible(true);
  }

  function handleCloseModal() {
    setModalVisible(false);
  }

  return (
    <Provider>
      <View style={styles.container}>
        <Card
          style={[styles.header, { backgroundColor: theme.colors.surface }]}
        >
          <TouchableOpacity onPress={handleGoBack}>
            <IconButton
              icon="arrow-left"
              iconColor={theme.colors.primary}
              size={24}
              onPress={handleGoBack}
            />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{unidade.dsUnidade}</Text>
            <View style={styles.headerAddress}>
              <MaterialCommunityIcons
                name="hospital-building"
                size={18}
                color={theme.colors.text}
              />
              <Text style={styles.headerAddressText}>{unidade.dsEndereco}</Text>
            </View>
          </View>
        </Card>
        <ScrollView contentContainerStyle={styles.content}>
          <Title style={styles.centeredTitle}>{unidade.dsUnidade}</Title>
          <Image
            source={{
              uri: "https://noticiasdepaulinia.com.br/wp-content/uploads/2024/01/Farmacia-Autos-Custo-de-Paulinia.jpeg",
            }}
            style={styles.image}
            resizeMode="cover"
          />
          <Card
            style={[
              styles.detailsCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View style={styles.detailsContainer}>
              <View style={styles.detailsItem}>
                <MaterialCommunityIcons
                  name="city"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.detailsText}>
                  Cidade: {unidade.dsCidade}
                </Text>
              </View>
              <View style={styles.detailsItem}>
                <MaterialCommunityIcons
                  name="domain"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.detailsText}>UF: {unidade.dsUf}</Text>
              </View>
              <View style={styles.detailsItem}>
                <MaterialCommunityIcons
                  name="identifier"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.detailsText}>CNPJ: {unidade.dsCnpj}</Text>
              </View>
              <View style={styles.detailsItem}>
                <MaterialCommunityIcons
                  name="clipboard-text"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.detailsText}>
                  {selectedMedication || "Nenhum Medicamento Selecionado!"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.detailsItem}
                onPress={handleOpenModal}
              >
                <MaterialCommunityIcons
                  name="pill"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.clickableText}>Leia a Bula aqui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleOpenMaps}
                style={styles.detailsItem}
              >
                <MaterialCommunityIcons
                  name="map-marker"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.detailsText}>Localização</Text>
              </TouchableOpacity>
              <Button
                mode="contained"
                onPress={handleReserve}
                style={styles.button}
              >
                Quero reservar!
              </Button>
            </View>
          </Card>
        </ScrollView>

        {/* Modal para exibir informações do medicamento */}
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={handleCloseModal}
            contentContainerStyle={styles.modalContainer}
          >
            <View>
              {additionalInformation ? (
                <>
                  <Title>{additionalInformation.dsMedicamento}</Title>
                  <Text>Dosagem: {additionalInformation.dsDosagem}</Text>
                  <Text>Fabricante: {additionalInformation.dsFabricante}</Text>
                  <Text>Observação: {additionalInformation.dsObservacao}</Text>
                  <Text>
                    Registro ANVISA:{" "}
                    {additionalInformation.dsCodigoRegistroAnvisa}
                  </Text>
                  <Text>
                    Grupo Financiamento:{" "}
                    {additionalInformation.dsGrupoFinanciamento || "N/A"}
                  </Text>
                  <Text>CID: {additionalInformation.dsCid}</Text>
                  <Text>
                    Ativo:{" "}
                    {additionalInformation.snAtivo === "S" ? "Sim" : "Não"}
                  </Text>
                  <Text
                    style={styles.clickableText}
                    onPress={() =>
                      Linking.openURL(
                        additionalInformation.urlBula ||
                          "Não disponível até o momento."
                      )
                    }
                  >
                    Para ler a bula completa, clique aqui.
                  </Text>
                  <Button onPress={handleCloseModal}>Fechar</Button>
                </>
              ) : (
                <Text>Nenhuma informação adicional disponível.</Text>
              )}
            </View>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerContent: {
    marginLeft: 16,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  headerAddress: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  headerAddressText: {
    marginLeft: 4,
    color: theme.colors.text,
  },
  content: {
    padding: 16,
  },
  centeredTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: theme.colors.primary,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailsCard: {
    padding: 16,
    borderRadius: 8,
  },
  detailsContainer: {
    marginTop: 16,
  },
  detailsItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailsText: {
    marginLeft: 8,
    color: theme.colors.text,
  },
  button: {
    marginTop: 16,
    width: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  selectInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  clickableText: {
    color: theme.colors.primary,
    textDecorationLine: "underline",
  },
});
