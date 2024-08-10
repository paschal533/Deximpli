"use client";
import React, { ReactNode } from "react";
import { Card } from "../ui/card";
import { CloudIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import Modal from "../mondal";
import PoolModal from "./poolModal";
import TokenModal from "../stake/tokenModel";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import Deposit from "./deposit";
import Withdraw from "./withdraw";
import SupplyStakingReward from "./reward";

const IntegrationTrigger = ({
  children,
  title,
  selectToken,
  type,
  erc20Only,
  customTokens,
}: {
  children: ReactNode;
  title: string;
  selectToken?: any;
  type: string;
  erc20Only?: boolean;
  customTokens?: any;
}) => {
  const placeholdersNetwork = [
    "Search name of network",
    "Paste address of network",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  switch (type) {
    case "pool":
      return (
        <Modal title={title} type="Integration" trigger={children}>
          <PoolModal
            customTokens={customTokens}
            erc20Only={erc20Only}
            selectToken={selectToken}
          />
        </Modal>
      );
    case "token":
      return (
        <Modal title={title} type="Integration" trigger={children}>
          <TokenModal
            customTokens={customTokens}
            erc20Only={erc20Only}
            selectToken={selectToken}
          />
        </Modal>
      );
    case "Deposit-token":
      return (
        <Modal title={title} type="Integration" trigger={children}>
          <Deposit poolAddress={selectToken} />
        </Modal>
      );
    case "withdraw-stake":
      return (
        <Modal title={title} type="Integration" trigger={children}>
          <Withdraw poolAddress={selectToken} />
        </Modal>
      );
    case "supply-reward":
      return (
        <Modal title={title} type="Integration" trigger={children}>
          <SupplyStakingReward poolAddress={selectToken} />
        </Modal>
      );
    default:
      return <></>;
  }
};

export default IntegrationTrigger;
