
import React, { useContext, useState } from "react";

interface UserData {
  username: string;
  name: string;
}

interface AuthContextData {
  user: UserData | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const userCreds = [
  { username: "betty", password: "betty123", name: "Betty" },
  { username: "ethan", password: "ethan123", name: "Ethan" },
];

const AuthContext = React.createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);

  const login = async (username: string, password: string) => {
    const found = userCreds.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setUser({ username: found.username, name: found.name });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
