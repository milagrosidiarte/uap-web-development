import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { address: string };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "Token no encontrado" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Formato de token inválido" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { address: string };
    req.user = { address: decoded.address };
    next();
  } catch (err) {
    const error = err as Error;
    console.error("❌ Error en authMiddleware:", error.message);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}
