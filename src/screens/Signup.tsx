import BackgroundImg from "@assets/background4.png";
import { Image, View, StyleSheet, Text, ToastAndroid } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "src/theme";
import { Headline } from "react-native-paper";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";
import { Layout } from "@components/Layout";
import { useForm, Controller } from "react-hook-form";
import userService from "@services/user/userService";

export function SignUp() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function handleGoBack() {
    navigation.navigate("signIn");
  }

  const onSubmit = async (data: any) => {
    let body = {
      urlFoto: "123123",
      cdPessoa: 0,
    };

    try {
      const response = await userService.createUser({ ...data, ...body });
      console.log(response);
      ToastAndroid.show("Usuário cadastrado com sucesso!", ToastAndroid.SHORT);
      console.log(data);
    } catch (error) {
      ToastAndroid.show("Usuário nao cadastrado!", ToastAndroid.SHORT);
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          resizeMode="cover"
          style={{ position: "absolute", width: "100%" }}
        />
        <View style={styles.center}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="pill"
              size={40}
              color={theme.colors.primary}
            />
            <Text style={styles.title}>FarmaNotifica</Text>
          </View>
          <Text style={styles.subtitle}>
            Consulte e agende seus medicamentos de forma rápida e prática!
          </Text>
        </View>
        <Headline style={{ color: theme.colors.text }}>
          Acesse sua conta
        </Headline>
        <Controller
          control={control}
          name="dsNome"
          rules={{ required: "Nome é obrigatório" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Nome"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.dsNome}
              errorMessage={errors.dsNome ? errors.dsNome.message : ""}
            />
          )}
        />

        <Controller
          control={control}
          name="dsEmail"
          rules={{
            required: "E-mail é obrigatório",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "E-mail inválido",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.dsEmail}
              errorMessage={errors.dsEmail ? errors.dsEmail.message : ""}
            />
          )}
        />

        <Controller
          control={control}
          name="nrCpf"
          rules={{ required: "Cpf Obrigatório" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="CPF"
              keyboardType="number-pad"
              maxLength={11}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.nrCpf}
              errorMessage={errors.nrCpf ? errors.nrCpf.message : ""}
            />
          )}
        />

        <Controller
          control={control}
          name="dsSenha"
          rules={{ required: "Senha é obrigatória" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Senha"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.dsSenha}
              errorMessage={errors.dsSenha ? errors.dsSenha.message : ""}
            />
          )}
        />

        <Button title="Criar e Acessar" onPress={handleSubmit(onSubmit)} />

        <View style={styles.createAccount}>
          <Button
            onPress={handleGoBack}
            title="Voltar para login"
            variant="outlined"
          />
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 10,
  },
  center: {
    marginVertical: 80,
    maxWidth: 250,
  },
  iconContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.sm,
    textAlign: "center",
  },
  createAccount: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 80,
  },
});
