import { supabaseAuth } from "../config/supabase-auth";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

export interface AuthResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export class AuthRepository {
  async register(
    fullName: string,
    email: string,
    password: string
  ): Promise<AuthResult> {
    const { data, error } = await supabaseAuth.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error("CONFIRMACION_EMAIL_REQUERIDA");
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email ?? email,
        fullName,
      },
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  }

  async login(
    email: string,
    password: string
  ): Promise<AuthResult> {
    const { data, error } =
      await supabaseAuth.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw new Error("CREDENCIALES_INVALIDAS");
    }

    if (!data.user || !data.session) {
      throw new Error("CREDENCIALES_INVALIDAS");
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email ?? email,
        fullName:
          String(data.user.user_metadata?.full_name ?? ""),
      },
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  }
}
