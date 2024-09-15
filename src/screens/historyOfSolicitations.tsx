import React, { useEffect, useState } from "react";
import {
  View,
  SectionList,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from "react-native";
import {
  Card,
  Button,
  Title,
  Paragraph,
  Modal,
  Portal,
  Provider as PaperProvider,
  Text,
  Chip,
  Menu,
} from "react-native-paper";
import { ScreenHeader } from "@components/ScreenHeader";
import theme from "src/theme";
import { getUserSolicitacaoById } from "@services/solicitacoes/solicitacaoService";
import { useAuth } from "@routes/AuthContext";
import * as DocumentPicker from "expo-document-picker";

export const Solicitation = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBula, setSelectedBula] = useState(null);
  const [showModalReenviar, setShowModalReenviar] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [file, setFile] = useState<any>(null);
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        const response = await getUserSolicitacaoById(user.cdPessoa);
        const formattedMedications = formatSolicitacoes(response);
        setMedications(formattedMedications);
      } catch (error) {
        console.error("Erro ao buscar solicitações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitacoes();
  }, []);

  const formatSolicitacoes = (solicitacoes: any) => {
    return solicitacoes.map((solicitacao: any) => ({
      title: `Solicitação de ${solicitacao.dtSolicitacao.slice(0, 10)}`,
      data: solicitacao.fnSolicitacaoItens.map((item: any) => ({
        id: item.cdSolicitacaoItens,
        medicamento:
          item.cdUnidadeMedicamentoNavigation.cdMedicamentoNavigation
            .dsMedicamento,
        dosagem:
          item.cdUnidadeMedicamentoNavigation.cdMedicamentoNavigation.dsDosagem,
        fabricante:
          item.cdUnidadeMedicamentoNavigation.cdMedicamentoNavigation
            .dsFabricante,
        status: solicitacao.cdStatusNavigation.dsStatus,
        observacao:
          item.cdUnidadeMedicamentoNavigation.cdMedicamentoNavigation
            .dsObservacao,
        bula: item.cdUnidadeMedicamentoNavigation.cdMedicamentoNavigation
          .urlBula,
        data: solicitacao.dtSolicitacao.slice(0, 10),
      })),
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "em análise":
        return "#FFA500";
      case "retirado":
        return "#32CD32";
      case "reenviar":
        return "#FF4500";
      case "agendar":
        return "#1E90FF";
      default:
        return "#000000";
    }
  };

  const handleCardPress = (item: any) => {
    if (item.status.toLowerCase() === "reenviar") {
      setShowModalReenviar(true);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (!result.canceled) {
        const { uri, name } = result.assets[0];
        setSelectedFileName(name);
        setFile({ uri, name });
      }
    } catch (error) {
      console.error("Erro ao selecionar documento:", error);
    }
  };

  // Function to filter medications by selected status
  const filterMedications = () => {
    if (!selectedStatus) {
      return medications;
    }
    return medications
      .map((section: any) => ({
        ...section,
        data: section.data.filter((item: any) =>
          item.status.toLowerCase().includes(selectedStatus.toLowerCase())
        ),
      }))
      .filter((section) => section.data.length > 0);
  };

  return (
    <PaperProvider theme={theme}>
      <ScreenHeader title="Histórico de Medicamentos" />

      <View style={styles.filterContainer}>
        <Menu
          visible={visibleMenu}
          onDismiss={() => setVisibleMenu(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setVisibleMenu(true)}
              style={styles.menuButton}
            >
              Filtrar por Status
            </Button>
          }
        >
          <Menu.Item
            onPress={() => {
              setSelectedStatus("");
              setVisibleMenu(false);
            }}
            title="Todos"
          />
          <Menu.Item
            onPress={() => {
              setSelectedStatus("em análise");
              setVisibleMenu(false);
            }}
            title="Em Análise"
          />
          <Menu.Item
            onPress={() => {
              setSelectedStatus("retirado");
              setVisibleMenu(false);
            }}
            title="Retirado"
          />
          <Menu.Item
            onPress={() => {
              setSelectedStatus("reenviar");
              setVisibleMenu(false);
            }}
            title="Reenviar"
          />
          <Menu.Item
            onPress={() => {
              setSelectedStatus("agendar");
              setVisibleMenu(false);
            }}
            title="Agendar"
          />
        </Menu>
      </View>

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : filterMedications().length > 0 ? (
          <SectionList
            sections={filterMedications()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card style={styles.card} onPress={() => handleCardPress(item)}>
                <Card.Title
                  title={item.medicamento}
                  titleStyle={styles.title}
                />
                <Card.Content>
                  <Paragraph style={styles.paragraph}>
                    Dosagem: {item.dosagem}
                  </Paragraph>
                  <Paragraph style={styles.paragraph}>
                    Fabricante: {item.fabricante}
                  </Paragraph>
                  <Chip
                    style={[
                      styles.status,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                  >
                    {item.status}
                  </Chip>
                  {item.observacao && (
                    <Paragraph style={styles.paragraph}>
                      Obs: {item.observacao}
                    </Paragraph>
                  )}
                  {item.bula && (
                    <Button
                      mode="text"
                      onPress={() => {
                        Linking.openURL(item.bula); // Use Linking para abrir o URL da bula
                      }}
                    >
                      Ver Bula
                    </Button>
                  )}
                </Card.Content>
              </Card>
            )}
            renderSectionHeader={({ section }) => (
              <Title style={styles.sectionHeader}>{section.title}</Title>
            )}
            contentContainerStyle={
              medications.length === 0 && { flex: 1, justifyContent: "center" }
            }
            ListEmptyComponent={() => (
              <Paragraph style={styles.emptyText}>
                Não há registros de medicamentos ainda. {"\n"}
                Vamos adicionar alguns?
              </Paragraph>
            )}
          />
        ) : (
          <Paragraph style={styles.emptyText}>
            Não há registros de medicamentos ainda.
          </Paragraph>
        )}

        {/* Modal para exibir a bula */}
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => setModalVisible(false)}
          >
            <Card style={styles.modalCard}>
              <Card.Title title="Bula do Medicamento" />
              <Card.Content>
                <Paragraph style={styles.paragraph}>
                  {selectedBula ? (
                    <Text onPress={() => Linking.openURL(selectedBula)}>
                      Clique aqui para visualizar a bula.
                    </Text>
                  ) : (
                    "Bula não disponível."
                  )}
                </Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button mode="contained" onPress={() => setModalVisible(false)}>
                  Fechar
                </Button>
              </Card.Actions>
            </Card>
          </Modal>

          {/* Modal para Reenviar documento */}
          <Modal
            visible={showModalReenviar}
            onDismiss={() => setShowModalReenviar(false)}
          >
            <Card style={styles.modalCard}>
              <Card.Title title="Atenção!" />
              <Card.Content>
                <Paragraph>Carregue seu laudo médico:</Paragraph>
                <Paragraph>Arquivo - {selectedFileName}</Paragraph>
              </Card.Content>
              <Card.Actions style={styles.modalActions}>
                <Button mode="contained" onPress={pickDocument}>
                  Carregar Laudo
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => setShowModalReenviar(false)}
                >
                  Voltar
                </Button>
              </Card.Actions>
            </Card>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.background,
  },
  sectionHeader: {
    color: theme.colors.text,
    fontSize: 18,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  card: {
    marginBottom: 10,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  paragraph: {
    fontSize: 16,
  },
  status: {
    marginTop: 10,
    alignSelf: "flex-start",
    color: "#fff",
  },
  modalCard: {
    margin: 16,
    padding: 16,
  },
  modalActions: {
    justifyContent: "space-between",
  },
  emptyText: {
    color: theme.colors.text,
    textAlign: "center",
    margin: 16,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  menuButton: {
    alignSelf: "center",
  },
});
