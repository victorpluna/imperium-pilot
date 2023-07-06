"use client"
import { useCallback, useEffect, useState } from 'react'

import styles from './page.module.css'
import { config } from './config'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { ethers } from 'ethers'
import abi from './abi.json'

export const sendRpcRequest = async (payload: any, callback: any) => {
  fetch('https://a0jq79osep-a0yjwjns56-rpc.au0-aws.kaleido.io', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic YTBudm9uYmt5Zjo5cEtUT3RIUnlWQm9lQW1BZFpRZG81cEZxdG4zc0VYQU90M0kteEFhYmQ0',
    },
    body: JSON.stringify(payload),
  })
  .then(response => response.json())
  .then(result => {
    callback(null, result);
  })
  .catch(error => {
    callback(error, null);
  });
}

export default function Home() {
  const [web3Provider, setWeb3Provider] = useState<any>()
  const [account, setAccount] = useState<any>()
  const [clientProvider, setClientProvider] = useState<any>()

  const onInitializeClientProvider = useCallback(async () => {
    const client = await EthereumProvider.init({
      projectId: config.walletConnectId,
      showQrModal: true,
      chains: [config.dfcrc.chainId],
    });
    setClientProvider(client)

    if (client.session) {
      onSessionConnected({ client })
    }
  }, [])

  const onSessionConnected = async ({ client }: { client: any }) => {
    const [sessionAccount] = await client.enable()
    setAccount(sessionAccount)

    const provider = new ethers.providers.Web3Provider(client)
    // The below line implement an interceptor which will add the Authorization header to the request
    // const provider = new ethers.providers.Web3Provider({ ...client, sendAsync: sendRpcRequest })

    setWeb3Provider(provider)
  }

  const connectClientProvider = async () => {
    await clientProvider.connect();
    onSessionConnected({ client: clientProvider })
  }

  const disconnectClientProvider = () => {
    clientProvider.disconnect()
    setAccount(null)
  }

  const onConfirmAllowanceClick = async () => {
    const signer = await web3Provider.getSigner()
    const contract = new ethers.Contract(config.dfcrc.contractAddress, abi, signer)

    const tx = await contract.approve(config.dfcrc.spenderAddress, ethers.constants.MaxUint256)
    await tx.wait()
  }

  useEffect(() => {
    onInitializeClientProvider()
  }, [onInitializeClientProvider])

  
  return (
    <main className={styles.main}>
      <div>
        {account ? (
          <div>
            <span>Account: {account} </span>
            <button onClick={disconnectClientProvider}>Disconnect</button>
            <br /><br /><br />
            <button onClick={onConfirmAllowanceClick}>Increase Allowance</button>
          </div>
        ) : <button onClick={connectClientProvider}>Connect Wallet</button>}
      </div>
    </main>
  )
}
