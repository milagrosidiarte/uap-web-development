import { Router, Response } from "express";
import { ethers } from "ethers";
import { authMiddleware, AuthRequest } from "../authMiddleware";

const router = Router();

const contractABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function hasAddressClaimed(address user) view returns (bool)",
  "function getFaucetAmount() view returns (uint256)",
  "function getFaucetUsers() view returns (address[])"
];

router.get("/", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userAddress = req.user!.address;

    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS!, contractABI, provider);

    const balance: bigint = await contract.balanceOf(userAddress);
    const hasClaimed: boolean = await contract.hasAddressClaimed(userAddress);
    const faucetAmount: bigint = await contract.getFaucetAmount();
    const usersList: string[] = await contract.getFaucetUsers();

    res.json({
      balance: ethers.formatEther(balance),
      hasClaimed,
      faucetAmount: ethers.formatEther(faucetAmount),
      users: usersList
    });
  } catch (err) {
    const error = err as Error;
    console.error("❌ Error en /faucet/status:", error.message);
    res.status(500).json({ error: "Error al consultar estado del faucet" });
  }
});

export default router;
