import { useAccount, useConnect, useDisconnect } from 'wagmi'

function App() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🚰 Faucet dApp</h1>

      {!isConnected ? (
        <button onClick={() => connect({ connector: connectors[0] })}>
          Conectar Wallet
        </button>
      ) : (
        <>
          <p>Conectado: {address}</p>
          <button onClick={() => disconnect()}>Desconectar</button>
        </>
      )}
    </div>
  )
}

export default App
