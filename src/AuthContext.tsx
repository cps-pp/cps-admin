import React, { createContext, useState, useContext, useEffect } from 'react';

type Role = 'admin' | 'superadmin' | null;
interface AuthContextType {
  role: Role;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ role: null, login: () => false, logout: () => {} });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role') as Role;
    if (storedRole) setRole(storedRole);
  }, []);

  const mockUsers = [
    { username: 'admin', password: 'admin123', role: 'admin' as Role },
    { username: 'superadmin', password: 'super1234', role: 'superadmin' as Role },
  ];

  const login = (username: string, password: string) => {
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
      setRole(user.role);
      localStorage.setItem('role', user.role!);
      return true;
    }
    return false;
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
