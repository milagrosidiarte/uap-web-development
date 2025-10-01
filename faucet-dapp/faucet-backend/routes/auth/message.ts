import { Router } from "express";
import { SiweMessage } from "siwe";

const router = Router();

router.post("/", (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: "Address required" });

  const message = new SiweMessage({
    domain: "localhost",
    address,
    statement: "Sign in with Ethereum to the Faucet dApp",
    uri: "http://localhost:5173",
    version: "1",
    chainId: 11155111, // Sepolia
  });

  res.json({ message: message.prepareMessage() });
});

export default router;
