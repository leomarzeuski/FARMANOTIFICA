import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@services/user/userModel";
import { USER_STORAGE } from "./storageKeys";

export const saveUser = async (user: User) => {
  try {
    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving data", error);
  }
};

export const getUser = async () => {
  try {
    const userString = await AsyncStorage.getItem(USER_STORAGE);

    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  } catch (error) {
    console.error("Error retrieving data", error);
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_STORAGE);
  } catch (error) {
    console.error("Error removing data", error);
  }
};
