// src/contexts/AuthContext.tsx
import { User } from "@services/user/userModel";
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

  const signOut = () => {
    setUser({} as User);
  };

  const signIn = (user: User) => {
    setIsLoading(true);
    if (user) {
      setUser(user);
    }
    setIsLoading(false);
  };

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
