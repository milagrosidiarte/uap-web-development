import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SiweMessage } from "siwe";
import { getNonce, deleteNonce } from "../../utils/nonceStore";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { message, signature } = req.body;
  if (!message || !signature) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    const siweMessage = new SiweMessage(message);

    // Recuperar el nonce guardado para esa dirección
    const storedNonce = getNonce(siweMessage.address);
    if (!storedNonce || storedNonce !== siweMessage.nonce) {
      return res.status(401).json({ error: "Nonce inválido o expirado" });
    }

    const { success, data } = await siweMessage.verify({
      signature,
      domain: "localhost",
      nonce: storedNonce,
    });

    if (!success) {
      return res.status(401).json({ error: "Firma inválida" });
    }

    // Eliminamos el nonce (solo se usa una vez)
    deleteNonce(siweMessage.address);

    const address = data.address;

    const token = jwt.sign(
      { address },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({ token, address });
  } catch (err) {
    const error = err as Error;
    console.error("❌ Error al verificar SIWE:", error.message);
    res.status(400).json({ error: "Error al verificar SIWE" });
  }
});

export default router;
