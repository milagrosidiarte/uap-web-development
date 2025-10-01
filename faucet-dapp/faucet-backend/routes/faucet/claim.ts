import { Router, Request, Response, NextFunction } from "express";
import { claimTokens } from "../../services/contract";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extendemos Request para guardar el usuario del token
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

// Endpoint de reclamar tokens
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const address = (req.user as JwtPayload).address;
    const txHash = await claimTokens(address);
    res.json({ success: true, txHash });
  } catch (err) {
    res.status(500).json({ error: "Claim failed", details: err });
  }
});

export default router;
