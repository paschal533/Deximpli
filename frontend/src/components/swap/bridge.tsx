"use client";
import React, { useContext, useEffect, useState } from "react";
import { ArrowDownUp, ChevronDown } from "lucide-react";
import { ConnectBTN } from "../customWallet";
import Image from "next/image";
import EthImage from "../../../public/images/eth.png";
import baseImage from "../../../public/images/base.png";
import IntegrationTrigger from "./modalTrigger";
import { SwapContext } from "@/context/swap-provider";
import { Button, CircularProgress } from "@mui/material";
import { ethers } from "ethers";
import CCIPTokenTransferABI from "@/contracts/CCIPTokenTransfer.json";
import { getBalance } from "@wagmi/core";
import { configConnect } from "@/blockchain/config";
import { toast } from "react-toastify";
import { useSwitchChain } from "wagmi";

function Bridge() {
  const {
    address,
    loading,
    networkselectedA,
    setNetworkSelectedA,
    network,
    signer,
    currentChainId,
  } = useContext(SwapContext);
  const { chains, switchChain } = useSwitchChain();
  const [token, setToken] = useState({
    name: "CCIP-BnM",
    symbol: "CCIP-BnM",
    address: "0x88A2d74F47a237a62e7A51cdDa67270CE381555e",
  });
  const [networkselectedB, setNetworkSelectedB] = useState<any>({});
  const [amount, setAmount] = useState<any>();
  const [balance, setBalance] = useState<any>();

  const selectToken = (token: any) => {
    setToken(token);
  };

  const selectNetworkB = (network: any) => {
    if (network.name === networkselectedA.name) {
      toast.error(
        "The selected networkss are identical, please select another network!",
      );
    } else {
      setNetworkSelectedB(network);
    }
  };

  const selectNetworkA = (network: any) => {
    if (network.name === networkselectedB.name) {
      toast.error(
        "The selected networkss are identical, please select another network!",
      );
    } else {
      setNetworkSelectedA(network);
      switchChain({ chainId: network.id });
    }
  };

  useEffect(() => {
    const init = async () => {
      if (address) {
        try {
          const balance = await getBalance(configConnect, {
            address: address as `0x${string}`,
            chainId: currentChainId,
            token: token.address as `0x${string}`,
          });
          const _balance = balance.value;
          setBalance(Number(ethers.utils.formatUnits(_balance)));
        } catch (error) {
          console.log(error);
        }
      }
    };

    init();
  }, []);

  const Bridge = async () => {
    try {
      if (networkselectedB && amount > 0 && token && networkselectedA) {
        const contract = new ethers.Contract(
          networkselectedA.address,
          CCIPTokenTransferABI.abi,
          signer,
        );
        const _allowAmount = ethers.utils.parseUnits(amount.toString(), 18);
        let chainSelected =
          networkselectedB?.name == "OPTIMISM"
            ? "5224473277236331295"
            : networkselectedB?.name == "CELO"
              ? "3552045678561919002"
              : networkselectedB?.name == "BASE"
                ? "10344971235874465080"
                : "829525985033418733";
        let valueAmount = Number(_allowAmount.toString());
        const tokenName = token.name;
        const tokenAddress =
          tokenName == "CCIP-BnM"
            ? networkselectedA.CCIP_BnM
            : networkselectedA.CCIP_LnM;
        const tx = await contract.transferTokensPayNative(
          chainSelected,
          address,
          tokenAddress,
          valueAmount,
          {
            maxFeePerGas: ethers.utils.parseUnits("60", "gwei"), // Set this to a higher value
            maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei"),
          },
        );
        setAmount("");
        toast.success(`succeeded! Transaction Hash: ${tx.hash}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("You don't have enough funds to complete this transaction");
    }
  };

  return (
    <div>
      <div className="md:w-[500px] md:p-0 p-4 w-[90vw]">
        <section className="h-[100px] bg-cream rounded-xl px-4 py-2  w-full">
          <IntegrationTrigger
            title={"Select a token"}
            type="test-token"
            selectToken={selectToken}
          >
            <div className="w-[170px] cursor-pointer bg-white flex justify-between font-bold py-1 px-2 space-x-2 rounded-2xl">
              <Image
                className="mr-1"
                src={network.image}
                alt="eth"
                width={25}
                height={20}
              />{" "}
              {token.name} <ChevronDown className="mt-[1px]" />
            </div>
          </IntegrationTrigger>
          <div className="flex justify-between mt-2 w-full">
            <input
              type="number"
              value={amount}
              onChange={(e: any) => setAmount(e.target.value)}
              placeholder="0"
              className="bg-none text-3xl w-1/2 font-bold placeholder:text-slate-500 placeholder:font-bold placeholder:text-3xl bg-transparent outline-none border-none"
            />
            <IntegrationTrigger
              title={"Select a Network"}
              type="network"
              selectToken={selectNetworkA}
            >
              <div className=" cursor-pointer bg-white flex justify-between font-bold py-1 px-2 space-x-2 rounded-2xl">
                <Image
                  className="mr-1"
                  src={networkselectedA?.image}
                  alt="eth"
                  width={25}
                  height={20}
                />
                {networkselectedA?.name} <ChevronDown className="mt-[1px]" />
              </div>
            </IntegrationTrigger>
          </div>
        </section>
        <div className="w-full justify-center items-center flex">
          <section className="bg-cream justify-center border-white absolute rounded-xl border-4 items-center flex w-10 h-10">
            <ArrowDownUp />
          </section>
        </div>
        <section className="h-[100px] mt-2 bg-cream  px-4 py-2 rounded-xl  w-full">
          <div className="text-md h-4 font-semibold text-gray-500"></div>
          <div className="flex mb justify-between mt-2 w-full">
            <input
              type="number"
              value={amount}
              onChange={(e: any) => setAmount(e.target.value)}
              placeholder="0"
              className="bg-none w-1/2 text-3xl font-bold placeholder:text-slate-500 placeholder:font-bold placeholder:text-3xl bg-transparent outline-none border-none"
            />
            <IntegrationTrigger
              title={"Select a Network"}
              type="network"
              selectToken={selectNetworkB}
            >
              {networkselectedB.image == null ? (
                <div className=" cursor-pointer bg-[#D7009A] text-white flex justify-between font-bold py-1 px-2 rounded-2xl">
                  Select network <ChevronDown className="mt-[1px]" />
                </div>
              ) : (
                <div className=" cursor-pointer bg-white flex justify-between font-bold py-1 px-2 rounded-2xl">
                  <Image
                    className="mr-1"
                    src={networkselectedB?.image}
                    alt="eth"
                    width={25}
                    height={20}
                  />{" "}
                  {networkselectedB?.name} <ChevronDown className="mt-[1px]" />
                </div>
              )}
            </IntegrationTrigger>
          </div>
        </section>
        <section>
          {!address ? (
            <ConnectBTN />
          ) : (
            <Button
              disabled={!networkselectedB || !amount || !token}
              onClick={Bridge}
              className="h-[50px] font-semibold text-[#D7009A] mt-2 justify-center items-center flex !bg-cream rounded-xl  w-full"
              fullWidth
            >
              {loading ? (
                <CircularProgress sx={{ color: "#D7009A" }} />
              ) : (
                `Bridge`
              )}
            </Button>
          )}
        </section>
      </div>
    </div>
  );
}

export default Bridge;
