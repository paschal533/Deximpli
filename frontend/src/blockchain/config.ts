
import { cookieStorage, createStorage } from 'wagmi'
import {
  getDefaultConfig,
  Chain,
} from '@rainbow-me/rainbowkit';
import { http, createConfig } from '@wagmi/core'
import {
  baseSepolia,
  optimismSepolia,
  modeTestnet,
  celoAlfajores,
  localhost
} from 'wagmi/chains';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// Local avax custom chain
// const avalanche = {} as const satisfies Chain

// Create wagmiConfig
export const config = getDefaultConfig({
  appName: 'Deximpli',
  projectId: projectId,
  chains: [baseSepolia, optimismSepolia, modeTestnet, celoAlfajores, localhost],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  })
})

export const configConnect = createConfig({
  chains: [baseSepolia, optimismSepolia, modeTestnet, celoAlfajores, localhost],
  transports: {
    [baseSepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [modeTestnet.id]: http(),
    [celoAlfajores.id]: http(),
    [localhost.id]: http(),
  },
})