'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import api from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  tenantId?: string;
  subdomain?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  tenantId: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('hishabee_token');
    const savedUser = localStorage.getItem('hishabee_user');
    const savedTenant = localStorage.getItem('hishabee_tenant_id');
    if (savedToken && savedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setTenantId(savedTenant);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data;
    const tid = newUser.tenantId || newUser.subdomain || '';

    localStorage.setItem('hishabee_token', newToken);
    localStorage.setItem('hishabee_user', JSON.stringify(newUser));
    localStorage.setItem('hishabee_tenant_id', tid);

    setToken(newToken);
    setUser(newUser);
    setTenantId(tid);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('hishabee_token');
    localStorage.removeItem('hishabee_user');
    localStorage.removeItem('hishabee_tenant_id');
    setToken(null);
    setUser(null);
    setTenantId(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, tenantId, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
