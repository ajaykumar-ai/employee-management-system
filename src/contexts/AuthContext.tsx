import React, { createContext, useContext, useCallback, useMemo, useState, ReactNode } from 'react';
import type { Role } from '../types/hr';
import { EMPLOYEES, TEAMS } from '../data/mock';

export type AuthUser =
  | {
      role: 'owner';
      id: 'owner';
      name: string;
    }
  | {
      role: 'team_lead' | 'employee';
      id: string; // employeeId
      name: string;
      teamId: string;
      teamName: string;
    };

// Define the type for the context state
interface AuthContextType {
  user: AuthUser | null;
  loginAs: (role: Role) => void;
  loginAsEmployee: (employeeId: string) => void;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem('ems.auth.v1');
      if (!raw) return null;
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  });

  const persist = (next: AuthUser | null) => {
    if (!next) localStorage.removeItem('ems.auth.v1');
    else localStorage.setItem('ems.auth.v1', JSON.stringify(next));
  };

  const loginAs: AuthContextType['loginAs'] = useCallback((role) => {
    if (role === 'owner') {
      const next: AuthUser = { role: 'owner', id: 'owner', name: 'Owner (Admin)' };
      setUser(next);
      persist(next);
      return;
    }
    const fallback = EMPLOYEES.find((e) => e.role === role);
    if (!fallback) return;
    const next: AuthUser = {
      role: fallback.role,
      id: fallback.id,
      name: fallback.name,
      teamId: fallback.teamId,
      teamName: TEAMS[fallback.teamId] ?? fallback.teamId,
    };
    setUser(next);
    persist(next);
  }, []);

  const loginAsEmployee: AuthContextType['loginAsEmployee'] = useCallback((employeeId) => {
    const emp = EMPLOYEES.find((e) => e.id === employeeId);
    if (!emp) return;
    const next: AuthUser = {
      role: emp.role,
      id: emp.id,
      name: emp.name,
      teamId: emp.teamId,
      teamName: TEAMS[emp.teamId] ?? emp.teamId,
    };
    setUser(next);
    persist(next);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persist(null);
  }, []);

  return (
    <AuthContext.Provider
      value={useMemo(() => ({ user, loginAs, loginAsEmployee, logout }), [user, loginAs, loginAsEmployee, logout])}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};