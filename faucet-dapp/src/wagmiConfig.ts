// src/wagmiConfig.ts
import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected } from '@wagmi/connectors'

// Configuración de wagmi para Sepolia + MetaMask
export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    injected({ shimDisconnect: true }), // Conector para MetaMask y wallets inyectadas
  ],
  transports: {
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
  },
})
