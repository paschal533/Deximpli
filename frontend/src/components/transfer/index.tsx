 "use client"
import React, { useState, useEffect, useContext } from 'react'
import * as API from "@/services/api";
import { Loader } from '../loader';
import { Button } from '@/components/ui/button'
import { sendMail } from '@/actions/transfer';
import { Chain, parseEther } from "viem";
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import {
  baseSepolia,
  optimismSepolia,
  celoAlfajores,
  modeTestnet
} from "viem/chains";
import EmailAccountFactoryAbi from "@/constants/EmailAccountFactoryAbi";
import { poseidonCircom, stringToCircomArray } from "@/lib/crypto";
import { SwapContext } from '@/context/swap-provider';
import { ConnectBTN } from '../customWallet';

function Transfer({ user } : any) {
  const [sendValue, setSendValue] = useState<any>();
  const {address, signer, currentChainId, provider} = useContext(SwapContext);
  const [receiverEmail, setReciverEmail] = useState<string>("");
  const [isExchangedLoaded, setIsExchangedLoaded] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(0);

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

  const networks: { [key: string]: Chain } = {
    "84532": baseSepolia,
    "11155420": optimismSepolia,
    "44787": celoAlfajores,
    "919": modeTestnet
  };

  const accountFactoryContractAddrs: { [key: string]: `0x${string}` } = {
    "84532": "0x5424fe6064b058798A37D241829ABB41476dFa92",
    "11155420": "0x215a4E3cD6d4e2eAC067866Bdad6a9d425E14e8f",
    "44787": "0x601566d18cdaE8D4347bB6ba43C5C2247D9c1f5a",
    "919": "0x601566d18cdaE8D4347bB6ba43C5C2247D9c1f5a"
  };

  async function GetContractAddress(email: string) {
    //const setHashedEmail = usePersistentStore((state) => state.setHashedEmail);
    if (email) {
      const hashedEmail = await getHashedEmail(email);
      //setHashedEmail(hashedEmail);

      const _network = networks[currentChainId]
      const EMAIL_FACTORY_ADDRESS = accountFactoryContractAddrs[currentChainId]

      const contract = new ethers.Contract(EMAIL_FACTORY_ADDRESS, EmailAccountFactoryAbi, signer)

      const userContractAddress = await contract.getAddress(hashedEmail, BigInt(0))
  
      return userContractAddress;
    } else {
      console.log("No email found, please reset email");
    }
  }


  const handleClick = async () => {

    try {
    const recieverSmartWallet = await GetContractAddress(receiverEmail)
    const sendAmountInWei =  parseEther(EtherAmount.toString()) 
      

      // Creating a transaction param
      const tx = {
        from: address,
        to: recieverSmartWallet,
        value: sendAmountInWei,
      };

      signer?.sendTransaction(tx).then((transaction) => {
        console.dir(transaction);
        toast.info(`Transaction succeeded! Transaction Hash: ${transaction.hash}`)
        //@ts-ignore
         sendMail(address, receiverEmail, sendValue)
         setReciverEmail("");
         setSendValue("");
      });
     }catch(error) {
      console.log(error)
     }

  };


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
  
     {!address ? <ConnectBTN/> :<Button
        type="submit"
        className="w-full mt-6 bg-[#D7009A]"
        disabled={!sendValue || !receiverEmail || isValidEmail == null}
        onClick={() => handleClick()}
      >
        Send transaction
      </Button>}
  </div>
  )
}

export default Transfer