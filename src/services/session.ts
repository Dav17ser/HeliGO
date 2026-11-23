import * as SecureStore from 'expo-secure-store';
import type { AuthUser } from './auth';

export type Session = {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
};

// Se guardan en claves separadas: SecureStore limita el tamaño de cada valor.
const ACCESS_TOKEN_KEY = 'heligo.accessToken';
const REFRESH_TOKEN_KEY = 'heligo.refreshToken';
const USER_KEY = 'heligo.user';

const EXPIRY_MARGIN_SECONDS = 30;

// Lee el campo exp (segundos) del JWT. Devuelve null si no se puede interpretar.
function getTokenExpiry(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const exp = JSON.parse(atob(padded)).exp;

    return typeof exp === 'number' ? exp : null;
  } catch {
    return null;
  }
}

function isTokenUsable(token: string): boolean {
  const exp = getTokenExpiry(token);
  return exp !== null && exp > Date.now() / 1000 + EXPIRY_MARGIN_SECONDS;
}

function parseUser(raw: string | null): AuthUser | null {
  if (!raw) return null;

  try {
    const value = JSON.parse(raw);
    if (
      value &&
      typeof value.id === 'string' &&
      typeof value.email === 'string'
    ) {
      return {
        id: value.id,
        email: value.email,
        fullName: typeof value.fullName === 'string' ? value.fullName : '',
      };
    }
  } catch {
    // Dato corrupto: se trata como sesión inexistente.
  }

  return null;
}

// Devuelve false si no se pudo guardar; la sesión en memoria sigue siendo válida.
export async function saveSession(session: Session): Promise<boolean> {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, session.accessToken);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(session.user));

    if (session.refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, session.refreshToken);
    } else {
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    }

    return true;
  } catch {
    console.warn('No fue posible guardar la sesión de forma segura.');
    return false;
  }
}

export async function clearSession(): Promise<boolean> {
  const results = await Promise.allSettled([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);

  const failed = results.some((result) => result.status === 'rejected');
  if (failed) {
    console.warn('No fue posible eliminar toda la sesión almacenada.');
  }

  return !failed;
}

// Devuelve la sesión guardada solo si el token aún no venció. Si está
// vencido, dañado o incompleto, la elimina y devuelve null.
export async function loadSession(): Promise<Session | null> {
  try {
    const [accessToken, refreshToken, rawUser] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.getItemAsync(USER_KEY),
    ]);

    const user = parseUser(rawUser);

    if (accessToken && user && isTokenUsable(accessToken)) {
      return {
        user,
        accessToken,
        refreshToken: refreshToken ?? undefined,
      };
    }

    if (accessToken || refreshToken || rawUser) {
      await clearSession();
    }
  } catch {
    console.warn('No fue posible restaurar la sesión almacenada.');
  }

  return null;
}
