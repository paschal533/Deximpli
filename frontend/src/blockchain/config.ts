
import { cookieStorage, createStorage } from 'wagmi'
import {
  getDefaultConfig,
  Chain,
} from '@rainbow-me/rainbowkit';
import { http, createConfig } from '@wagmi/core'
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  goerli,
  sepolia,
  localhost
} from 'wagmi/chains';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// Local avax custom chain
// const avalanche = {} as const satisfies Chain

// Create wagmiConfig
export const config = getDefaultConfig({
  appName: 'Deximpli',
  projectId: projectId,
  chains: [mainnet, goerli, polygon, optimism, arbitrum, base, zora, sepolia, localhost],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  })
})

export const configConnect = createConfig({
  chains: [mainnet, sepolia, optimism],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [optimism.id]: http(),
    [localhost.id]: http(),
  },
})