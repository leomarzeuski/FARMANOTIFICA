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
import {
  getMedicamentos,
  getMedicamentoUnidadeById,
} from "@services/medicamento/medicamentoService";
import { HomeHeader } from "@components/HomeHeader";

export function Home() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [filteredUnidades, setFilteredUnidades] = useState<Unidade[]>([]);
  const [selectedValue, setSelectedValue] = useState<any>();
  const [showDropdown, setShowDropdown] = useState(false);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const { user } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();
  const [newUnidadeMedicamentoValue, setNewUnidadeMedicamentoValue] =
    useState<any>();

  console.log({ newUnidadeMedicamentoValue });

  const partnerPharmacies = [
    {
      cdUnidade: 9991,
      dsUnidade: "Drogasil",
      dsEndereco: "Rua dos Marechal, 547",
      dsCidade: "São Paulo",
      isPartner: true,
    },
  ];

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const unidadesData = await getUnidades();
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
        setMedicamentos(medicamentosData);
      } catch (error) {
        console.error("Erro ao buscar medicamentos:", error);
      }
    };

    fetchMedicamentos();
  }, []);

  useEffect(() => {
    const fetchMedicamentosUnidade = async () => {
      try {
        if (selectedValue !== undefined) {
          const medicamentosUnidadeData = await getMedicamentoUnidadeById(
            selectedValue.cdMedicamento
          );
          setNewUnidadeMedicamentoValue(medicamentosUnidadeData);
        }
      } catch (error) {
        console.error("Erro ao buscar medicamentos:", error);
      }
    };

    fetchMedicamentosUnidade();
  }, [selectedValue]);

  const handleOpenExerciseDetails = (
    unidade: any,
    medicamento: string,
    unidadeMedicamento: number
  ) => {
    navigation.navigate("pharmacy", {
      unidade,
      medicamento,
      medicamentos,
      unidadeMedicamento,
    });
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
                    <Text>
                      {selectedValue?.dsMedicamento ||
                        "Selecione um medicamento"}
                    </Text>
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
                      setSelectedValue(medicamento);
                      setShowDropdown(false);
                      setFilteredUnidades([...partnerPharmacies, ...unidades]);
                    }}
                    title={medicamento?.dsMedicamento}
                  />
                ))}
              </Menu>
            </View>
            {selectedValue && (
              <>
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
                      onPress={() =>
                        handleOpenExerciseDetails(
                          item,
                          selectedValue?.dsMedicamento,
                          newUnidadeMedicamentoValue[0]?.cdUnidadeMedicamento
                        )
                      }
                      isPartner={item.isPartner}
                    />
                  )}
                  contentContainerStyle={styles.listContent}
                />
              </>
            )}
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
  listContent: {
    paddingBottom: 350,
  },
});
