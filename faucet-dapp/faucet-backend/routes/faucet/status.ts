import { Router } from "express";
import { getStatus } from "../../services/contract";
import jwt from "jsonwebtoken";

const router = Router();

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

router.get("/:address", authenticate, async (req, res) => {
  try {
    const status = await getStatus(req.params.address);
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: "Status failed", details: err });
  }
});

export default router;
