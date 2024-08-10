"use client";
import React, { useContext } from "react";
import BreadCrumb from "./bread-crumb";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { DropdownMenuTrigger, DropdownMenu } from "../ui/dropdown-menu";
import Image from "next/image";
import EthImage from "../../../public/images/eth.png";
import DropDown from "./drop-down";
import { SwapContext } from "@/context/swap-provider";

type Props = {};

const InfoBar = (props: Props) => {
  const { network } = useContext(SwapContext);
  return (
    <div className="flex w-full justify-between items-center md:pr-4 pr-0 py-1 mb-8 ">
      <BreadCrumb />
      <div className="gap-3 space-x-4 md:flex hidden items-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Image src={network.image} alt="eth" width={25} height={20} />
          </DropdownMenuTrigger>
          <DropDown />
        </DropdownMenu>
        <ConnectButton />
      </div>
    </div>
  );
};

export default InfoBar;
