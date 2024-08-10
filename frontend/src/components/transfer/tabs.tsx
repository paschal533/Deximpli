"use client";
import React from "react";
import { Tabs } from "../ui/tabs";
import Send from ".";
import AccountDetails from "./account-details";

function TransferTabs() {
  const tabs = [
    {
      title: "Email Transaction",
      value: "email",
      content: <Send />,
    },
    {
      title: "Your Account Details",
      value: "account",
      content: <AccountDetails />,
    },
  ];
  return (
    <div className="!max-w-[1000px] p-4 w-full">
      <Tabs tabs={tabs} />
    </div>
  );
}

export default TransferTabs;
