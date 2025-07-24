'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string | null;
  status: string;
  role: string;
  created: string;
  createdAt: string;
  referral: boolean;
  enable2FA: boolean;
  accessToken?: string; // Optional, for authenticated requests
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, initialUser }: { children: ReactNode; initialUser: User | null }) {
  const [user, setUser] = useState<User | null>(initialUser);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
