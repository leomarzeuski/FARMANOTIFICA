import { HomeHeader } from "@components/HomeHeader";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Headline, Menu, Text } from "react-native-paper";
import theme from "../theme";
import { useNavigation } from "@react-navigation/native";
import { PharmacyCard } from "@components/PharmacyCard";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@routes/AuthContext";
import { Unidade } from "@services/unidades/unidadesModel";
import { getUnidades } from "@services/unidades/unidadesServices";
import { Medicamento } from "@services/medicamento/medicamentoModel";
import { getMedicamentos } from "@services/medicamento/medicamentoService";

export function Home() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [filteredUnidades, setFilteredUnidades] = useState<Unidade[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  useEffect(() => {
    // Função para buscar as unidades da API
    const fetchUnidades = async () => {
      try {
        const unidadesData = await getUnidades();
        console.log(unidadesData);
        setUnidades(unidadesData);
        setFilteredUnidades(unidadesData);
      } catch (error) {
        console.error("Erro ao buscar unidades:", error);
      }
    };

    fetchUnidades();
  }, []);

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const medicamentosData = await getMedicamentos();
        console.log(medicamentosData);
        setMedicamentos(medicamentosData);
      } catch (error) {
        console.error("Erro ao buscar medicamentos:", error);
      }
    };

    fetchMedicamentos();
  }, []);

  const handleOpenExerciseDetails = (unidade: any, medicamento: string) => {
    navigation.navigate("pharmacy", { unidade, medicamento, medicamentos });
  };

  const handleSearch = () => {
    if (selectedValue) {
      const filtered = unidades.filter((unidade) =>
        unidade.dsUnidade.toLowerCase().includes(selectedValue.toLowerCase())
      );
      setFilteredUnidades(filtered);
    } else {
      setFilteredUnidades(unidades);
    }
  };

  const handleOutsidePress = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={{ flex: 1, flexGrow: 1 }}>
        <View style={styles.container}>
          <HomeHeader userName={user?.dsNome} />
          <View style={styles.content}>
            <Headline style={styles.headline}>
              Informe o medicamento desejado
            </Headline>
            <View style={styles.selectContainer}>
              <Menu
                visible={showDropdown}
                onDismiss={() => setShowDropdown(false)}
                anchor={
                  <TouchableOpacity
                    style={styles.selectInput}
                    onPress={() => setShowDropdown(true)}
                  >
                    <Text>{selectedValue || "Selecione um medicamento"}</Text>
                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                }
              >
                {medicamentos.map((medicamento) => (
                  <Menu.Item
                    key={medicamento.cdMedicamento}
                    onPress={() => {
                      setSelectedValue(medicamento.dsMedicamento);
                      setShowDropdown(false);
                    }}
                    title={medicamento.dsMedicamento}
                  />
                ))}
              </Menu>
            </View>
            {/* <Button
              mode="contained"
              onPress={handleSearch}
              style={styles.searchButton}
            >
              Pesquisar
            </Button> */}
            <Headline style={styles.headline}>
              Escolha qual fármacia deseja para retirar seu medicamento
            </Headline>
            <FlatList
              data={filteredUnidades}
              keyExtractor={(item) => item.cdUnidade.toString()}
              renderItem={({ item }) => (
                <PharmacyCard
                  title={item.dsUnidade}
                  status={`Endereço: ${item.dsEndereco}`}
                  action={`Cidade: ${item.dsCidade}`}
                  onPress={() => handleOpenExerciseDetails(item, selectedValue)}
                />
              )}
              contentContainerStyle={styles.listContent}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headline: {
    color: theme.colors.text,
    fontSize: 18,
    marginBottom: 8,
  },
  selectContainer: {
    position: "relative",
    marginBottom: 16,
  },
  selectInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  selectText: {
    flex: 1,
    color: theme.colors.text,
  },
  selectIcon: {
    marginLeft: 8,
  },
  searchButton: {
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 350,
  },
  loadingText: {
    textAlign: "center",
    padding: 16,
    color: theme.colors.text,
  },
});
