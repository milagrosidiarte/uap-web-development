import { ethers } from "ethers";
import { FAUCET_TOKEN_ABI } from "./faucetAbi";

// Inicializamos provider y wallet firmante
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

// Conexión al contrato FaucetToken
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS!,
  FAUCET_TOKEN_ABI,
  wallet
);

// Reclamar tokens
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function claimTokens(_address: string): Promise<string> {
  // el parámetro _address está de adorno (el contrato usa msg.sender)
  const tx = await contract.claimTokens();
  return tx.hash;
}

// Estado del faucet para un usuario
export interface FaucetStatus {
  hasClaimed: boolean;
  balance: string;
  users: string[];
  amount: string;
}

export async function getStatus(address: string): Promise<FaucetStatus> {
  const hasClaimed: boolean = await contract.hasAddressClaimed(address);
  const balance: bigint = await contract.balanceOf(address);
  const users: string[] = await contract.getFaucetUsers();
  const amount: bigint = await contract.getFaucetAmount();

  return {
    hasClaimed,
    balance: balance.toString(),
    users,
    amount: amount.toString(),
  };
}
