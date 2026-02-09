/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { fetchCurrentUser } from '@/api/endpoints';
import type { BackendUser, UserContextType } from '@/api/types';

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export function UserProvider({ children }: { children: ReactNode }) {
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser || backendUser) return;

    let ignore = false;

    fetchCurrentUser()
      .then((data) => {
        if (!ignore) setBackendUser(data);
      })
      .catch(() => {});

    return () => {
      ignore = true;
    };
  }, [currentUser, backendUser]);

  const value: UserContextType = {
    backendUser: currentUser ? backendUser : null,
    setBackendUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
