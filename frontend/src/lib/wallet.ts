import { http, createConfig } from "@wagmi/core";
import {
  baseSepolia,
  optimismSepolia,
  modeTestnet,
  celoAlfajores,
  localhost,
} from "wagmi/chains";

export const publicClient = createConfig({
  chains: [baseSepolia, optimismSepolia, modeTestnet, celoAlfajores, localhost],
  transports: {
    [baseSepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [modeTestnet.id]: http(),
    [celoAlfajores.id]: http(),
    [localhost.id]: http(),
  },
});
