"use client"
import React from 'react'
import { useState, useContext } from 'react';
import { StakeContext } from '@/context/stake-provider';
import { ethers } from 'ethers';
import {
  Grid, useTheme, Button, Accordion, AccordionSummary, AccordionDetails,
  Typography, CircularProgress, FormControlLabel, FormGroup, Checkbox
} from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IntegrationTrigger from './modalTrigger'

function ListStake() {
  const {
    address,
    stakingPools,
    hideExpired,
    currentBlock,
    handleHideExpired,
    expanded,
    handleClick,
    loading,
    handleHarvest,
  } = useContext(StakeContext);

  return (
    <div className='w-full'>
    <Grid container direction="column">
    {address ? <>
      <FormGroup className='!border-b-0 !border-none'>
        <FormControlLabel className='!border-b-0 !border-none' label="Hide Expired Pools" control={<Checkbox checked={hideExpired} onChange={handleHideExpired} />} />
      </FormGroup>
      {stakingPools.length > 0 ? stakingPools.filter((p : any) => hideExpired ? p.rewardEndBlock > currentBlock : true).map((item : any, index : any) =>
        <Accordion
          key={`staking-pool-${index}`}
          expanded={expanded === item.address}
          onChange={handleClick(item)}
          className='h-full p-4 bg-cream !border-t-0 !border-none  rounded-xl w-full shadow-md'
          sx={{ my: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
             <div className='flex-col w-full'>
             <div className='flex w-full font-semibold text-md justify-between'>
              <Grid item className='font-semibold text-md'>Stake: <span className='text-md font-medium'>{item.stakedToken.symbol}</span></Grid>
              <Grid item>Earn: <span className='text-md font-medium'>{item.rewardToken.symbol}</span></Grid>
              <Grid item>{item.rewardToken.symbol} Earned: <span className='text-md font-medium'>{ethers.utils.formatUnits(item.pendingReward, item.rewardToken.decimals)}</span></Grid>
            </div>
            <div className='flex mt-2 font-semibold justify-between text-md w-full space-x-3'>
              <Grid item>Total Staked: <span className='text-md font-medium'>{ethers.utils.formatUnits(item.stakedTotal, item.stakedToken.decimals)}</span></Grid>
              <Grid item>Reward Per Block: <span className='text-md font-medium'>{ethers.utils.formatUnits(item.rewardPerBlock, item.rewardToken.decimals)}</span></Grid>
            </div>
            <div className='mt-2 font-semibold text-md'>
              <Grid item>{currentBlock >= item.rewardEndBlock ? "Expired" :
                (currentBlock >= item.rewardStartBlock ? `Ends in ${Number(item.rewardEndBlock) - Number(currentBlock)} block(s)` :
                  `Starts in ${item.rewardStartBlock - currentBlock} block(s)`)}</Grid>
            </div>
             </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className='w-full mb-3 space-x-2 flex justify-between'>
              <div className='w-1/2'>
              <IntegrationTrigger
                title={"Deposit Token"}
                type="Deposit-token"
                selectToken={item.address}
              >
                <Button className='text-[#D7009A] rounded-md bg-white font-semibold' fullWidth disabled={currentBlock >= item.rewardEndBlock}
                  onClick={() => {} /*navigate(`deposit?pool=${item.address}`)*/}>Deposit</Button>
              </IntegrationTrigger>
              </div>
              <div className='w-1/2'>
              <IntegrationTrigger
                title={"Withdraw Staked Token"}
                type="withdraw-stake"
                selectToken={item.address}
              >
                <Button className='text-[#D7009A] rounded-md bg-white font-semibold' fullWidth disabled={item.stakedAmount.lte(0)}>Withdraw</Button>
              </IntegrationTrigger>
              </div>
              </div>
              <div className='w-full space-x-2 flex justify-between'>
              <div className='w-1/2'>
                <Button className='text-[#D7009A] w-full rounded-md bg-white font-semibold' fullWidth disabled={item.pendingReward.lte(0)} onClick={() => handleHarvest(item.address)}>
                  {loading ? <CircularProgress /> :
                    `Harvest ${ethers.utils.formatUnits(item.pendingReward, item.rewardToken.decimals)} ${item.rewardToken.symbol}`}
                </Button>
              </div>
              <div className='w-1/2'>
              <IntegrationTrigger
                title={"Supply Reward Token"}
                type="supply-reward"
                selectToken={item.address}
              >
                <Button className='text-[#D7009A] w-full rounded-md bg-white font-semibold' fullWidth
                  onClick={() => {} /*navigate(`supply?pool=${item.address}`)*/}>Supply Reward</Button>
              </IntegrationTrigger>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>) : <p className='bg-cream p-3 items-center flex justify-center h-[100px] text-center rounded-lg mt-2 font-semibold'>No Staking Pool Found</p>}
    </> : <p className='bg-cream p-3 items-center flex justify-center h-[100px] text-center rounded-lg mt-2 font-semibold'>Please connect to a wallet to view staking pools.</p>}
  </Grid>
  </div>
)
}

export default ListStake