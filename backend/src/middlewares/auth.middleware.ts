import { Request, Response, NextFunction } from "express";
import { supabaseAuth } from "../config/supabase-auth";

// Identidad derivada exclusivamente de un token verificado.
export interface AuthenticatedUser {
  id: string;
  email: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// "Bearer <header>.<payload>.<firma>" (esquema sin distinguir mayúsculas).
const BEARER_PATTERN =
  /^Bearer\s+([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/i;

function rejectRequest(
  res: Response,
  status: number,
  message: string
): void {
  if (status === 401) {
    res.setHeader("WWW-Authenticate", 'Bearer realm="heligo"');
  }

  res.status(status).json({ message });
}

/**
 * Exige un access token válido de Supabase en `Authorization: Bearer <token>`.
 *
 * La verificación la hace Supabase Auth (`getClaims`): valida la firma con las
 * claves públicas (JWKS) del proyecto o, si el proyecto usa clave simétrica,
 * consultando al servidor de Auth. También rechaza tokens vencidos.
 *
 * Si es válido, deja la identidad en `req.user` y continúa.
 * Aplicar explícitamente en las rutas que lo requieran.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization;

  if (!header) {
    rejectRequest(res, 401, "Se requiere iniciar sesión");
    return;
  }

  const match = BEARER_PATTERN.exec(header.trim());

  if (!match) {
    rejectRequest(res, 401, "Encabezado de autorización inválido");
    return;
  }

  const token = match[1];

  try {
    const { data, error } = await supabaseAuth.auth.getClaims(token);

    if (error) {
      const unavailable =
        error.name === "AuthRetryableFetchError" ||
        (typeof error.status === "number" && error.status >= 500);

      if (unavailable) {
        rejectRequest(
          res,
          503,
          "No fue posible verificar la sesión. Intenta más tarde."
        );
        return;
      }

      rejectRequest(res, 401, "Sesión inválida o vencida");
      return;
    }

    const claims = data?.claims;

    // Solo sesiones de usuario: descarta claves anon/service_role u otros roles.
    if (
      !claims ||
      typeof claims.sub !== "string" ||
      !claims.sub ||
      claims.role !== "authenticated"
    ) {
      rejectRequest(res, 401, "Sesión inválida o vencida");
      return;
    }

    req.user = {
      id: claims.sub,
      email: typeof claims.email === "string" ? claims.email : null,
    };

    next();
  } catch {
    // Nunca se registra el token.
    console.error("Error inesperado al verificar la sesión");
    rejectRequest(
      res,
      503,
      "No fue posible verificar la sesión. Intenta más tarde."
    );
  }
}
