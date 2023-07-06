"use client"
import './globals.css'
import { Inter } from 'next/font/google'
import { goerli } from '@wagmi/core/chains'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { dfcrcChain } from './dfcrc-chain'
import { config } from './config'
import { Web3Modal } from '@web3modal/react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [dfcrcChain],
    // [goerli],
    [w3mProvider({ projectId: config.walletConnectId })],
  )
   
  const wagmiConfig = createConfig({
    autoConnect: true,
    publicClient,
    connectors: w3mConnectors({ projectId: config.walletConnectId, chains }),
    webSocketPublicClient,
  })
  
  const ethereumClient = new EthereumClient(wagmiConfig, chains)

  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfig config={wagmiConfig}>
          {children}
        </WagmiConfig>
        <Web3Modal projectId={config.walletConnectId} ethereumClient={ethereumClient} />
      </body>
    </html>
  )
}
