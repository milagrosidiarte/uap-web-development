import { Router, Request, Response, NextFunction } from "express";
import { getStatus } from "../../services/contract";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extendemos Request para que acepte req.user
interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

const router = Router();

// Middleware para JWT
function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
}

// GET /faucet/status/:address
router.get("/:address", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const status = await getStatus(req.params.address);
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: "Status failed", details: err });
  }
});

export default router;
