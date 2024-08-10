"use client";
import React, { useContext } from "react";
import { FarmContext } from "@/context/farm-provider";
import {
  Button,
  Divider,
  Grid,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import IntegrationTrigger from "./modalTrigger";
import { ArrowDownUp, ChevronDown, Repeat } from "lucide-react";
import Image from "next/image";
import { SwapContext } from "@/context/swap-provider";

function CreateFarmingPool() {
  const {
    address,
    handleSelectToken,
    setTokenIndex,
    stakedToken,
    rewardToken,
    handleChange,
    rewardPerBlock,
    startBlock,
    endBlock,
    tokensSelected,
    loading,
    handleCreate,
    currentBlock,
    liquidityPools,
  } = useContext(FarmContext);
  const { network } = useContext(SwapContext);

  return address ? (
    <div className="bg-cream p-4 rounded-xl shadow-md">
      <div>
        <div>
          <div className="w-full flex items-center justify-between">
            <Grid item xs={6}>
              <p className="font-semibold w-full text-md">Staked Liquidity</p>
            </Grid>
            <IntegrationTrigger
              title={"Select a Liquidity pool"}
              type="pool"
              selectToken={handleSelectToken}
              customTokens={Array.from(liquidityPools.entries()).map(
                (value: any, i: any) => {
                  return {
                    address: value[0],
                    name: `LP Token for ${value[1].tokenA.symbol} and ${value[1].tokenB.symbol}`,
                    symbol: `${value[1].tokenA.symbol}-${value[1].tokenB.symbol}`,
                    decimals: 18,
                  };
                },
              )}
            >
              <div
                onClick={() => {
                  setTokenIndex(0);
                }}
              >
                {Object.keys(stakedToken).length === 0 ? (
                  <div className="!w-full cursor-pointer bg-[#D7009A] text-white flex justify-between font-bold py-1 px-2 rounded-2xl">
                    Select a liquidity pool <ChevronDown className="mt-[1px]" />
                  </div>
                ) : (
                  <div className="!w-full right-0 float-end cursor-pointer bg-white flex justify-between font-bold py-1 px-2 rounded-2xl">
                    <Image
                      src={stakedToken.logo ? stakedToken.logo : network.image}
                      alt="eth"
                      width={25}
                      height={20}
                      className="mr-1"
                    />
                    {stakedToken.symbol}
                    <ChevronDown className="mt-[1px]" />
                  </div>
                )}
              </div>
            </IntegrationTrigger>
          </div>
          <div className="w-full mt-6 items-center flex justify-between">
            <Grid item xs={6}>
              <p className="font-semibold text-md">Reward Token</p>
            </Grid>
            <IntegrationTrigger
              title={"Select a token"}
              type="token"
              selectToken={handleSelectToken}
              erc20Only={true}
            >
              <div
                onClick={() => {
                  setTokenIndex(1);
                }}
              >
                {Object.keys(rewardToken).length === 0 ? (
                  <div className="!w-36 cursor-pointer bg-[#D7009A] text-white flex justify-between font-bold py-1 px-2 rounded-2xl">
                    Select token <ChevronDown className="mt-[1px]" />
                  </div>
                ) : (
                  <div className="!w-full !max-w-[118px] right-0 float-end cursor-pointer bg-white flex justify-between font-bold py-1 px-2 rounded-2xl">
                    <Image
                      src={rewardToken.logo ? rewardToken.logo : network.image}
                      alt="eth"
                      width={25}
                      height={20}
                      className="mr-1"
                    />
                    {rewardToken.symbol}
                    <ChevronDown className="mt-[1px]" />
                  </div>
                )}
              </div>
            </IntegrationTrigger>
          </div>
          <div className="w-full mt-6 flex items-center justify-between">
            <p className="font-semibold text-md">Reward Per Block</p>

            <input
              type="number"
              id="reward_per_block"
              value={rewardPerBlock == 0 ? "" : rewardPerBlock}
              onChange={handleChange}
              placeholder="0"
              className="bg-none w-1/2 text-xl font-bold placeholder:text-slate-500 placeholder:font-bold placeholder:text-3xl bg-white shadow-sm p-2 rounded-lg outline-none border-none"
            />
          </div>
          <div className="w-full mt-6 flex items-center justify-between">
            <p className="font-semibold text-md">Start Block</p>

            <input
              type="number"
              id="start_block"
              value={startBlock == 0 ? "" : startBlock}
              onChange={handleChange}
              placeholder={currentBlock.toString()}
              className="bg-none w-1/2 text-xl font-bold placeholder:text-slate-500 placeholder:font-bold placeholder:text-3xl bg-white shadow-sm p-2 rounded-lg outline-none border-none"
            />
          </div>
          <div className="w-full mt-6 flex items-center justify-between">
            <p className="font-semibold text-md">End Block</p>

            <input
              type="number"
              id="end_block"
              value={endBlock == 0 ? "" : endBlock}
              onChange={handleChange}
              placeholder="0"
              className="bg-none w-1/2 text-xl font-bold placeholder:text-slate-500 placeholder:font-bold placeholder:text-3xl bg-white shadow-sm p-2 rounded-lg outline-none border-none"
            />
          </div>

          <div>
            <h1 className="font-bold mt-4 text-xl">Note</h1>
            <p className="mt-2 text-md font-medium">
              We highly recommend setting block number greater than the current
              block number {currentBlock}.
            </p>
            {startBlock >= endBlock && (
              <p className="mt-2 text-md text-red-400 font-medium">
                <Alert severity="warning">
                  Start block number should be less than the end block number.
                </Alert>
              </p>
            )}
            {!tokensSelected && (
              <p className="mt-2 text-red-400 text-md font-medium">
                <Alert severity="warning">
                  Please select both staked and reward tokens.
                </Alert>
              </p>
            )}
          </div>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <Button
              className="w-full mt-3 bg-white"
              disabled={startBlock >= endBlock || !tokensSelected}
              fullWidth
              onClick={() => handleCreate()}
            >
              {loading ? (
                <CircularProgress sx={{ color: "#D7009A" }} />
              ) : (
                "Create"
              )}
            </Button>
          </Grid>
          <Grid item xs={4}></Grid>
        </div>
      </div>
    </div>
  ) : (
    <p className="h-[100px] font-semibold text-[#D7009A] justify-center items-center flex bg-cream rounded-xl mt-2  w-full">
      Please connect to a wallet to create staking pool
    </p>
  );
}

export default CreateFarmingPool;
