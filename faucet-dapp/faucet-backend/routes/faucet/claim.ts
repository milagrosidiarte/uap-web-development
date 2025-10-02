import { Router, Response } from "express";
import { ethers } from "ethers";
import { authMiddleware, AuthRequest } from "../authMiddleware";

const router = Router();

const contractABI = [
  "function claimTokens() nonpayable",
  "function hasAddressClaimed(address user) view returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function getFaucetAmount() view returns (uint256)",
  "function getFaucetUsers() view returns (address[])"
];

router.post("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userAddress = req.user!.address;

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      res.status(500).json({ error: "Falta configurar PRIVATE_KEY en el servidor" });
      return;
    }

    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS!, contractABI, wallet);

    const hasClaimed: boolean = await contract.hasAddressClaimed(userAddress);
    if (hasClaimed) {
      res.status(400).json({ error: "Ya reclamaste tus tokens" });
      return;
    }

    const tx = await contract.claimTokens();
    await tx.wait();

    res.json({
      success: true,
      txHash: tx.hash as string,
      message: "✅ Tokens reclamados exitosamente"
    });
  } catch (err) {
    const error = err as Error;
    console.error("❌ Error en /faucet/claim:", error.message);
    res.status(500).json({ error: "Error al reclamar tokens" });
  }
});

export default router;
