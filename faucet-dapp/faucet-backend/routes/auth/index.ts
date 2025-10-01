import { Router } from "express";
import messageRoute from "./message";
import signinRoute from "./signin";

const router = Router();

router.use("/message", messageRoute);
router.use("/signin", signinRoute);

export default router;
