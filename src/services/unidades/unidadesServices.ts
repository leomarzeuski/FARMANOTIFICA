import api from "../api";
import { Unidade } from "./unidadesModel";

export const getUnidades = async (): Promise<Unidade[]> => {
  try {
    const response = await api.get("/Unidade");
    return response.data;
  } catch (error) {
    console.error("Error fetching unidades", error);
    throw error;
  }
};

export const getUnidadeById = async (id: number): Promise<Unidade> => {
  try {
    const response = await api.get(`/Unidade/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching unidade with id ${id}`, error);
    throw error;
  }
};

export const createUnidade = async (
  unidade: Partial<Unidade>
): Promise<Unidade> => {
  try {
    const response = await api.post("/Unidade", unidade);
    return response.data;
  } catch (error) {
    console.error("Error creating unidade", error);
    throw error;
  }
};

export const updateUnidade = async (
  id: number,
  unidade: Partial<Unidade>
): Promise<Unidade> => {
  try {
    const response = await api.put(`/Unidade/${id}`, unidade);
    return response.data;
  } catch (error) {
    console.error(`Error updating unidade with id ${id}`, error);
    throw error;
  }
};

export const deleteUnidade = async (id: number): Promise<void> => {
  try {
    await api.delete(`/Unidade/${id}`);
  } catch (error) {
    console.error(`Error deleting unidade with id ${id}`, error);
    throw error;
  }
};
