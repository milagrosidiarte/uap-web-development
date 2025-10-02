import { useState, useEffect, useCallback } from "react";
import { useAccount, useSignMessage } from "wagmi";

const API_URL = import.meta.env.VITE_API_URL;

interface FaucetStatus {
  balance: string;
  hasClaimed: boolean;
  faucetAmount: string;
  users: string[];
}

function App() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("jwt")
  );
  const [status, setStatus] = useState<FaucetStatus | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Login con SIWE
  const handleLogin = async () => {
    if (!address) return;

    try {
      // 1. pedir mensaje SIWE al backend
      const res1 = await fetch(`${API_URL}/auth/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const { message } = await res1.json();

      // 2. firmar mensaje con la wallet
      const signature = await signMessageAsync({ message });

      // 3. mandar firma al backend
      const res2 = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
      });
      const data = await res2.json();

      if (data.token) {
        localStorage.setItem("jwt", data.token);
        setToken(data.token);
      }
    } catch (err) {
      console.error("❌ Error en login:", err);
    }
  };

  // 🔹 Consultar estado faucet
  const fetchStatus = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/faucet/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: FaucetStatus = await res.json();
      setStatus(data);
    } catch (err) {
      console.error("❌ Error status:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // 🔹 Reclamar tokens
  const handleClaim = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/faucet/claim`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("✅ Claim result:", data);
      fetchStatus(); // refrescar estado
    } catch (err) {
      console.error("❌ Error claim:", err);
    } finally {
      setLoading(false);
    }
  };

  // cargar status cuando ya hay token
  useEffect(() => {
    if (token) fetchStatus();
  }, [token, fetchStatus]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          🚰 Faucet dApp
        </h1>

        {!isConnected && (
          <p className="text-center text-gray-600">
            Conecta tu wallet para continuar
          </p>
        )}

        {isConnected && !token && (
          <button
            onClick={handleLogin}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            🔑 Login con Ethereum
          </button>
        )}

        {isConnected && token && (
          <div className="space-y-4">
            {/* Cuenta */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Cuenta conectada</p>
              <p className="font-mono text-xs break-all">{address}</p>
            </div>

            {/* Info faucet */}
            {status && (
              <>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-500">Balance</p>
                    <p className="font-bold">{status.balance}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-500">Monto Faucet</p>
                    <p className="font-bold">{status.faucetAmount}</p>
                  </div>
                </div>

                <p className="text-center">
                  {status.hasClaimed
                    ? "✅ Ya reclamaste"
                    : "💧 Podés reclamar"}
                </p>

                {!status.hasClaimed && (
                  <button
                    onClick={handleClaim}
                    disabled={loading}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                  >
                    {loading ? "⏳ Procesando..." : "Reclamar Tokens"}
                  </button>
                )}

                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    📜 Usuarios del Faucet
                  </h2>
                  {Array.isArray(status.users) && status.users.length > 0 ? (
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      {status.users.map((user) => (
                        <li key={user} className="font-mono break-all">
                          {user}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">Nadie reclamó aún.</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
