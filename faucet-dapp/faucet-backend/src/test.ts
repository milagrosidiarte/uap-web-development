import "dotenv/config";
import { getStatus } from "../services/contract";

async function main() {
  const testAddress = "0x0000000000000000000000000000000000000000"; // 👈 reemplaza con tu wallet en Sepolia si querés
  console.log(`🔍 Consultando estado del faucet para: ${testAddress}`);

  try {
    const status = await getStatus(testAddress);
    console.log("✅ Respuesta del contrato:");
    console.log(status);
  } catch (err) {
    console.error("❌ Error al consultar:", err);
  }
}

main();
