import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from './wagmiConfig'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import "./index.css";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
