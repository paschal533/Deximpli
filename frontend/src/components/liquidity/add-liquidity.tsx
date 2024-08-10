"use client"
import React, { useContext } from 'react'
import { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from "@web3-react/core";
import { Button, Divider, Grid, Typography, useTheme, TextField, IconButton, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { LiquidityContext } from '@/context/liquidity-provider';
import { ArrowDownUp, ChevronDown, Repeat } from "lucide-react"
import {  Collapse, Fab, } from '@mui/material';
import { ConnectBTN } from '../customWallet'
import Image from 'next/image'
import EthImage from "../../../public/images/eth.png"
import IntegrationTrigger from './modalTrigger'
import { CssBaseline } from '@mui/material';
import { SwapContext } from '@/context/swap-provider';

function AddLiquidity() {
  const {
    address, 
    tokenA, 
    handleChange, 
    tokenB, 
    amountA, 
    amountB, 
    balanceA, 
    balanceB,
    tokensSelected,
    getPrice,
    indexTokenA,
    indexTokenB,
    getSharePercent,
    handleApprove,
    allowA,
    allowB,
    handleAddLiquidity,
    availableBalance,
    loading,
    setTokenIndex,
    handleSelectToken,
  } = useContext(LiquidityContext);

  const { network } = useContext(SwapContext)

  return (
     
    <div>
    <div className='md:w-[500px] md:p-0 p-4 w-[90vw]'>
        <section className='h-[100px] bg-cream rounded-xl px-4 py-2  w-full'>
         {address && <h1 className='text-md font-semibold text-gray-500'>Balance: {balanceA.toFixed(2)}</h1>}
          <div className='flex justify-between mt-2 w-full'>
            <input type='number' id="tokenA" value={amountA == 0 ? '' : amountA} onChange={handleChange} placeholder='0' className='bg-none text-3xl w-1/2 font-bold placeholder:text-slate-500 placeholder:font-bold placeholder:text-3xl bg-transparent outline-none border-none' />
            <IntegrationTrigger
                title={"Select a token"}
                type="token"
                selectToken={handleSelectToken}
              >
                 <div 
                   onClick={() => { setTokenIndex(0); }}
                >
                  {Object.keys(tokenA).length === 0 ? (
                      <div className='!w-36 cursor-pointer bg-[#D7009A] text-white flex justify-between font-bold py-1 px-2 rounded-2xl'> 
                      Select token <ChevronDown className='mt-[1px]' /></div>) : (<div  className='!w-full cursor-pointer bg-white flex justify-between font-bold py-1 px-2 rounded-2xl'><Image src={tokenA.logo ? tokenA.logo : network.image} className="mr-1" alt="eth" width={25} height={20} /> {tokenA.symbol}<ChevronDown className='mt-[1px]' /></div>)}</div>
              </IntegrationTrigger>
          </div>
        </section>
        <section className='h-[100px] mt-2 bg-cream  px-4 py-2 rounded-xl  w-full'>
        {address && <h1 className='text-md font-semibold text-gray-500'>Balance: {balanceB.toFixed(2)}</h1>}
          <div className='flex justify-between mt-2 w-full'>
            <input type='number' id="tokenB" value={amountB == 0 ? '' : amountB} onChange={handleChange} placeholder='0' className='bg-none w-1/2 text-3xl font-bold placeholder:text-slate-500 placeholder:font-bold placeholder:text-3xl bg-transparent outline-none border-none' />
            <IntegrationTrigger
                title={"Select a token"}
                type="token"
                selectToken={handleSelectToken}
              >
                <div 
                  onClick={() => {setTokenIndex(1)}}
                >
                  {Object.keys(tokenB).length === 0 ? (
                    <div className='!w-36 cursor-pointer bg-[#D7009A] text-white flex justify-between font-bold py-1 px-2 rounded-2xl'> 
                    Select token <ChevronDown className='mt-[1px]' /></div>) : (<div  className='w-full cursor-pointer bg-white flex justify-between font-bold py-1 px-2 rounded-2xl'><Image src={tokenB.logo ? tokenB.logo : network.image} alt="eth" width={25} height={20} className="mr-1" /> {tokenB.symbol}<ChevronDown className='mt-[1px]' /></div>)}</div>
              </IntegrationTrigger>
          </div>
        </section>
        <CssBaseline />
        <section>
        {address ? <div>
          {tokensSelected ? <div className="h-[100px] space-x-4 mt-2 font-semibold justify-between py-4 px-4 items-center flex bg-cream rounded-xl  w-full">
        <Grid item md={4}>
          <Grid container direction="column" alignItems="center" >
            <Grid item><h1 className='font-semibold'>{getPrice(indexTokenB)}</h1></Grid>
            <Grid item><h1>{tokenA.symbol} per {tokenB.symbol}</h1></Grid>
          </Grid>
        </Grid>
        <Grid item md={4}>
          <Grid container direction="column" alignItems="center" >
            <Grid item><h1>{getPrice(indexTokenA)}</h1></Grid>
            <Grid item><h1>{tokenB.symbol} per {tokenA.symbol}</h1></Grid>
          </Grid>
        </Grid>
        <Grid item md={4}>
          <Grid container direction="column" alignItems="center" >
            <Grid item><h1>{getSharePercent()} %</h1></Grid>
            <Grid item><h1>Share of Pool</h1></Grid>
          </Grid>
        </Grid>
      </div> : <h1 className="h-[50px] font-semibold text-[#D7009A] justify-center items-center flex bg-cream rounded-xl mt-2  w-full">No information! Please select a pair of tokens.</h1>}
      {tokensSelected && <Grid container spacing={1}>
        {!allowA && <Grid item xs={12}>
          <Button className="h-[50px] font-semibold text-[#D7009A] justify-center items-center flex bg-cream rounded-xl mt-2  w-full" fullWidth
            onClick={() => handleApprove(indexTokenA)}>
            Enable {tokenA.symbol}
          </Button>
        </Grid>}
        {!allowB && <Grid item xs={12}>
          <Button className="h-[50px] font-semibold text-[#D7009A] justify-center items-center flex bg-cream rounded-xl mt-2  w-full" fullWidth
            onClick={() => handleApprove(indexTokenB)}>
            Enable {tokenB.symbol}
          </Button>
        </Grid>}
        <Grid item xs={12}>
          <Button className="h-[50px] font-semibold text-[#D7009A] justify-center items-center flex bg-cream rounded-xl mt-2  w-full" fullWidth
            disabled={!allowA || !allowB || !availableBalance || amountA <= 0 || amountB <= 0 }
            onClick={handleAddLiquidity}
          >
            {availableBalance ? (loading ? <CircularProgress sx={{ color: 'white' }} /> : "Supply") : "Insufficent Balance"}
          </Button>
        </Grid>
      </Grid>}
        </div> : <ConnectBTN />}
        </section>
    </div>
    </div>
     
  )
}

export default AddLiquidity