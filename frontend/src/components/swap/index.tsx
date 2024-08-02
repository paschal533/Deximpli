"use client"
import { ArrowDownUp, ChevronDown, Repeat } from "lucide-react"
import { Grid, Button, Collapse, Fab, CircularProgress, Typography, } from '@mui/material';
import { ConnectBTN } from '../customWallet'
import Image from 'next/image'
import EthImage from "../../../public/images/eth.png"
import IntegrationTrigger from './modalTrigger'
import { SwapContext } from '@/context/swap-provider'
import { useContext } from "react"
import { CssBaseline } from '@mui/material';

function Swap() {

  const {
    selectToken,
    initGraph,
    checkAllowance,
    handleApprove,
    handleChange,
    handleSwap,
    printSwapPath,
    estimatePriceImpact,
    handleWrap,
    getSpendingAmount,
    getReceivingAmount,
    handleMax,
    getBalances,
    tokenA, 
    setTokenA,
    tokenB, 
    setTokenB,
    amountA, 
    setAmountA,
    amountB, 
    setAmountB,
    balanceA, 
    setBalanceA,
    balanceB, 
    setBalanceB,
    price, 
    setPrice,
    priceImpact, 
    setPriceImpact,
    allowAmount, 
    setAllowAmount,
    paths, 
    setPaths,
    bestPath, 
    setBestPath, 
    hoverOnSwitch,
    setHoverOnSwitch,
    loading, 
    setLoading,
    indexTokenA,
    indexTokenB,
    graph,
    setGraph,
    tokensSelected,
    setTokensSelected,
    swapMode,
    setSwapMode,
    MODE_SWAP,
    MODE_WRAP,
    MODE_UNWRAP,
    tokenIndex, 
    setTokenIndex,
    active,
    isETH,
    network
  } =  useContext(SwapContext)

  return (
    <div>
    <div className='md:w-[500px] md:p-0 p-4 w-[90vw]'>
        <section className='h-[100px] bg-cream rounded-xl px-4 py-2  w-full'>
          <h1 className='text-md font-semibold text-gray-500'>Sell</h1>
          <div className='flex justify-between mt-2 w-full'>
            <input type='number' value={amountA == 0 ? '' : amountA} onChange={handleChange} onBlur={() => swapMode === MODE_SWAP && getReceivingAmount()} placeholder='0' className='bg-none text-3xl w-1/2 font-bold placeholder:text-slate-500 placeholder:font-bold placeholder:text-3xl bg-transparent outline-none border-none' />
            <IntegrationTrigger
                title={"Select a token"}
                type="token"
                selectToken={(token : any) =>
                  tokenIndex === indexTokenA ? selectToken(token, tokenB) : selectToken(tokenA, token)
                } 
              >
                 <div 
                   onClick={() => { setTokenIndex(indexTokenA); }}
                >
                  {Object.keys(tokenA).length === 0 ? (<div  className='!w-28 cursor-pointer bg-white flex justify-between font-bold py-1 px-2 rounded-2xl'><Image src={EthImage} alt="eth" width={25} height={20} /> ETH <ChevronDown className='mt-[1px]' /></div>) : (<div  className='!w-28 cursor-pointer bg-white flex justify-between font-bold py-1 px-2 rounded-2xl'><Image src={tokenA.logo ? tokenA.logo : network.image} className="mr-1" alt="eth" width={25} height={20} /> {tokenA.symbol}<ChevronDown className='mt-[1px]' /></div>)}</div>
              </IntegrationTrigger>
          </div>
        </section>
        <div className="w-full justify-center items-center flex">
          <section
            onClick={() => selectToken(tokenB, tokenA)}
            onMouseEnter={() => setHoverOnSwitch(true)}
            onMouseLeave={() => setHoverOnSwitch(false)}
            className='bg-cream justify-center border-white absolute rounded-xl border-4 items-center flex w-10 h-10'>
            {hoverOnSwitch ? <Repeat /> : <ArrowDownUp />}
          </section>
        </div>
        <section className='h-[100px] mt-2 bg-cream  px-4 py-2 rounded-xl  w-full'>
        <h1 className='text-md font-semibold text-gray-500'>Buy</h1>
          <div className='flex justify-between mt-2 w-full'>
            <input type='number' value={amountB == 0 ? '' : amountB} onChange={handleChange} onBlur={() => swapMode === MODE_SWAP && getSpendingAmount()} placeholder='0' className='bg-none w-1/2 text-3xl font-bold placeholder:text-slate-500 placeholder:font-bold placeholder:text-3xl bg-transparent outline-none border-none' />
            <IntegrationTrigger
                title={"Select a token"}
                type="token"
                selectToken={(token : any) =>
                  tokenIndex === indexTokenA ? selectToken(token, tokenB) : selectToken(tokenA, token)
                } 
              >
                <div 
                  onClick={() => {setTokenIndex(indexTokenB)}}
                >
                  {Object.keys(tokenB).length === 0 ? (<div className='!w-36 cursor-pointer bg-[#D7009A] text-white flex justify-between font-bold py-1 px-2 rounded-2xl'> Select token <ChevronDown className='mt-[1px]' /></div>) : (<div  className='!w-28 cursor-pointer bg-white flex justify-between font-bold py-1 px-2 rounded-2xl'><Image src={tokenB.logo ? tokenB.logo : network.image} alt="eth" width={25} height={20} className="mr-1" /> {tokenB.symbol}<ChevronDown className='mt-[1px]' /></div>)}</div>
              </IntegrationTrigger>
          </div>
        </section>
        <CssBaseline />
        <Collapse in={price > 0 || swapMode !== MODE_SWAP} >
          {swapMode === MODE_SWAP ? <>
            <Grid container justifyContent="space-between mt-2" alignItems="center">
              <Grid item sx={{ fontWeight: 600 }}>Price</Grid>
              <Grid item>{price.toFixed(2)} {tokenA.symbol} per {tokenB.symbol}</Grid>
            </Grid>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item sx={{ fontWeight: 600 }}>Price Impact</Grid>
              <Grid item>{priceImpact.toFixed(2)} %</Grid>
            </Grid>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item sx={{ fontWeight: 600 }}>Path</Grid>
              <Grid item>{printSwapPath(bestPath)}</Grid>
            </Grid>
          </> : <Typography className='h-[50px] !font-medium !mt-2 bg-cream  px-4 py-2 rounded-xl  w-full'>
            The exchange rate from {swapMode === MODE_WRAP ? "ETH to WETH" : "WETH to ETH"} is always 1:1
          </Typography>}
        </Collapse>
        <section>
        {active ? <Grid item xs={12}>
            {allowAmount < amountA && swapMode === MODE_SWAP && !isETH(tokenA) ?
              <Button className="h-[50px] font-semibold text-[#D7009A] justify-center items-center flex bg-cream rounded-xl mt-2  w-full" fullWidth onClick={() => handleApprove()}>
                {loading ? <CircularProgress sx={{ color: 'white' }} /> : `Enable ${tokenA.symbol}`}
              </Button> : <Button className="h-[50px] font-semibold text-[#D7009A] justify-center items-center flex bg-cream rounded-xl mt-2  w-full" disabled={amountA <= 0 || amountB <= 0 || balanceA < amountA || loading}
                fullWidth onClick={() => swapMode === MODE_SWAP ? handleSwap() : handleWrap()}>
                {loading ? <CircularProgress sx={{ color: 'white' }} /> : (
                  balanceA < amountA ? "Insufficient Balance" : (swapMode === MODE_SWAP ? "Swap" :
                    (swapMode === MODE_WRAP ? "Wrap" : "Unwrap")))}
              </Button>}
          </Grid> : <ConnectBTN />}
        </section>
    </div>
    </div>
  )
}

export default Swap