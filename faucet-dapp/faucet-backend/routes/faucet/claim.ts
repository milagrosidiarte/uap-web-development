import { Router } from "express";
import { claimTokens } from "../../services/contract";
import jwt from "jsonwebtoken";

const router = Router();

// Middleware para JWT
function authenticate(req: any, res: any, next: any) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
}

router.post("/", authenticate, async (req, res) => {
  try {
    const { address } = req.user;
    const txHash = await claimTokens(address);
    res.json({ success: true, txHash });
  } catch (err) {
    res.status(500).json({ error: "Claim failed", details: err });
  }
});

export default router;
