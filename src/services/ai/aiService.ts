import apiJson from "@services/apiForJson";
import { GptQuestion } from "./aiModel";

export const getPerguntas = async (): Promise<GptQuestion[]> => {
  try {
    const response = await apiJson.get("/Gpt");
    return response.data;
  } catch (error) {
    console.error("Error fetching perguntas", error);
    throw error;
  }
};

export const getPerguntaById = async (id: number): Promise<GptQuestion> => {
  try {
    const response = await apiJson.get(`/Gpt/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pergunta with id ${id}`, error);
    throw error;
  }
};

export const createPergunta = async (
  pergunta: Partial<GptQuestion>
): Promise<GptQuestion> => {
  try {
    const response = await apiJson.post("/Gpt", pergunta);
    console.log(response.data, pergunta);
    return response.data;
  } catch (error) {
    console.error("Error creating pergunta", error);
    throw error;
  }
};

export const updatePergunta = async (
  pergunta: Partial<GptQuestion>
): Promise<GptQuestion> => {
  try {
    const response = await apiJson.put(`/Gpt`, pergunta);
    return response.data;
  } catch (error) {
    console.error(`Error updating pergunta with id`, error);
    throw error;
  }
};
