// src/contexts/AuthContext.tsx
import { User } from "@services/user/userModel";
import { getUser, removeUser, saveUser } from "@storage/userStorage";
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

export type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
  isLoading: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>({} as User);
  const [isLoading, setIsLoading] = useState(false);

  const signOut = async () => {
    setUser({} as User);
    await removeUser();
  };

  const signIn = async (user: User) => {
    setIsLoading(true);
    if (user) {
      setUser(user);
      await saveUser(user);
    }
    setIsLoading(false);
  };

  const loadUser = async () => {
    const savedUser = await getUser();
    if (savedUser) {
      setUser(savedUser);
    } else {
      setUser({} as User);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    loadUser();
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, signOut, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

// hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};
