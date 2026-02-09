import { auth } from '@/config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from 'firebase/auth';

export async function login(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function register(email: string, password: string) {
  await createUserWithEmailAndPassword(auth, email, password);
}

export async function googleLogin() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

export async function logout() {
  await signOut(auth);
}
