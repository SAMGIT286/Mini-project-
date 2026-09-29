import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("memomind_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("memomind_user", JSON.stringify(user));
    else localStorage.removeItem("memomind_user");
  }, [user]);

  const login = (email, password) => {
    const nextUser = {
      id: "demo-user",
      name: "John Doe",
      email: email || "john@example.com",
      userType: "elderly",
    };
    setUser(nextUser);
  };

  const register = (data) => {
    const nextUser = {
      id: "demo-user",
      name: data.name || "John Doe",
      email: data.email || "john@example.com",
      userType: "elderly",
    };
    setUser(nextUser);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
