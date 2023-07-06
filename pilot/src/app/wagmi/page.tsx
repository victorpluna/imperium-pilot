"use client"
import { Web3Button } from '@web3modal/react'
import { useAccount } from 'wagmi'
import abi from '../abi.json'
import { config } from '../config'
import { sendRpcRequest, useEthersSigner } from '../ethers'
import { ethers } from 'ethers'
 
export default function Wagmi() {
  const signer = useEthersSigner()
  
  const { address, isConnected } = useAccount()

  if (!isConnected) {
    return <Web3Button />
  }

  const onIncreaseAllowanceClick = async () => {
    const contract = new ethers.Contract(config.dfcrc.contractAddress, abi, signer)

    const tx = await contract.approve(config.dfcrc.spenderAddress, ethers.constants.MaxUint256)
    await tx.wait()
    console.log('==tx', tx)
  }
 

  return (
    <>
      <div>Connected to {address}</div>
      <button onClick={onIncreaseAllowanceClick}>Increase allowance</button>
    </>
  )
}