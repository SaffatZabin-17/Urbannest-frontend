import { auth } from '@/config/firebase';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function fetchToken() {
  const token = await auth.currentUser?.getIdToken();

  return token;
}

export async function registerUserUsingEmail(data: {
  name: string;
  email: string;
  phone: string;
  nid: string;
}) {
  const token = await fetchToken();

  const response = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Registration failed: ${response.status}`);
  }

  return response.json();
}

export async function registerUserUsingGoogle() {
  const token = await fetchToken();

  const response = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Google registration failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchCurrentUser() {
  const token = await fetchToken();

  const response = await fetch(`${API_BASE}/api/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }

  return response.json();
}

export async function updateUser(data: {
  name?: string;
  phone?: string;
  nid?: string;
  profilePictureUrl?: string;
}) {
  const token = await fetchToken();
  const response = await fetch(`${API_BASE}/api/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Update failed: ${response.status}`);
  }
  return response.json();
}

export async function getPresignedUploadUrl(data: {
  fileName: string;
  contentType: string;
  category: string;
}) {
  const token = await fetchToken();

  const response = await fetch(`${API_BASE}/api/s3/upload-request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to get presigned upload URL: ${response.status}`);
  }

  return response.json();
}

export async function getPresignedPreviewUrl(key: string) {
  const token = await fetchToken();
  const response = await fetch(
    `${API_BASE}/api/s3/download-url?key=${encodeURIComponent(key)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get presigned preview URL: ${response.status}`);
  }

  return response.text();
}
