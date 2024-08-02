
import { cookieStorage, createStorage } from 'wagmi'
import {
  getDefaultConfig,
  Chain,
} from '@rainbow-me/rainbowkit';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
  goerli,
} from 'wagmi/chains';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// Local avax custom chain
// const avalanche = {} as const satisfies Chain

// Create wagmiConfig
export const config = getDefaultConfig({
  appName: 'Deximpli',
  projectId: projectId,
  chains: [mainnet, goerli, polygon, optimism, arbitrum, base, zora],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  })
})