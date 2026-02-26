import type { User } from 'firebase/auth';
import type { UserResponse } from '@/api/model';

export interface UserContextType {
  backendUser: UserResponse | null;
  setBackendUser: (user: UserResponse | null) => void;
}

export interface AuthContextType {
  currentUser: User | null;
  loggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
}
