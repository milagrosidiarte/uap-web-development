import { Router } from "express";
import { SiweMessage } from "siwe";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { message, signature } = req.body;
    if(!message || !signature) {
        return res.status(400).json({error: "Message and signature requiered"});
    }

    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.verify({ signature });

    if (!fields.success) {
      return res.status(403).json({ error: "Invalid signature" });
    }

    const address = siweMessage.address;
    const token = jwt.sign({ address }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.json({ token, address });
  } catch (err) {
    res.status(500).json({ error: "Signin failed", details: err });
  }
});

export default router;
