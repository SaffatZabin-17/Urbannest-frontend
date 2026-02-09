import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';
import type { UserContextType } from '@/api/types';

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
