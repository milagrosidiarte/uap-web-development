import { ethers } from "ethers";
import { FAUCET_TOKEN_ABI } from "./faucetAbi";

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS!,
  FAUCET_TOKEN_ABI,
  wallet
);

export async function claimTokens(address: string) {
  const tx = await contract.claimTokens();
  return tx.hash;
}

export async function getStatus(address: string) {
  const hasClaimed = await contract.hasAddressClaimed(address);
  const balance = await contract.balanceOf(address);
  const users = await contract.getFaucetUsers();
  const amount = await contract.getFaucetAmount();

  return {
    hasClaimed,
    balance: balance.toString(),
    users,
    amount: amount.toString(),
  };
}
