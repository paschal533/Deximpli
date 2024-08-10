"use client";
import { useState, useEffect, useContext } from "react";
import { cn } from "@/lib/utils";
import React from "react";
import AppDrawer from "../drawer";
import { ethers } from "ethers";
import {
  baseSepolia,
  optimismSepolia,
  celoAlfajores,
  modeTestnet,
} from "viem/chains";
import { Button } from "../ui/button";
import MailtoLink from "../mailToLink/MailToLink";
import { poseidonCircom, stringToCircomArray } from "@/lib/crypto";
import { publicClient } from "@/lib/wallet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EmailAccountFactoryAbi from "@/constants/EmailAccountFactoryAbi";
import { Loader } from "@/components/loader";
import { onCompleteUserRegistration } from "@/actions/transfer";
import { SwapContext } from "@/context/swap-provider";
import { getPublicClient } from "@wagmi/core";
import { CircularProgress } from "@mui/material";
import { Chain } from "viem";

const queryClient = new QueryClient();

type Props = {
  min?: boolean;
  user: any;
  sidebar?: boolean;
};

const DomainMenu = ({ user, min, sidebar }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hashedEmail, setHashedEmail] = useState<bigint>();
  const [newOwnerTrigger, setNewOwnerTrigger] = useState(0);
  const [verified, setVerified] = useState<boolean>(false);
  const { address, userEmail, currentChainId, signer } =
    useContext(SwapContext);

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

  /*useEffect(() => {
    const fetchUser = async () => {
 
      if(user?.authenticated) {
        let hashedEmail = await getHashedEmail(userEmail);
        setHashedEmail(hashedEmail);
      }
    }
    fetchUser()

  }, [userEmail, user?.authenticated])*/

  const networks: { [key: string]: Chain } = {
    "84532": baseSepolia,
    "11155420": optimismSepolia,
    "44787": celoAlfajores,
    "919": modeTestnet,
  };

  const accountFactoryContractAddrs: { [key: string]: `0x${string}` } = {
    "84532": "0x5424fe6064b058798A37D241829ABB41476dFa92",
    "11155420": "0x215a4E3cD6d4e2eAC067866Bdad6a9d425E14e8f",
    "44787": "0x601566d18cdaE8D4347bB6ba43C5C2247D9c1f5a",
    "919": "0x601566d18cdaE8D4347bB6ba43C5C2247D9c1f5a",
  };

  async function GetContractAddress(email: string) {
    //const setHashedEmail = usePersistentStore((state) => state.setHashedEmail);
    if (email) {
      const hashedEmail = await getHashedEmail(email);
      //setHashedEmail(hashedEmail);

      const _network = networks[currentChainId];
      const EMAIL_FACTORY_ADDRESS = accountFactoryContractAddrs[currentChainId];

      const contract = new ethers.Contract(
        EMAIL_FACTORY_ADDRESS,
        EmailAccountFactoryAbi,
        signer,
      );

      const userContractAddress = await contract.getAddress(
        hashedEmail,
        BigInt(0),
      );

      return userContractAddress;
    } else {
      console.log("No email found, please reset email");
    }
  }

  const onOwnerChanged = async (
    contractAddress: string,
    walletAddress: string,
    email: string,
  ) => {
    await onCompleteUserRegistration(email, contractAddress, walletAddress);
    setVerified(true);
  };

  /*useEffect(() => {
  const verifyAccount = async () => {
    console.log("starting")
    if (!user) {
      const userContractAddress = await GetContractAddress(userEmail)
      console.log("user contractAddress", userContractAddress);
      console.log("account", address);
      setLoading(true);
      const client = getPublicClient(publicClient, {
        chainId: currentChainId, 
      })
      const unwatch = client.watchEvent({
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

}, [newOwnerTrigger]);*/

  const verifyAccount = async () => {
    setLoading(true);
    if (!user) {
      const userContractAddress = await GetContractAddress(userEmail);
      console.log("user contractAddress", userContractAddress);
      console.log("account", address);
      setLoading(true);
      const client = getPublicClient(publicClient, {
        chainId: currentChainId,
      });
      const unwatch = client.watchEvent({
        address: userContractAddress,
        pollingInterval: 5000,
        onLogs: (logs) => {
          console.log("Event Logs", logs);
          const transferedToAddress = logs[0]?.topics[2]?.toLowerCase();
          const accountAddress = address?.toLowerCase().substring(2);

          if (accountAddress && transferedToAddress?.includes(accountAddress)) {
            setLoading(false);
            unwatch();
            const contractAddress = userContractAddress?.toString();
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
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className={cn("flex flex-col gap-3", min ? "mt-6" : "mt-3")}>
        <div className="flex w-full items-center">
          {/*!min && <p className="text-md text-gray-500">Verify Account</p>*/}
          <AppDrawer
            description={
              loading
                ? "Verifying your account to view and withdraw your assets"
                : verified
                  ? "Your account has been verified to send and withdraw your assets"
                  : "Verify your account to send and withdraw your assets"
            }
            title={
              loading
                ? "Verifying your Account"
                : verified
                  ? "Account Verified"
                  : "Verify your Account"
            }
            onOpen={
              <Button
                type="submit"
                className={`${!sidebar ? "w-[500px]" : " w-full"} mt-6 !bg-[#D7009A] `}
              >
                Verify Account to veiw details
              </Button>
            }
          >
            <Loader loading={loading}>
              {loading ? (
                <CircularProgress />
              ) : (
                <MailtoLink
                  //@ts-ignore
                  hashedEmail={hashedEmail}
                  onEmailSent={() => {
                    verifyAccount();
                    changeOwner();
                  }}
                />
              )}
            </Loader>
          </AppDrawer>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default DomainMenu;
