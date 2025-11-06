'use client'

import React from 'react';
import DoctorDashboard from '@/dash-components/DoctorDashboard';
import { useAccount } from 'wagmi';
import { useIsDoctor } from '@/hooks/useIsDoctor';

const NotDoctorComponent = ({ address }: { address?: `0x${string}` }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold">Access Denied</h1>
      <p className="mt-4">Your wallet address: {address}</p>
      <p className="mt-2 max-w-md text-red-500">
        You dont have access to this as you are not been approved as a doctor by a recognized health instituition provider
      </p>
    </div>
  );
};

const DoctorPage = () => {
  const { address, isConnected } = useAccount();
  const { data: isDoctor, isLoading } = useIsDoctor(address);

  if (!isConnected) {
    return (
      <div className="flex h-screen items-center justify-center">
        Please connect your wallet to view this page.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking your credentials...
      </div>
    );
  }

  if (!isDoctor) {
    return <NotDoctorComponent address={address} />;
  }

  return (
    <div>
      <DoctorDashboard />
    </div>
  );
};

export default DoctorPage;