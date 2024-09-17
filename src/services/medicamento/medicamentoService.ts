import { Medicamento } from "./medicamentoModel";
import api from "../api";

export const getMedicamentos = async (): Promise<Medicamento[]> => {
  try {
    const response = await api.get("/Medicamento");
    return response.data;
  } catch (error) {
    console.error("Error fetching medicamentos", error);
    throw error;
  }
};

export const getMedicamentoById = async (id: number): Promise<Medicamento> => {
  try {
    const response = await api.get(`/Medicamento/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching medicamento with id ${id}`, error);
    throw error;
  }
};

export const getMedicamentoUnidadeById = async (
  id: number
): Promise<Medicamento> => {
  try {
    const response = await api.get(`/MedicamentoUnidade/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching medicamento with id ${id}`, error);
    throw error;
  }
};

export const createMedicamento = async (
  medicamento: Partial<Medicamento>
): Promise<Medicamento> => {
  try {
    const response = await api.post("/Medicamento", medicamento);
    return response.data;
  } catch (error) {
    console.error("Error creating medicamento", error);
    throw error;
  }
};

export const updateMedicamento = async (
  id: number,
  medicamento: Partial<Medicamento>
): Promise<Medicamento> => {
  try {
    const response = await api.put(`/Medicamento/${id}`, medicamento);
    return response.data;
  } catch (error) {
    console.error(`Error updating medicamento with id ${id}`, error);
    throw error;
  }
};

export const deleteMedicamento = async (id: number): Promise<void> => {
  try {
    await api.delete(`/Medicamento/${id}`);
  } catch (error) {
    console.error(`Error deleting medicamento with id ${id}`, error);
    throw error;
  }
};
