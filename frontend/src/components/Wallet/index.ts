"use client"
import { ethers } from 'ethers';
import { providers } from 'ethers'
import { useMemo } from 'react'
import type { Account, Chain, Client, Transport } from 'viem'
import { Config, useClient, useConnectorClient } from 'wagmi'
import { Web3Provider } from '@ethersproject/providers';

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    )
  return new providers.JsonRpcProvider(transport.url, network)
}


export const getLibrary = async (provider : any) => {
  return new Web3Provider(provider);
}

/** Hook to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({
  chainId,
}: { chainId?: number | undefined } = {}) {
  const client = useClient<Config>({ chainId })
  return useMemo(() => (client ? clientToProvider(client) : undefined), [client])
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}

/** Hook to convert a Viem Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}

/*import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { Buffer } from "buffer";

if (!window.Buffer) {
  window.Buffer = Buffer;
}


export const ETHEREUM_NETWORK_ID = 1;
export const SEPOLIA_NETWORK_ID = 11155111;
export const LOCAL_NETWORK_ID = 31337

export const injectedConnector = new InjectedConnector({ supportedChainIds: [ETHEREUM_NETWORK_ID, SEPOLIA_NETWORK_ID, LOCAL_NETWORK_ID] });

export const walletConnectConnector = new WalletConnectConnector({
  rpc: { [SEPOLIA_NETWORK_ID]: process.env.REACT_APP_API_URL },
  qrcode: true,
});*/

export const localProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_LOCAL_RPC_URL);