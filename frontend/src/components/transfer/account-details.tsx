"use client";
import React, { useContext, useState, useEffect } from "react";
import { publicClient } from "@/lib/wallet";
import * as API from "@/services/api";
import { poseidonCircom, stringToCircomArray } from "@/lib/crypto";
import { formatEther } from "viem";
import VerificationMenu from "./verification-menu";
import { SwapContext } from "@/context/swap-provider";
import { onLoginUser } from "@/actions/transfer";
import DashboardCard from "../loan/cards";
import CalIcon from "@/icons/cal-icon";
import PersonIcon from "@/icons/person-icon";
import { TransactionsIcon } from "@/icons/transactions-icon";
import { DollarSign } from "lucide-react";
import { getPublicClient } from "@wagmi/core";
import { Chain } from "viem";
import { ethers } from "ethers";
import EmailAccountFactoryAbi from "@/constants/EmailAccountFactoryAbi";
import {
  baseSepolia,
  optimismSepolia,
  celoAlfajores,
  modeTestnet,
} from "viem/chains";

function AccountDetails() {
  const { address, signer, currentChainId } = useContext(SwapContext);

  const [balance, setBalance] = useState<number>(0);
  const [authenticated, setAuthenticated] = useState<any>();

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

  useEffect(() => {
    const getBalance = async () => {
      if (address) {
        const _authenticated = await onLoginUser(address);
        setAuthenticated(_authenticated);

        if (_authenticated?.status == 200) {
          const client = getPublicClient(publicClient, {
            chainId: currentChainId,
          });

          let balance = await client.getBalance({
            //@ts-ignore
            address: _authenticated.authenticated?.contractAddress,
          });

          const balanceAsEther = formatEther(balance);
          const currentExchangeRate = await API.getExchangeRate();
          const BalanceInUSD = parseFloat(balanceAsEther) * currentExchangeRate;

          setBalance(BalanceInUSD);
        }
      }
    };

    getBalance();
  }, [address, currentChainId]);

  return (
    <div className="w-full flex">
      {address ? (
        authenticated?.status !== 200 ? (
          <VerificationMenu user={authenticated} />
        ) : (
          <div>
            <div className="flex gap-5 flex-wrap">
              <DashboardCard
                value={balance.toFixed(2).toString()}
                sales
                title="Active Balance"
                icon={<PersonIcon />}
              />
              <DashboardCard
                value={"0"}
                sales
                title="Credit Balance"
                icon={<CalIcon />}
              />
              <DashboardCard
                value={"0"}
                sales
                title="Debit Balance"
                icon={<DollarSign />}
              />
            </div>
          </div>
        )
      ) : (
        <p className="bg-cream p-3 items-center flex justify-center h-[100px] text-center rounded-lg mt-2 font-semibold">
          Please connect your wallect to view Account Information
        </p>
      )}
    </div>
  );
}

export default AccountDetails;
