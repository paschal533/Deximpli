import { cookieStorage, createStorage } from "wagmi";
import { getDefaultConfig, Chain } from "@rainbow-me/rainbowkit";
import { http, createConfig } from "@wagmi/core";
import {
  baseSepolia,
  optimismSepolia,
  modeTestnet,
  celoAlfajores,
  localhost,
} from "wagmi/chains";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

// Local avax custom chain
// const avalanche = {} as const satisfies Chain

// Create wagmiConfig
export const config = getDefaultConfig({
  appName: "Deximpli",
  //@ts-ignore
  projectId: projectId,
  chains: [modeTestnet, baseSepolia, optimismSepolia, celoAlfajores, localhost],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export const configConnect = createConfig({
  chains: [modeTestnet, baseSepolia, optimismSepolia, celoAlfajores, localhost],
  transports: {
    [modeTestnet.id]: http(),
    [baseSepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [celoAlfajores.id]: http(),
    [localhost.id]: http(),
  },
});
