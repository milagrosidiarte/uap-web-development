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

  // 🔹 Balance del usuario
  const { data: balance } = useReadContract({
    abi: FAUCET_TOKEN_ABI,
    address: FAUCET_TOKEN_ADDRESS,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // 🔹 Estado de reclamo
  const { data: hasClaimed } = useReadContract({
    abi: FAUCET_TOKEN_ABI,
    address: FAUCET_TOKEN_ADDRESS,
    functionName: "hasAddressClaimed",
    args: address ? [address] : undefined,
  });

  // 🔹 Lista de usuarios
  const { data: faucetUsers } = useReadContract({
    abi: FAUCET_TOKEN_ABI,
    address: FAUCET_TOKEN_ADDRESS,
    functionName: "getFaucetUsers",
  });

  // 🔹 Monto del faucet
  const { data: faucetAmount } = useReadContract({
    abi: FAUCET_TOKEN_ABI,
    address: FAUCET_TOKEN_ADDRESS,
    functionName: "getFaucetAmount",
  });

  // 🔹 Reclamar tokens con feedback
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          🚰 Faucet dApp
        </h1>

        {isConnected ? (
          <div className="space-y-4">
            {/* Cuenta */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Cuenta conectada</p>
              <p className="font-mono text-xs break-all">{address}</p>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-500">Balance</p>
                <p className="font-bold">
                  {balance ? formatUnits(balance as bigint, 18) : "..."}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-500">Monto Faucet</p>
                <p className="font-bold">
                  {faucetAmount ? formatUnits(faucetAmount as bigint, 18) : "..."}
                </p>
              </div>
            </div>

            {/* Estado */}
            <p className="text-center">
              {hasClaimed ? "✅ Ya reclamaste" : "💧 Podés reclamar"}
            </p>

            {/* Botón */}
            <button
              onClick={handleClaim}
              disabled={!!hasClaimed || isPending || isConfirming}
              className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                hasClaimed || isPending || isConfirming
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isPending
                ? "📤 Enviando..."
                : isConfirming
                ? "⏳ Confirmando..."
                : "Reclamar Tokens"}
            </button>

            {/* Feedback */}
            {writeError && (
              <p className="text-red-500 text-sm text-center">
                ⚠️ {writeError.message}
              </p>
            )}
            {isConfirmed && (
              <p className="text-green-600 text-sm text-center">
                ✅ Reclamo exitoso
              </p>
            )}

            {/* Usuarios */}
            <div>
              <h2 className="text-lg font-semibold mb-2">
                📜 Usuarios del Faucet
              </h2>
              {Array.isArray(faucetUsers) && faucetUsers.length > 0 ? (
                <ul className="list-disc pl-6 text-sm space-y-1">
                  {faucetUsers.map((user) => (
                    <li key={user} className="font-mono break-all">
                      {user}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Nadie reclamó aún.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">
            Conecta tu wallet para continuar
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
