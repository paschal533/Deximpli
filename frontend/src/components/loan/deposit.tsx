"use client"
import { useState, useEffect, useCallback, useContext } from 'react';
import { useWeb3React } from "@web3-react/core";
import { Button, Divider, Grid, Typography, useTheme, TextField, IconButton, CircularProgress } from '@mui/material';
import { ethers } from 'ethers';
import { ERC20ABI } from '@/utils/ERC20ABI';
import { toast } from 'react-toastify';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getTokenInfo, toString } from '@/utils/Helper';
import AssetPoolABI from '@/contracts/AssetPool.json';
import { SuppotedAssetPoolContractAddress } from '@/utils/Tokens';
import { LoanContext } from '@/context/loan-provider';

const Deposit = ({ tokenAddress } : { tokenAddress : any}) => {
  const { address, provider, signer } = useContext(LoanContext)
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<any>({});
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [allow, setAllow] = useState(0);

  const getBalance = useCallback(async (tokenObject : any) => {
    try {
      const tokenContract = new ethers.Contract(tokenObject.address, ERC20ABI, signer);
      const _balance = await tokenContract.balanceOf(address);
      setBalance(Number(ethers.utils.formatUnits(_balance, tokenObject.decimals)));
    } catch (error) {
      toast.error("Cannot get token balance for deposit!");
      console.error(error);
    }
  }, [signer, address]);

  const checkAllowance = useCallback(async (tokenObject : any) => {
    try {
      const tokenContract = new ethers.Contract(tokenObject.address, ERC20ABI, signer);
      let _allow = await tokenContract.allowance(address, SuppotedAssetPoolContractAddress(provider?._network.chainId));
      setAllow(Number(ethers.utils.formatUnits(_allow, tokenObject.decimals)));
    } catch (error) {
      toast.error("Cannot get allowance for token!");
      console.error(error);
    }
  }, [address, signer, provider]);

  const loadDepositInfo = useCallback(async (tokenAddress : any) => {
    setLoading(true);
    try {
      const tokenObject = await getTokenInfo(tokenAddress, provider);
      setToken(tokenObject);
      await getBalance(tokenObject);
      await checkAllowance(tokenObject);
    } catch (error) {
      toast.error("Failed to load information for deposit!");
      console.log(error);
    }
    setLoading(false);
  }, [getBalance, checkAllowance, provider]);

  const handleChange = (e : any) => {
    let tmpVal = e.target.value ? e.target.value : 0;
    if (tmpVal < 0 || isNaN(tmpVal)) {
      return;
    } else if (!(typeof tmpVal === 'string' && (tmpVal.endsWith(".") || tmpVal.startsWith(".")))) {
      tmpVal = Number(e.target.value.toString());
    }
    setAmount(tmpVal);
  }

  const handleApprove = async () => {
    setLoading(true);
    try {
      const tokenContract = new ethers.Contract(token.address, ERC20ABI, signer);
      const allowAmount = ethers.utils.parseUnits(toString(amount), token.decimals);
      const tx = await tokenContract.approve(SuppotedAssetPoolContractAddress(provider?._network.chainId), allowAmount);
      await tx.wait()
      toast.info("Deposit amount is approved!");
      await checkAllowance(token);
    } catch (error) {
      toast.error("Cannot approve the deposited amount!");
      console.error(error);
    }
    setLoading(false);
  }

  const handleDeposit = async () => {
    setLoading(true);
    try {
      const assetPool = new ethers.Contract(SuppotedAssetPoolContractAddress(provider?._network.chainId), AssetPoolABI.abi, signer);
      const tx = await assetPool.deposit(token.address, ethers.utils.parseUnits(toString(amount), token.decimals));
      await tx.wait();
      toast.info(`Deposit token successfully! Transaction hash: ${tx.hash}`);
      setAmount(0);
      await checkAllowance(token);
      await getBalance(token);
    } catch (error) {
      toast.error("Cannot deposit token!");
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (address && tokenAddress) {
      loadDepositInfo(tokenAddress);
    }
  }, [address, loadDepositInfo, tokenAddress]);

  if (!address) {
    return <p className='h-[50px] text-center !font-medium !mt-2 bg-cream px-4 py-2 rounded-xl  w-full'>Please connect to a wallet</p>;
  } else if (Object.keys(token).length === 0) {
    return <p className='h-[50px] text-center !font-medium !mt-2 px-4 py-2 rounded-xl  w-full'><CircularProgress sx={{ color: '#D7009A', height: "10px" }} /></p>
  }

  return <div>
    <Grid item>
      <Grid container columnGap={12}>
        <Grid item>
          <Typography sx={{ mt: 1 }}>Make Deposit</Typography>
        </Grid>
      </Grid>
      <Divider />
      <div>
         
          <div className='w-full p-2 mt-2 flex-col items-center'>
                 
                 <p className='font-semibold text-md'>Amount to Deposit</p>
 
                 <input type='number' id="reward_per_block"  value={amount == 0 ? '' : amount} 
                 onChange={handleChange} placeholder={`enter deposit token (${token.symbol}) amount`} 
                 className='bg-none w-full mt-2 text-lg font-normal placeholder:text-slate-500 placeholder:font-normal placeholder:text-lg  bg-cream shadow-sm p-2 rounded-lg outline-none border-none' />
             </div>
             <div className='w-full flex justify-between pr-2 items-center'>
        <p className='p-2 font-semibold'>Balance of {token.symbol}:</p>
        <div className='space-x-1 justify-center items-center'>
        <span className='font-medium'> {balance}</span>
        <div className="text-xs cursor-pointer float-end font-semibold text-[#D7009A]" onClick={() => setAmount(balance)} >Max</div>
        </div>
        </div>
        <Grid item xs={4}></Grid>
        <div className='w-full flex space-x-2 p-2'>
          <Button className='!bg-cream w-1/2 text-[#D7009A] font-semibold rounded-lg' disabled={amount <= 0 || allow >= amount} fullWidth onClick={() => handleApprove()} >
            {allow < amount && loading ? <CircularProgress  sx={{ color: '#D7009A', height: 2 }} /> : "Approve"}
          </Button>
  
          <Button className='!bg-cream w-1/2 text-[#D7009A] font-semibold rounded-lg'  disabled={amount <= 0 || allow < amount || amount > balance} fullWidth onClick={() => handleDeposit()}>
            {allow >= amount && loading ? <CircularProgress sx={{ color: '#D7009A', height: 2 }} /> : "Deposit"}
          </Button>
        </div>
        <Grid item xs={4}></Grid>
     
        </div>
    </Grid>
  </div>;
};

export default Deposit;