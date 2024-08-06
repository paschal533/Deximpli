import {
  Account,
  Client,
  createPublicClient,
  createWalletClient,
  http,
  publicActions,
} from "viem";
import { arbitrumSepolia } from "viem/chains";

export const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(
    // "https://sepolia-rollup.arbitrum.io/rpc"
    "https://arb-sepolia.g.alchemy.com/v2/Y1tLHU15xch1CSkkNrbt7eZ-G7c7_7-I"
  ),
});

let client: Client | null = null;
function createClientFromAccount(account: Account) {
  if (!client) {
    client = createWalletClient({
      account,
      chain: arbitrumSepolia,
      transport: http(
        // "https://sepolia-rollup.arbitrum.io/rpc"
        "https://arb-sepolia.g.alchemy.com/v2/Y1tLHU15xch1CSkkNrbt7eZ-G7c7_7-I"
      ),
    }).extend(publicActions);
  }
  return client;
}

export { createClientFromAccount };
export default client;
