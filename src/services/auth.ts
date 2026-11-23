import { API_BASE_URL } from './api';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
  accessToken?: string;
  refreshToken?: string;
  requiresEmailConfirmation?: boolean;
}

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

async function postAuth<T>(
  endpoint: string,
  body: object
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data.message === 'string'
        ? data.message
        : 'No fue posible completar la autenticación.'
    );
  }

  return data as T;
}

export function registerUser(input: RegisterInput): Promise<AuthResponse> {
  return postAuth<AuthResponse>('register', input);
}

export function requestPasswordReset(
  email: string
): Promise<{ message: string }> {
  return postAuth<{ message: string }>('forgot-password', { email });
}

export function loginUser(input: LoginInput): Promise<AuthResponse> {
  return postAuth<AuthResponse>('login', input);
}
