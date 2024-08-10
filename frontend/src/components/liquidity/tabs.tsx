import React from "react";
import { Tabs } from "../ui/tabs";
import AddLiquidity from "./add-liquidity";
import RemoveLiquidity from "./remove-liquidity";
import ListLiquidity from "./list-liquidity";

function LiquidityTabs() {
  const tabs = [
    {
      title: "Add Liquidity",
      value: "Add Liquidity",
      content: <AddLiquidity />,
    },
    {
      title: "Your Liquidity List",
      value: "Liquidity List",
      content: <ListLiquidity />,
    },
  ];
  return (
    <div className="md:w-[500px] md:p-0 p-4 w-[90vw]">
      <Tabs tabs={tabs} />
    </div>
  );
}

export default LiquidityTabs;
