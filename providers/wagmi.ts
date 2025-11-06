import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  base,
  polygon,
  sepolia,
  coreDao,
  Chain,
} from 'wagmi/chains';


export const coreDAOTestNet: Chain = {
  id: 1114,
  name: 'Core Blockchain Testnet2',
  nativeCurrency: {
    name: 'tCORE2',
    symbol: 'tCORE2',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.test2.btcs.network'],
    },
    public: {
      http: ['https://rpc.test2.btcs.network'],
    },
  },
  blockExplorers: {
    default: { name: 'CORE Explorer', url: 'https://scan.test2.btcs.network' },
  }
}



export const config = getDefaultConfig({
  appName: 'Dava',
  projectId: '69fdf73f900171ff367d9424c6a9c1e3',
  chains: [
    polygon,
    base,
    coreDao,
    sepolia,
    coreDAOTestNet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});
