import * as React from 'react'
import { type WalletClient, useWalletClient } from 'wagmi'
import { ethers } from 'ethers'

interface Payload {
  method: string;
  params?: any[] | undefined;
}

export const sendRpcRequest = async (payload: Payload) => {
  return new Promise((resolve, reject) => {
    return fetch('https://a0jq79osep-a0yjwjns56-rpc.au0-aws.kaleido.io', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic YTBudm9uYmt5Zjo5cEtUT3RIUnlWQm9lQW1BZFpRZG81cEZxdG4zc0VYQU90M0kteEFhYmQ0',
        'Host': 'rpc.walletconnect.com',
        'Origin': 'http://localhost:3000',
      },
      body: JSON.stringify({ ...payload, jsonrpc: '2.0', id: Math.floor(Date.now() / 1000) }),
    })
    .then(response => resolve(response.json()))
  })
}
 
export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new ethers.providers.Web3Provider(transport, network)
  // The below line implement an interceptor which will add the Authorization header to the request
  // const provider = new ethers.providers.Web3Provider({ ...transport, request: sendRpcRequest }, network)
  
  provider.provider.sendAsync = sendRpcRequest
  const signer = provider.getSigner(account.address)
  return signer
}
 
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId })
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient],
  )
}