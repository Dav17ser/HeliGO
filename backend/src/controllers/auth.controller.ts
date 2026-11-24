import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { fullName, email, password } = req.body ?? {};

    if (
      typeof fullName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        message: "Nombre, correo y contraseña son obligatorios",
      });
      return;
    }

    try {
      const result = await this.authService.register(
        fullName,
        email,
        password
      );

      res.status(201).json({
        message: "Cuenta creada correctamente",
        ...result,
      });
    } catch (error) {
      if (error instanceof Error) {
        const messages: Record<string, string> = {
          NOMBRE_INVALIDO: "El nombre debe tener al menos 2 caracteres",
          DATOS_INVALIDOS: "Verifica el nombre y el formato del correo",
          CONTRASENA_CORTA: "La contraseña debe tener al menos 8 caracteres",
          REGISTRO_RECHAZADO:
            "No fue posible crear la cuenta. Verifica tus datos o intenta con otro correo.",
          CONFIRMACION_EMAIL_REQUERIDA:
            "Cuenta creada. Revisa tu correo para confirmar el registro",
        };

        if (messages[error.message]) {
          const requiresConfirmation =
            error.message === "CONFIRMACION_EMAIL_REQUERIDA";

          res.status(requiresConfirmation ? 202 : 400).json({
            message: messages[error.message],
            requiresEmailConfirmation: requiresConfirmation,
          });
          return;
        }
      }

      next(error);
    }
  }

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email } = req.body ?? {};

    if (typeof email !== "string") {
      res.status(400).json({ message: "El correo es obligatorio" });
      return;
    }

    try {
      await this.authService.requestPasswordReset(email);

      // Respuesta genérica: no revela si el correo está registrado.
      res.status(200).json({
        message:
          "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.",
      });
    } catch (error) {
      if (error instanceof Error) {
        const messages: Record<string, [number, string]> = {
          DATOS_INVALIDOS: [400, "Ingresa un correo electrónico válido"],
          RECUPERACION_NO_DISPONIBLE: [
            503,
            "No fue posible procesar la solicitud. Intenta más tarde.",
          ],
        };

        const mapped = messages[error.message];
        if (mapped) {
          res.status(mapped[0]).json({ message: mapped[1] });
          return;
        }
      }

      next(error);
    }
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        message: "Correo y contraseña son obligatorios",
      });
      return;
    }

    try {
      const result = await this.authService.login(email, password);

      res.status(200).json({
        message: "Inicio de sesión exitoso",
        ...result,
      });
    } catch (error) {
      if (error instanceof Error) {
        const messages: Record<string, string> = {
          DATOS_INVALIDOS: "Verifica el correo y la contraseña",
          CREDENCIALES_INVALIDAS: "Correo o contraseña incorrectos",
        };

        if (messages[error.message]) {
          res.status(400).json({
            message: messages[error.message],
          });
          return;
        }
      }

      next(error);
    }
  }
}
