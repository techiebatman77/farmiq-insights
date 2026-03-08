import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthUser {
  email: string;
  name: string;
  farm: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string, name: string, farm: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const DEMO_USER = { email: 'anandu@farms.kerala', password: 'password123', name: 'Anandu A', farm: 'Kerala Green Farms' };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('agrismart_user');
    if (stored) setUser(JSON.parse(stored));
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    // Check demo user
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const u = { email: DEMO_USER.email, name: DEMO_USER.name, farm: DEMO_USER.farm };
      setUser(u);
      localStorage.setItem('agrismart_user', JSON.stringify(u));
      return true;
    }
    // Check registered users
    const users = JSON.parse(localStorage.getItem('agrismart_users') || '[]');
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (found) {
      const u = { email: found.email, name: found.name, farm: found.farm };
      setUser(u);
      localStorage.setItem('agrismart_user', JSON.stringify(u));
      return true;
    }
    return false;
  };

  const signup = (email: string, password: string, name: string, farm: string): boolean => {
    const users = JSON.parse(localStorage.getItem('farmiq_users') || '[]');
    if (users.some((u: any) => u.email === email) || email === DEMO_USER.email) return false;
    users.push({ email, password, name, farm });
    localStorage.setItem('farmiq_users', JSON.stringify(users));
    const u = { email, name, farm };
    setUser(u);
    localStorage.setItem('farmiq_user', JSON.stringify(u));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('farmiq_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
