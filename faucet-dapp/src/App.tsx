import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { FAUCET_TOKEN_ADDRESS, FAUCET_TOKEN_ABI } from "./faucetTokenAbi";
import { formatUnits } from "viem";

function App() {
  const { address, isConnected } = useAccount();

  const { data: balance } = useReadContract({
    abi: FAUCET_TOKEN_ABI,
    address: FAUCET_TOKEN_ADDRESS,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: hasClaimed } = useReadContract({
    abi: FAUCET_TOKEN_ABI,
    address: FAUCET_TOKEN_ADDRESS,
    functionName: "hasAddressClaimed",
    args: address ? [address] : undefined,
  });

  const { data: faucetUsers } = useReadContract({
    abi: FAUCET_TOKEN_ABI,
    address: FAUCET_TOKEN_ADDRESS,
    functionName: "getFaucetUsers",
  });

  const { data: faucetAmount } = useReadContract({
    abi: FAUCET_TOKEN_ABI,
    address: FAUCET_TOKEN_ADDRESS,
    functionName: "getFaucetAmount",
  });

  // Reclamo con feedback
  const { writeContract, data: txHash, isPending, error: writeError } =
    useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash: txHash });

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
          <p>
            Balance:{" "}
            {balance ? formatUnits(balance as bigint, 18) : "..."} tokens
          </p>
          <p>
            Monto del faucet:{" "}
            {faucetAmount ? formatUnits(faucetAmount as bigint, 18) : "..."} tokens
          </p>
          <p>{hasClaimed ? "✅ Ya reclamaste" : "💧 Podés reclamar"}</p>

          <button
            onClick={handleClaim}
            disabled={!!hasClaimed || isPending || isConfirming}
          >
            {isPending
              ? "📤 Enviando..."
              : isConfirming
              ? "⏳ Confirmando..."
              : "Reclamar Tokens"}
          </button>

          {writeError && <p style={{ color: "red" }}>⚠️ {writeError.message}</p>}
          {isConfirmed && <p style={{ color: "green" }}>✅ Reclamo exitoso</p>}

          <h2>📜 Usuarios del Faucet</h2>
          {Array.isArray(faucetUsers) && faucetUsers.length > 0 ? (
            <ul>
              {faucetUsers.map((user) => (
                <li key={user}>{user}</li>
              ))}
            </ul>
          ) : (
            <p>Nadie reclamó aún.</p>
          )}
        </>
      ) : (
        <p>Conecta tu wallet para continuar</p>
      )}
    </div>
  );
}

export default App;
