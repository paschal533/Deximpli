"use client"
import { useContext } from 'react';
import {
  Grid, useTheme, Button, Accordion, AccordionSummary, AccordionDetails,
  Typography, CircularProgress
} from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalIcon from '@/icons/cal-icon'
import PersonIcon from '@/icons/person-icon'
import { ethers } from 'ethers';
import { DollarSign } from 'lucide-react'
import { LoanContext } from '@/context/loan-provider';
import { getTokenInfo, formatInterest, formatEtherOrNA, boolOrNA } from '@/utils/Helper';
import IntegrationTrigger from "./modalTrigger"
import DashboardCard from './cards';

const ListAssetPools = () => {

    const { 
        address,
        loading,
        userInfo,
        pools,
        handleChange,
        expanded,
        ACTIVE,
        INACTIVE,
        loadingInfo

    } = useContext(LoanContext)

  return <div className='w-full !max-w-[1000px] mb-8'>
    {address ? (loading ? <div className='bg-cream p-3 items-center flex justify-center h-[100px] text-center rounded-lg mt-2 font-semibold'><CircularProgress /></div>  : <>
      <div className="flex gap-3 flex-wrap">
          <DashboardCard
            value={`${formatEtherOrNA(userInfo.totalDeposit)} ETH`}
            title="Total Deposit"
            icon={<PersonIcon />}
          />
          <DashboardCard
            value={`${formatEtherOrNA(userInfo.totalBorrow)} ETH`}
            title="Total Borrowed "
            icon={<CalIcon />}
          />
          <DashboardCard
            value={`${formatEtherOrNA(userInfo.maxBorrowable)} ETH`}
            title="Maximum Borrowable"
            icon={<DollarSign />}
          />
          <DashboardCard
            value={boolOrNA(userInfo.isAccountHealthy)}
            title="Is Account Healthy"
            icon={<DollarSign />}
          />
        </div>
    <div className='pr-4'>
        <h1 className='mt-4 text-3xl font-bold'>Borrow Assets</h1>
      {!loadingInfo ? pools.length > 0 ? pools.map((pool : any, index : any) =>
        <Accordion key={`asset-pool-${index}`}
          expanded={expanded === pool.assetToken.address}
          onChange={handleChange(pool.assetToken.address)}
          className='h-full p-4 !bg-cream !border-t-0 !border-none mt-4  !rounded-xl w-full'
          >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div className='w-full justify-between flex font-semibold text-md pr-2'>
              <Grid item>{pool.assetToken.name} ({pool.assetToken.symbol})</Grid>
              <Grid item>Lending APY: {formatInterest(pool.lendingInterest)}</Grid>
              <Grid item>Borrowing APY: {formatInterest(pool.borrowInterest)}</Grid>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container className='font-medium text-md' spacing={2}>
              <Grid item md={6}>
                Total Liquidity: {Number(ethers.utils.formatUnits(pool.totalLiquidity, pool.assetToken.decimals)).toFixed(4)}
              </Grid>
              <Grid item md={6}>
                Available Liquidity: {Number(ethers.utils.formatUnits(pool.availableLiquidity, pool.assetToken.decimals)).toFixed(4)}
              </Grid>
              <Grid item md={6}>
                Lent Balance : {Number(ethers.utils.formatUnits(pool.liquidityBalance, pool.assetToken.decimals)).toFixed(4)}
              </Grid>
              <Grid item md={6}>
                Borrowed Balance: {Number(ethers.utils.formatUnits(pool.BorrowBalance, pool.assetToken.decimals)).toFixed(4)}
              </Grid>
            </Grid>
            <div>
            <div className='w-full mb-3 !mt-4 space-x-2 flex justify-between'>
              <div className='w-1/2'>
              <IntegrationTrigger
                title={"Deposit Token"}
                type="deposit"
                selectToken={pool.assetToken.address}
              >
                <Button className='text-[#D7009A] !rounded-md !bg-white !font-semibold' fullWidth disabled={pool.status !== ACTIVE}
                  onClick={() => {}}>Deposit</Button>
              </IntegrationTrigger>
              </div>
              <div className='w-1/2'>
              <IntegrationTrigger
                title={"Withdraw Token"}
                type="withdraw"
                selectToken={pool.assetToken.address}
              >
                <Button className='text-[#D7009A] !rounded-md !bg-white !font-semibold' fullWidth disabled={pool.status === INACTIVE}>Withdraw</Button>
              </IntegrationTrigger>
              </div>
              </div>
              <div className='w-full space-x-2 flex justify-between'>
              <div className='w-1/2'>
              <IntegrationTrigger
                title={"Borrow Token"}
                type="borrow"
                selectToken={pool.assetToken.address}
              >
                <Button className='text-[#D7009A] !rounded-md !bg-white !font-semibold' fullWidth disabled={pool.status === ACTIVE}>
                Borrow
                </Button>
                </IntegrationTrigger>
              </div>
              <div className='w-1/2'>
              <IntegrationTrigger
                title={"Repay Token"}
                type="repay"
                selectToken={pool.assetToken.address}
              >
                <Button disabled={pool.status === INACTIVE} className='text-[#D7009A] !rounded-md !bg-white !font-semibold' fullWidth
                  >Repay</Button>
              </IntegrationTrigger>
              </div>
            </div>
          </div>
          </AccordionDetails>
        </Accordion>) : <p className='bg-cream p-3 items-center flex justify-center h-[100px] text-center rounded-lg mt-2 font-semibold'>Cannot load asset pools!</p> : <div className='bg-cream p-3 items-center flex justify-center h-[100px] text-center rounded-lg mt-2 font-semibold'><CircularProgress /></div> } </div></>) :
      <p className='bg-cream p-3 items-center flex justify-center h-[100px] text-center rounded-lg mt-2 font-semibold'>Please connect to a wallet to view asset pools.</p>}
    
  </div>;
};

export default ListAssetPools;