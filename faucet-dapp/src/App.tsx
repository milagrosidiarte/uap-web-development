import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { FAUCET_TOKEN_ADDRESS, FAUCET_TOKEN_ABI } from "./faucetTokenAbi";

function App() {
  const { address, isConnected } = useAccount();

  // Balance
  const { data: balance } = useReadContract({
    abi: FAUCET_TOKEN_ABI,
    address: FAUCET_TOKEN_ADDRESS,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // Estado de reclamo
  const { data: hasClaimed } = useReadContract({
    abi: FAUCET_TOKEN_ABI,
    address: FAUCET_TOKEN_ADDRESS,
    functionName: "hasAddressClaimed",
    args: address ? [address] : undefined,
  });

  // Reclamar tokens
  const { writeContract } = useWriteContract();

  const handleClaim = async () => {
    try {
      await writeContract({
        abi: FAUCET_TOKEN_ABI,
        address: FAUCET_TOKEN_ADDRESS,
        functionName: "claimTokens",
      });
    } catch (err) {
      console.error("❌ Error al reclamar:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🚰 Faucet dApp</h1>

      {isConnected ? (
        <>
          <p>Cuenta: {address}</p>
          <p>Balance: {balance?.toString() ?? "..."}</p>
          <p>{hasClaimed ? "✅ Ya reclamaste" : "💧 Podés reclamar"}</p>

          <button onClick={handleClaim} disabled={!!hasClaimed}>
            Reclamar Tokens
          </button>
        </>
      ) : (
        <p>Conecta tu wallet para continuar</p>
      )}
    </div>
  );
}

export default App;
