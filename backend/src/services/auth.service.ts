import {
  AuthRepository,
  AuthResult,
} from "../repositories/auth.repository";

export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async register(
    fullName: string,
    email: string,
    password: string
  ): Promise<AuthResult> {
    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedName.length < 2) {
      throw new Error("NOMBRE_INVALIDO");
    }

    if (
      normalizedName.length > 150 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      throw new Error("DATOS_INVALIDOS");
    }

    if (password.length < 8) {
      throw new Error("CONTRASENA_CORTA");
    }

    return this.authRepository.register(
      normalizedName,
      normalizedEmail,
      password
    );
  }

  async login(
    email: string,
    password: string
  ): Promise<AuthResult> {
    const normalizedEmail = email.trim().toLowerCase();

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
      !password
    ) {
      throw new Error("DATOS_INVALIDOS");
    }

    return this.authRepository.login(
      normalizedEmail,
      password
    );
  }
}
