import { useAccount, useConnect, useDisconnect } from 'wagmi'

function App() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const metamask = connectors.find(c => c.id === 'injected')

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🚰 Faucet dApp</h1>

      {!isConnected ? (
        <button onClick={() => metamask && connect({ connector: metamask })}>
          Conectar con MetaMask
        </button>
      ) : (
        <div>
          <p>✅ Conectado: {address}</p>
          <button onClick={() => disconnect()}>Desconectar</button>
        </div>
      )}
    </div>
  )
}

export default App
