import { auth } from '@/config/firebase';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const customFetch = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  const token = await auth.currentUser?.getIdToken();

  const headers: HeadersInit = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Orval generates paths like /users, /listings etc.
  // but the backend expects /api/users, /api/listings
  const response = await fetch(`${API_BASE}/api${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage: string;
    try {
      const body = await response.json();
      errorMessage =
        body.message || body.error || `Request failed: ${response.status}`;
    } catch {
      errorMessage = `Request failed: ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get('content-type');
  let data: unknown;

  if (response.status === 204 || !contentType) {
    data = undefined;
  } else if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  return { data, status: response.status, headers: response.headers } as T;
};
