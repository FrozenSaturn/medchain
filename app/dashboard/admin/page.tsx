'use client';

import React from 'react'
import Admin from '@/dash-components/Admin'
import { CONTRACT_ABI2, CONTRACT_ADDRESS2 } from '@/lib/contracts2'
import { useReadContract, useAccount } from 'wagmi'

const NotAdminComponent = ({ address }: { address?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <div className="p-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Access Denied
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Your wallet address: <span className="font-mono">{address}</span>
        </p>
        <p className="mt-2 text-red-500">
          You dont have access to this as you are not admin
        </p>
      </div>
    </div>
  )
}

const AdminPage = () => {
  const { address, isConnected } = useAccount()

  const { data: isAdmin, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS2,
    abi: CONTRACT_ABI2,
    functionName: 'isAdmin',
    args: [address],
    query: {
      enabled: !!address,
    },
  })

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please connect your wallet to view this page.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Checking permissions...</p>
      </div>
    )
  }

  if (isAdmin) {
    return (
      <div>
        <Admin />
      </div>
    )
  }

  return <NotAdminComponent address={address} />
}

export default AdminPage