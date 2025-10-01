import { Router } from "express";
import authRoutes from "./auth";
import faucetRoutes from "./faucet";

const router = Router();

router.use("/auth", authRoutes);
router.use("/faucet", faucetRoutes);

export default router;
