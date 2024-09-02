import api from "../api";
import { Solicitacao } from "./solicitacaoModel";

export const getSolicitacoes = async (): Promise<Solicitacao[]> => {
  try {
    const response = await api.get("/Solicitacao");
    return response.data;
  } catch (error) {
    console.error("Error fetching solicitacoes", error);
    throw error;
  }
};

export const getSolicitacaoById = async (id: number): Promise<Solicitacao> => {
  try {
    const response = await api.get(`/Solicitacao/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching solicitacao with id ${id}`, error);
    throw error;
  }
};

export const createSolicitacao = async (
  solicitacao: Partial<Solicitacao>
): Promise<Solicitacao> => {
  try {
    const response = await api.post("/Solicitacao", solicitacao);
    return response.data;
  } catch (error) {
    console.error("Error creating solicitacao", error);
    throw error;
  }
};

export const updateSolicitacao = async (
  id: number,
  solicitacao: Partial<Solicitacao>
): Promise<Solicitacao> => {
  try {
    const response = await api.put(`/Solicitacao/${id}`, solicitacao);
    return response.data;
  } catch (error) {
    console.error(`Error updating solicitacao with id ${id}`, error);
    throw error;
  }
};

export const deleteSolicitacao = async (id: number): Promise<void> => {
  try {
    await api.delete(`/Solicitacao/${id}`);
  } catch (error) {
    console.error(`Error deleting solicitacao with id ${id}`, error);
    throw error;
  }
};
