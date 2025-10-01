import { Router } from "express";
import claimRoute from "./claim";
import statusRoute from "./status";

const router = Router();

router.use("/claim", claimRoute);
router.use("/status", statusRoute);

export default router;
