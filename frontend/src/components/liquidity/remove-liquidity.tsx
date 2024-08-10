"use client"
import { useState, useEffect, useCallback, useContext } from 'react';
import { Button, Divider, Grid, Typography, Box, Slider, TextField, IconButton, CircularProgress } from '@mui/material';
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from 'react-toastify';
import { TokenPairABI } from '@/utils/TokenPairABI';
import AMMRouterAddress from '@/contracts/AMMRouter-address.json';
import AMMRouterABI from '@/contracts/AMMRouter.json';
import { SuppotedPairFactoryContractAddress, SuppotedAMMRouterContractAddress } from '@/utils/Tokens';
import { useEthersProvider, useEthersSigner } from '@/components/Wallet';
import { ethers } from 'ethers';
import { getErrorMessage, getTokenInfo, toString, isETH } from '@/utils/Helper';
import { useAccount } from 'wagmi'
import { getBalance } from '@wagmi/core'
import { configConnect } from '@/blockchain/config';
import { SwapContext } from '@/context/swap-provider';


const RemoveLiquidity = ({ liquidityPair } : { liquidityPair : any }) => {
  const { address, isConnecting, connector: activeConnector, } = useAccount()
  const { provider } = useContext(SwapContext);
  const signer = useEthersSigner()
  const [tokenA, setTokenA] = useState<any>({});
  const [tokenB, setTokenB] = useState<any>({});
  const [reserveA, setReserveA] = useState<any>(0);
  const [reserveB, setReserveB] = useState<any>(0);
  const [pair, setPair] = useState<any>(liquidityPair);
  const [balance, setBalance] = useState<any>(0);
  const [amount, setAmount] = useState<any>(0);
  const [totalSupply, setTotalSupply] = useState<any>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [allowAmount, setAllowAmount] = useState<any>(0);

  // Set token information and reserves using pair address (tokens are unknown)
  const setTokenInfo = useCallback(async (pairAddress : any) => {
    try {
      const tokenPair = new ethers.Contract(pairAddress, TokenPairABI, signer);
      const _tokenA = await getTokenInfo(await tokenPair.tokenA(), provider);
      const _tokenB = await getTokenInfo(await tokenPair.tokenB(), provider);
      setTokenA(_tokenA);
      setTokenB(_tokenB);
      setPair(pairAddress);
    } catch (error) {
      toast.error(getErrorMessage(error, "Cannot fetch token information for the pair!"), { toastId: 'PAIR_0' })
      console.error(error);
    }
  }, [signer, provider]);

  const getBalance = useCallback(async () => {
    try {
      const tokenPair = new ethers.Contract(pair, TokenPairABI, signer);
      const _balance = await tokenPair.balanceOf(address);
      setBalance(ethers.utils.formatUnits(_balance));
    } catch (error) {
      toast.error(getErrorMessage(error, "Cannot get LP token balance!"));
      console.error(error);
    }
  }, [address, pair, signer]);

  const getReserves = useCallback(async () => {
    try {
      const tokenPair = new ethers.Contract(pair, TokenPairABI, signer)
      const [_reserveA, _reserveB,] = await tokenPair.getReserves();
      setReserveA(ethers.utils.formatUnits(_reserveA, tokenA.decimals));
      setReserveB(ethers.utils.formatUnits(_reserveB, tokenB.decimals));
    } catch (error) {
      toast.error(getErrorMessage(error, "Cannot get reserves!"));
      console.error(error);
    }
  }, [signer, pair, tokenA, tokenB]);

  const getTotalSupply = useCallback(async () => {
    try {
      const tokenPair = new ethers.Contract(pair, TokenPairABI, signer)
      const _totalSupply = await tokenPair.totalSupply();
      setTotalSupply(ethers.utils.formatUnits(_totalSupply));
    } catch (error) {
      toast.error(getErrorMessage(error, "Cannot get total supply of token pair!"));
      console.error(error);
    }
  }, [signer, pair]);

  const getAllowance = useCallback(async () => {
    try {
      const tokenPair = new ethers.Contract(pair, TokenPairABI, signer);
      const _allowAmount = await tokenPair.allowance(address, SuppotedAMMRouterContractAddress(provider?._network.chainId));
      setAllowAmount(ethers.utils.formatUnits(_allowAmount));
    } catch (error) {
      toast.error(getErrorMessage(error, "Cannot get allowance of token pair!"));
      console.error(error);
    }
  }, [address, signer, pair, provider?._network.chainId]);

  useEffect(() => {
    if (liquidityPair && address) {
      if (!liquidityPair) {
        setTokenInfo(liquidityPair);
      } else {
        getBalance();
        getTotalSupply();
        getReserves();
        getAllowance();
      }
    }
  }, [liquidityPair, address, setTokenInfo, getBalance, getReserves, getAllowance, getTotalSupply]);

  const handleChange = (e : any) => {
    let tmpVal = e.target.value ? e.target.value : 0;
    if (tmpVal < 0 || isNaN(tmpVal) || Number(tmpVal) > balance) {
      return;
    } else if (!(typeof tmpVal === 'string' && (tmpVal.endsWith(".") || tmpVal.startsWith(".")))) {
      tmpVal = toString(Number(e.target.value.toString()));
    }
    setAmount(tmpVal);
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const tokenPair = new ethers.Contract(pair, TokenPairABI, signer);
      const _allowAmount = ethers.utils.parseUnits(toString(amount));
      const tx = await tokenPair.approve(SuppotedAMMRouterContractAddress(provider?._network.chainId), _allowAmount);
      await tx.wait();
      toast.info("Liquidity removal is enabled!");
      await getAllowance();
    } catch (error) {
      toast.error(getErrorMessage(error, "Cannot enable liquidity removal!"));
      console.log(error);
    }
    setLoading(false);
  }

  const handleRemoveLiquidity = async () => {
    setLoading(true);
    try {
      const ammRouter = new ethers.Contract(SuppotedAMMRouterContractAddress(provider?._network.chainId), AMMRouterABI.abi, signer);
      //@ts-ignore
      const deadline = parseInt(new Date().getTime() / 1000) + 30;
      let tx;
      if (isETH(tokenA, provider)) {
        tx = await ammRouter.removeLiquidityETH(tokenB.address,
          ethers.utils.parseUnits(toString(amount)), 0, 0, address, deadline);
      } else if (isETH(tokenB, provider)) {
        tx = await ammRouter.removeLiquidityETH(tokenA.address,
          ethers.utils.parseUnits(toString(amount)), 0, 0, address, deadline);
      } else {
        tx = await ammRouter.removeLiquidity(tokenA.address, tokenB.address,
          ethers.utils.parseUnits(toString(amount)), 0, 0, address, deadline);
      }
      await tx.wait();
      toast.info(`Liquidity removal succeeded! Transaction Hash: ${tx.hash}`);
      setAmount(0);
      await getBalance();
      await getReserves();
      await getTotalSupply();
    } catch (error) {
      toast.error(getErrorMessage(error, "Cannot remove liquidity!"));
      console.log(error);
    }
    setLoading(false);
  }

  let amountPercent = 100 * amount / balance;
  amountPercent = isNaN(amountPercent) ? 0 : amountPercent;

  return (address ? (pair ? <>
    <Grid container alignItems="center" columnGap={12}>
      <Grid item>
        <Typography>Remove {tokenA.symbol}/{tokenB.symbol} LP Token</Typography>
        <Typography>To receive {tokenA.symbol} and {tokenB.symbol}</Typography>
      </Grid>
    </Grid>
    <Divider />
    <Grid container justifyContent="space-between" alignItems="center" columnSpacing={4}>
      <Grid item xs={6}>
        <Typography>Amount</Typography>
        <Typography>LP Tokens to Remove / Total</Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField value={amount} onChange={handleChange} />
        <Typography>Balance: {Number(balance).toFixed(2)}</Typography>
      </Grid>
    </Grid>
    <Box width="100%">
      <Typography>Removal Percentage: {amountPercent.toFixed(2)} %</Typography>
      <Slider value={amountPercent} onChange={(e, value : any) => setAmount(balance * value / 100)} />
      <Grid container justifyContent="space-between" alignItems="center">
        <Button onClick={() => setAmount(balance * 0.25)}>25%</Button>
        <Button onClick={() => setAmount(balance * 0.5)}>50%</Button>
        <Button onClick={() => setAmount(balance * 0.75)}>75%</Button>
        <Button onClick={() => setAmount(balance)}>100%</Button>
      </Grid>
    </Box>
    <Grid container justifyContent="center">
      <ArrowDownwardIcon />
    </Grid>
    <Typography>You will receive approximately:</Typography>
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography>Pooled {tokenA.symbol}</Typography>
      </Grid>
      <Grid item>
        <Typography>{(reserveA * amount / totalSupply).toFixed(2)}</Typography>
      </Grid>
    </Grid>
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography>Pooled {tokenB.symbol}</Typography>
      </Grid>
      <Grid item>
        <Typography>{(reserveB * amount / totalSupply).toFixed(2)}</Typography>
      </Grid>
    </Grid>
    <Grid container className='mt-2'>
      <Grid item xs={6}>
        <Button className='text-[#D7009A] rounded-md !bg-white font-semibold' disabled={allowAmount >= amount} fullWidth onClick={handleApprove}>
          {loading && allowAmount < amount ? <CircularProgress sx={{ color: '#D7009A' }} /> : "Enable"}
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button className='text-[#D7009A] rounded-md !bg-white font-semibold' disabled={amount <= 0 || allowAmount < amount} fullWidth
          onClick={handleRemoveLiquidity}>
          {loading && allowAmount >= amount ? <CircularProgress sx={{ color: '#D7009A' }} /> : "Remove"}
        </Button>
      </Grid>
    </Grid>
  </> : <h1 className="h-[50px] font-semibold text-[#D7009A] justify-center items-center flex bg-cream rounded-xl mt-2  w-full">No pair specified!</h1>
  ) : <h1 className="h-[50px] font-semibold text-[#D7009A] justify-center items-center flex bg-cream rounded-xl mt-2  w-full">Please connect wallet first!</h1>);
};

export default RemoveLiquidity;