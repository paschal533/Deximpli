 "use client"
import React, { useState, useEffect, useContext } from 'react'
import * as API from "@/services/api";
import { Loader } from '../loader';
import { Button } from '@/components/ui/button'
import { sendMail } from '@/actions/transfer';
import { getContract, WalletClient, createWalletClient, http, Chain, parseEther } from "viem";
import {
  arbitrumSepolia,
  polygonMumbai,
  baseSepolia,
  lineaTestnet,
  hardhat,
} from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import EmailAccountFactoryAbi from "@/constants/EmailAccountFactoryAbi";
import EntryPointAbi from "@/constants/EntryPointAbi"
import { publicClient } from "@/lib/wallet";
import { poseidonCircom, stringToCircomArray } from "@/lib/crypto";
import { createModularAccountAlchemyClient } from "@alchemy/aa-alchemy";
import { Hex, encodeFunctionData } from "viem";
import { LocalAccountSigner } from "@alchemy/aa-core";
import contractABI from "@/constants/EmailAccount.json"
import { getCurrentNonce, generateSendTokenCalldata, generateUserOps, signUserOps } from "@/lib/userOps"
import { SwapContext } from '@/context/swap-provider';

function Transfer({ user } : any) {
  const [sendValue, setSendValue] = useState<any>();
  const {address, signer} = useContext(SwapContext);
  const [receiverEmail, setReciverEmail] = useState<string>("");
  const [isExchangedLoaded, setIsExchangedLoaded] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const currentNonces: { [key: string]: number } = {};
  const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

  async function getHashedEmail(email: string): Promise<bigint> {
    try {
      const circomArray = stringToCircomArray(email);
      const hashedEmail = await poseidonCircom(circomArray);
      return BigInt(hashedEmail);
    } catch (error) {
      console.error("Error hashing email:", error);
      throw error; // Rethrow or handle as needed
    }
  }

  useEffect(() => {
    let isMounted = true;

    const loadExchangeRate = async () => {
      setIsExchangedLoaded(false);
      const currentExchangeRate = await API.getExchangeRate();
      if (!isMounted) {
        return;
      }
      setExchangeRate(currentExchangeRate);
      setIsExchangedLoaded(true);
    };

    loadExchangeRate();
    return () => {
      isMounted = false;
    };
  }, []);

  const EtherAmount = parseFloat(sendValue) / exchangeRate;

  const validateEmail = (email : string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const isValidEmail = validateEmail(receiverEmail);

  async function GetContractAddress(email: string) {
    //const setHashedEmail = usePersistentStore((state) => state.setHashedEmail);
    if (email) {
      const hashedEmail = await getHashedEmail(email);
      //setHashedEmail(hashedEmail);
  
      const userContractAddress = await publicClient.readContract({
        address: EMAIL_FACTORY_ADDRESS,
        functionName: "getAddress",
        abi: EmailAccountFactoryAbi,
        args: [hashedEmail, BigInt(0)],
      });
  
      return userContractAddress;
    } else {
      console.log("No email found, please reset email");
    }
  }

  const chainId = "421614"

  const networks: { [key: string]: Chain } = {
    "421614": arbitrumSepolia,
    /*"80001": polygonMumbai,
    "84532": baseSepolia,
    "59140": lineaTestnet,
    "48899": zircuitTestnet,*/
  };

  const accountFactoryContractAddrs: { [key: string]: `0x${string}` } = {
    "421614": "0x324b6CBBbb2Ba4724290Ef53F1b68F5b46c61dBC",
    /*"80001": "0x2ffbd824342F067dce1FD5635c4e8c930DE67411",
    "84532": "0x87AF054a2629761eb34dd5bfb1B5a6AD9b972C6f",
    "59140": "0x7356f4cC77168d0e6f94F1d8E28aeA1316852c0d",
    "48899": "0xD570bF4598D3ccF214E288dd92222b8Bd3134984",*/
  };

  const walletClients: { [key: string]: WalletClient } = {};
const accountFactories: { [key: string]: any } = {};
for (const [chainId, network] of Object.entries(networks)) {
  walletClients[chainId] = createWalletClient({
    account: address,
    chain: network,
    transport: http(),
  });
  accountFactories[chainId] = getContract({
    address: accountFactoryContractAddrs[chainId],
    abi: EmailAccountFactoryAbi,
    client: walletClients[chainId],
  });
}


  const handleClick = async () => {

     /*try {
    const recieverSmartWallet = await GetContractAddress(receiverEmail)
    const sendAmountInWei = await parseEther(EtherAmount.toString()) 
     
    const calldata = await generateSendTokenCalldata(
      recieverSmartWallet as `0x${string}`,
      sendAmountInWei,
      user?.authenticated?.contractAddress as `0x${string}`
    );
    console.log("Calldata: ", calldata);

    const userOp = await generateUserOps(
      user?.authenticated?.contractAddress as string,
      calldata
    );
    console.log("User op: ", userOp);
    const signer =  privateKeyToAccount(user?.authenticated?.privatekey);
    const signedUserOp = await signUserOps(userOp, signer);
    console.log("Signed user op: ", signedUserOp);

    const entryPoint = getContract({
      address: ENTRYPOINT_ADDRESS,
      abi: EntryPointAbi,
      client: walletClients[chainId]!,
    });

    currentNonces[chainId] = await publicClient.getTransactionCount({
      address: walletAddress,
    });

    const txHash = await entryPoint.write.handleOps(
      [[signedUserOp], walletAddress],
      {
        account: privateKeyToAccount(process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`),
        chain: networks[chainId],
        nonce: currentNonces[chainId]++,
        gas: 800000n,
        maxFeePerGas: BigInt(2e8),
        maxPriorityFeePerGas: BigInt(2e8),
      }
    );
    console.log(txHash);

      await sendMail(address, receiverEmail, sendValue)

      setReciverEmail("");
      setSendValue("");
     }catch(error) {
      console.log(error.message)
     }*/

  };


const EMAIL_FACTORY_ADDRESS = "0x324b6CBBbb2Ba4724290Ef53F1b68F5b46c61dBC"


  const SendTransaction = async () => {
     try {

      await sendMail(user?.authenticated.fullname, receiverEmail, sendValue)

      //setReciverEmail("");
      //setSendValue("");

     }catch(error){
      console.log(error?.message)
     }

  }


  return (
     <div className='max-w-[500px]'>
    <div>
    <div className="flex-row w-full px-3 py-2 mt-4 text-base bg-[#F5F5F5] border rounded-lg outline-none dark:bg-nft-black-1 dark:border-nft-black-1 border-nft-gray-2 font-poppins dark:text-white text-nft-gray-2 flexBetween">
      <input
        title="Receiver Email"
        type="text"
        value={receiverEmail}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setReciverEmail(e.target.value)
        }
        placeholder="Receiver Gmail Address"
        className="flex-1 w-full bg-[#F5F5F5] outline-none dark:bg-nft-black-1 "
      />

      <p className="text-xl font-semibold font-poppins dark:text-white text-nft-black-1">
        @Gmail
      </p>
    </div>

    {isValidEmail == null && receiverEmail.length !== 0 && <p className="text-red-600 mt-3 text-md font-bold">This is not a valid Gmail address</p>}

    <div className="flex-row w-full px-3 py-2 mt-4 text-base bg-[#F5F5F5] border rounded-lg outline-none dark:bg-nft-black-1 dark:border-nft-black-1 border-nft-gray-2 font-poppins dark:text-white text-nft-gray-2 flexBetween">
      <input
        title="Send amount"
        type="number"
        min="1"
        value={sendValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSendValue(e.target.value)
        }
        placeholder="Amount to send in USD"
        className="flex-1 w-full bg-[#F5F5F5] outline-none dark:bg-nft-black-1 "
      />

      <p className="text-xl font-semibold font-poppins dark:text-white text-nft-black-1">
        USD
      </p>
    </div>
  </div>

  <div className="mt-6 flexBetween">
    <p className="text-base font-semibold font-poppins dark:text-white text-nft-black-1 minlg:text-xl">
      Total Ether:
    </p>
    {isExchangedLoaded ? (
      <p className="text-base font-normal font-poppins dark:text-white text-nft-black-1 minlg:text-xl">
        {isNaN(EtherAmount) ? 0 : EtherAmount.toFixed(4)}
        <span className="pl-1 font-semibold">ETHERS</span>
      </p>
    ) : (
      <p className="text-base font-normal font-poppins dark:text-white text-nft-black-1 minlg:text-xl">...</p>
    )}
  </div>
  
     <Button
        type="submit"
        className="w-full mt-6 bg-[#D7009A]"
        disabled={!sendValue || !receiverEmail || isValidEmail == null}
        onClick={() => handleClick()}
      >
        Send transaction
      </Button> 
  </div>
  )
}

export default Transfer