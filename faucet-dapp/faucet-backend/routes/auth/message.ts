import { Router } from "express";
import type { Request, Response } from "express";
import { SiweMessage } from "siwe";
import { saveNonce } from "../../utils/nonceStore";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: "Address requerida" });
  }

  try {
    const nonce = Math.random().toString(36).substring(2, 10);

    // Guardamos el nonce en memoria
    saveNonce(address, nonce);

    const message = new SiweMessage({
      domain: "localhost",
      address,
      statement: "Inicia sesión en el Faucet DApp",
      uri: "http://localhost:5173",
      version: "1",
      chainId: 11155111,
      nonce,
    });

    res.json({ message: message.prepareMessage() });
  } catch (err) {
    const error = err as Error;
    console.error("❌ Error al crear mensaje SIWE:", error.message);
    res.status(500).json({ error: "Error al crear el mensaje SIWE" });
  }
});

export default router;
