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
      <div className="w-full max-w-lg bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-4">🚰 Faucet dApp</h1>

        {isConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Cuenta:</p>
              <p className="font-mono text-sm break-all">{address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-gray-600">Balance</p>
                <p className="font-bold">
                  {balance ? formatUnits(balance as bigint, 18) : "..."}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600">Monto Faucet</p>
                <p className="font-bold">
                  {faucetAmount ? formatUnits(faucetAmount as bigint, 18) : "..."}
                </p>
              </div>
            </div>

            <p className="text-center">
              {hasClaimed ? "✅ Ya reclamaste" : "💧 Podés reclamar"}
            </p>

            <button
              onClick={handleClaim}
              disabled={!!hasClaimed || isPending || isConfirming}
              className={`w-full py-2 rounded-lg text-white font-semibold ${
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

            <div>
              <h2 className="text-lg font-semibold mb-2">
                📜 Usuarios del Faucet
              </h2>
              {Array.isArray(faucetUsers) && faucetUsers.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-sm">
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
