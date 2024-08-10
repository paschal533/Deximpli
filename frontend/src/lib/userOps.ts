import { getUserOpHash } from "@account-abstraction/utils";
import {
  Address,
  PrivateKeyAccount,
  createWalletClient,
  encodeFunctionData,
  getContract,
  http,
} from "viem";
import { arbitrumSepolia } from "viem/chains";

import emailAccountAbi from "@/constants/EmailAccountAbi";
import entryPointAbi from "@/constants/EntryPointAbi";
import { publicClient } from "./wallet";

const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PAYMASTER_ADDRESS = "0xFB0AD3C188DC1D3D490C4e00aBF261Aa5613a25b";
const EMAIL_FACTORY_ADDRESS = "0x324b6CBBbb2Ba4724290Ef53F1b68F5b46c61dBC";
const CHAIN_ID = "421614";

export const generateSendTokenCalldata = (
  recipient: Address,
  amount: any,
  smartWallet: Address,
) => {
  const data = encodeFunctionData({
    abi: emailAccountAbi,
    functionName: "withdrawDepositTo",
    args: [recipient, amount],
  });

  const calldata = encodeFunctionData({
    abi: emailAccountAbi,
    functionName: "execute",
    args: [smartWallet, 0n, data],
  });

  return calldata;
};

export const getCurrentNonce = async (address: string) => {
  const walletClient = createWalletClient({
    chain: arbitrumSepolia,
    transport: http(),
  });
  const entrypoint = getContract({
    address: ENTRYPOINT_ADDRESS,
    abi: entryPointAbi,
    client: walletClient,
  });
  const nonce = await entrypoint.read.nonceSequenceNumber([
    address as `0x${string}`,
    0n,
  ]);
  return nonce;
};

export const generateUserOps = async (sender: string, calldata: string) => {
  const nonce = await getCurrentNonce(sender);

  return {
    sender,
    nonce,
    callData: calldata,
    initCode: "0x",
    callGasLimit: 200000n,
    verificationGasLimit: 100000n,
    preVerificationGas: 100000n,
    maxFeePerGas: BigInt(2e8),
    maxPriorityFeePerGas: BigInt(2e8),
    paymasterAndData: PAYMASTER_ADDRESS,
    signature: "0x",
  };
};

export const signUserOps = async (userOp: any, account: PrivateKeyAccount) => {
  const userOpHash = getUserOpHash(
    userOp,
    ENTRYPOINT_ADDRESS,
    Number.parseInt(CHAIN_ID),
  );
  console.log("userOpHash", userOpHash);
  vb;
  userOp.signature = (await account.signMessage({
    message: {
      raw: userOpHash as `0x${string}`,
    },
  })) as `0x${string}`;
  console.log("Full user op:", userOp);

  return userOp;
};
