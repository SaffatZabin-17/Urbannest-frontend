/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getCurrentUser } from '@/api/generated';
import type { UserResponse } from '@/api/model';
import type { UserContextType } from '@/api/types';

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export function UserProvider({ children }: { children: ReactNode }) {
  const [backendUser, setBackendUser] = useState<UserResponse | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser || backendUser) return;

    let ignore = false;

    getCurrentUser()
      .then((res) => {
        if (!ignore) setBackendUser(res.data);
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
