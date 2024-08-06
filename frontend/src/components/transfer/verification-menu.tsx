"use client"
import { useState, useEffect, useContext } from 'react'
import { cn } from '@/lib/utils'
import React from 'react'
import AppDrawer from '../drawer'
import { Plus } from 'lucide-react'
import FormGenerator from '../forms/form-generator'
import UploadButton from '../upload-button'
import { Button } from '../ui/button'
import Link from 'next/link'
import Image from 'next/image'
import MailtoLink from '../mailToLink/MailToLink'
import { poseidonCircom, stringToCircomArray } from "@/lib/crypto";
import { Address, PrivateKeyAccount } from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { publicClient } from "@/lib/wallet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EmailAccountFactoryAbi from "@/constants/EmailAccountFactoryAbi";
//import { onUpdateUser } from '@/actions/settings'
import { Loader } from '@/components/loader'
import { onCompleteUserRegistration } from '@/actions/transfer'
import { SwapContext } from '@/context/swap-provider'

const queryClient = new QueryClient();

type Props = {
  min?: boolean
  user: any
  sidebar?: boolean
}

const DomainMenu = ({ user, min, sidebar }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hashedEmail, setHashedEmail] = useState<bigint>();
  const [newOwnerTrigger, setNewOwnerTrigger] = useState(0);
  const [verified, setVerified] = useState<boolean>(false)
  const { address, userEmail } = useContext(SwapContext)

  function changeOwner() {
    setNewOwnerTrigger((prev) => prev + 1);
  }

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
    const fetchUser = async () => {
 
      if(user.authenticated) {
        let hashedEmail = await getHashedEmail(userEmail);
        setHashedEmail(hashedEmail);
      }
    }
    fetchUser()

  }, [userEmail])


const EMAIL_FACTORY_ADDRESS = "0x324b6CBBbb2Ba4724290Ef53F1b68F5b46c61dBC"

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

 const onOwnerChanged = async (contractAddress: string, walletAddress: string, email: string) => {
    await onCompleteUserRegistration(email, contractAddress, walletAddress)
    setVerified(true);
 }

 useEffect(() => {
  const verifyAccount = async () => {
    if (!user.authenticated) {
      const userContractAddress = await GetContractAddress(userEmail)
      console.log("user contractAddress", userContractAddress);
      console.log("account", address);
      setLoading(true);
      const unwatch = publicClient.watchEvent({
        address: userContractAddress,
        pollingInterval: 5000,
        onLogs: (logs) => {
          console.log("Event Logs", logs);
          const transferedToAddress = logs[0]?.topics[2]?.toLowerCase();
          const accountAddress = address?.toLowerCase().substring(2);

          if (accountAddress && transferedToAddress?.includes(accountAddress)) {
            setLoading(false);
            unwatch();
            const contractAddress = userContractAddress?.toString()
            console.log("Account is verified!", accountAddress);
            onOwnerChanged(contractAddress, accountAddress, userEmail);
          }
        },
      });

      console.log("Watching for events");
      setLoading(false);

      return () => {
        console.log("stop watching for events");
        setLoading(false);
        unwatch();
      };
    }
  }

  verifyAccount()

}, [newOwnerTrigger]);

const verifyAccount = async () => {
  if (!user.authenticated) {
    const userContractAddress = await GetContractAddress(userEmail)
    console.log("user contractAddress", userContractAddress);
    console.log("account", address);
    setLoading(true);
    const unwatch = publicClient.watchEvent({
      address: userContractAddress,
      pollingInterval: 5000,
      onLogs: (logs) => {
        console.log("Event Logs", logs);
        const transferedToAddress = logs[0]?.topics[2]?.toLowerCase();
        const accountAddress = address?.toLowerCase().substring(2);

        if (accountAddress && transferedToAddress?.includes(accountAddress)) {
          setLoading(false);
          unwatch();
          const contractAddress = userContractAddress?.toString()
          console.log("Account is verified!", accountAddress);
          onOwnerChanged(contractAddress, accountAddress, userEmail);
        }
      },
    });

    console.log("Watching for events");
    setLoading(false);

    return () => {
      console.log("stop watching for events");
      setLoading(false);
      unwatch();
    };
  }
}


  return (
    <QueryClientProvider client={queryClient}>
    <div className={cn('flex flex-col gap-3', min ? 'mt-6' : 'mt-3')}>
      <div className="flex w-full items-center">
        {/*!min && <p className="text-md text-gray-500">Verify Account</p>*/}
        <AppDrawer
          description={loading ? "Verifying your account to view and withdraw your assets" : verified ? "Your account has been verified to send and withdraw your assets" : "Verify your account to send and withdraw your assets"}
          title={loading ? "Verifying your Account" :  verified ? "Account Verified" : "Verify your Account"}
          onOpen={
               <Button
                type="submit"
                className={`${!sidebar ? "w-[500px]" : " w-full" } mt-6 !bg-[#D7009A] `}
              >
                Verify Account to veiw details
              </Button>
          }
        >
          <Loader loading={loading}>
             
          <MailtoLink
                  hashedEmail={hashedEmail}
                  onEmailSent={() => {
                    verifyAccount()
                    changeOwner();
                  }}
                />
           </Loader>
        </AppDrawer>
      </div>
    </div>
    </QueryClientProvider>
  )
}

export default DomainMenu
