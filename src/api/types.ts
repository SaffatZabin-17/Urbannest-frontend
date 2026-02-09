import type { User } from 'firebase/auth';

export interface BackendUser {
  userId: string;
  name: string;
  email: string;
  phone: string | null;
  profilePictureUrl: string | null;
  roleName: string;
  createdAt: string;
}

export interface UserContextType {
  backendUser: BackendUser | null;
  setBackendUser: (user: BackendUser | null) => void;
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
