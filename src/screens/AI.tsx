import React, { useState, useRef } from "react";
import { SafeAreaView, StyleSheet, View, Text, FlatList } from "react-native";
import {
  Button,
  Card,
  Headline,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import { Input } from "@components/Input";
import { useAuth } from "@routes/AuthContext";
import { createPergunta, updatePergunta } from "@services/ai/aiService";
import theme from "src/theme";
import { GptQuestion } from "@services/ai/aiModel";

const IA: React.FC = () => {
  const [dsPergunta, setDsPergunta] = useState("");
  const [messages, setMessages] = useState<
    {
      sender: "user" | "ai";
      text: string;
      showFeedback?: boolean;
      loading?: boolean;
    }[]
  >([]);
  const [gptResponse, setGptResponse] = useState<GptQuestion>();
  const { user } = useAuth();

  const flatListRef = useRef<FlatList>(null);

  const handleSubmit = async () => {
    try {
      const cdUsuario = user.cdPessoa;
      const body = { cdUsuario, dsPergunta };

      setMessages((prev) => [...prev, { sender: "user", text: dsPergunta }]);

      setDsPergunta("");

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "", showFeedback: false, loading: true },
      ]);

      const result = await createPergunta(body);
      setGptResponse(result);

      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1] = {
          sender: "ai",
          text: result.dsResposta,
          showFeedback: true,
        };
        return updatedMessages;
      });

      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error creating pergunta", error);
    }
  };

  const handleThumbsUp = async () => {
    try {
      const cdPergunta = gptResponse?.cdPergunta;
      const snRespostaCorreta = "S";
      const body = { cdPergunta, snRespostaCorreta };

      await updatePergunta(body);
      console.log("Pergunta atualizada com sucesso (S)");
    } catch (error) {
      console.error("Erro ao atualizar a pergunta (S):", error);
    }
  };

  const handleThumbsDown = async () => {
    try {
      const cdPergunta = gptResponse?.cdPergunta;
      const snRespostaCorreta = "N";
      const body = { cdPergunta, snRespostaCorreta };

      await updatePergunta(body);
      console.log("Pergunta atualizada com sucesso (N)");
    } catch (error) {
      console.error("Erro ao atualizar a pergunta (N):", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Headline style={{ color: theme.colors.text }}>IA Conversa</Headline>
      </View>
      <Text style={styles.title}>Pergunte suas dúvidas à nossa IA!</Text>

      <View style={styles.messageContainer}>
        <FlatList
          ref={flatListRef} // Associa a referência ao FlatList
          data={messages}
          renderItem={({ item, index }) => (
            <>
              <View
                style={[
                  styles.messageBox,
                  item.sender === "user"
                    ? styles.userMessage
                    : styles.aiMessage,
                ]}
              >
                <Card
                  style={
                    item.sender === "user"
                      ? styles.messageCardUser
                      : styles.messageCardAi
                  }
                >
                  {item.loading ? (
                    <ActivityIndicator
                      animating={true}
                      color={theme.colors.primary}
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        color: item.sender === "user" ? "#fff" : "#000",
                      }}
                    >
                      {item.text}
                    </Text>
                  )}
                </Card>
              </View>

              {item.sender === "ai" && item.showFeedback && (
                <View style={styles.feedbackContainer}>
                  <Text style={styles.feedbackText}>
                    Essa resposta te ajudou?
                  </Text>
                  <IconButton
                    icon="thumb-up"
                    iconColor={theme.colors.primary}
                    onPress={() => handleThumbsUp()}
                  />
                  <IconButton
                    icon="thumb-down"
                    iconColor={theme.colors.error}
                    onPress={() => handleThumbsDown()}
                  />
                </View>
              )}
            </>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Input
          label="Sua pergunta"
          value={dsPergunta}
          onChangeText={setDsPergunta}
          mode="outlined"
          style={styles.input}
          width={280}
        />
        <Button mode="contained" onPress={handleSubmit}>
          Enviar
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    paddingTop: 30,
    marginBottom: 20,
    padding: 20,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    alignSelf: "center",
    marginBottom: 10,
    color: theme.colors.text,
  },
  messageContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  messageBox: {
    marginBottom: 10,
    maxWidth: "75%",
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  aiMessage: {
    alignSelf: "flex-start",
  },
  messageCardUser: {
    padding: 10,
    backgroundColor: theme.colors.primary,
    color: "#fff",
  },
  messageCardAi: {
    padding: 10,
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    padding: 10,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    gap: 10,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.footer,
  },
  feedbackContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 5,
  },
  feedbackText: {
    fontSize: 14,
    marginRight: 10,
    color: theme.colors.text,
  },
});

export default IA;
