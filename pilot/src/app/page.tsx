"use client"
import { useCallback, useEffect, useState } from 'react'

import styles from './page.module.css'
import { config } from './config'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { ethers } from 'ethers'
import abi from './abi.json'

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
