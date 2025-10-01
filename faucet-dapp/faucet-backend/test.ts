import "dotenv/config";
import { claimTokens, getStatus } from "./services/contract";

async function main() {
  const address = process.env.WALLET_ADDRESS!; // tu dirección pública
  console.log(`🔍 Estado inicial del faucet para: ${address}`);
  const statusBefore = await getStatus(address);
  console.log(statusBefore);

  console.log("🚀 Intentando reclamar tokens...");
  const txHash = await claimTokens(address);
  console.log("✅ Transacción enviada:", txHash);

  // esperar confirmación en etherscan si quieres
  setTimeout(async () => {
    console.log("🔍 Estado después del reclamo:");
    const statusAfter = await getStatus(address);
    console.log(statusAfter);
  }, 15000); // espera 15s
}

main();
