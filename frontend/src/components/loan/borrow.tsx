import { useState, useEffect, useCallback, useContext} from 'react';
import { Button, Divider, Grid, Typography, useTheme, TextField, IconButton, CircularProgress } from '@mui/material';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getTokenInfo, toString } from '@/utils/Helper';
import AssetPoolABI from '@/contracts/AssetPool.json';
import AssetPoolAddress from '@/contracts/AssetPool-address.json';
import { LoanContext } from '@/context/loan-provider';

const Borrow = ({ tokenAddress } : { tokenAddress : any}) => {
const { address, provider, signer } = useContext(LoanContext)
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<any>({});
  const [borrowableQuota, setBorrowableQuota] = useState(0);
  const [amount, setAmount] = useState(0);

  const getBorrowableQuota = useCallback(async (tokenObject : any) => {
    try {
      const assetPool = new ethers.Contract(AssetPoolAddress.address, AssetPoolABI.abi, signer);
      const userInfo = await assetPool.getUserInfo(address);
      const tokenPrice = await assetPool.getPriceInWETH(tokenObject.address);
      const poolInfo = await assetPool.getPool(tokenObject.address);
      let _quota = Number(userInfo.totalCollateralValue.sub(userInfo.totalBorrowedValue).div(tokenPrice));
      let _available = Number(ethers.utils.formatUnits(poolInfo.availableLiquidity, tokenObject.decimals));
      setBorrowableQuota(Math.min(_available, _quota));
    } catch (error) {
      toast.error("Cannot get quota for current user!");
      console.log(error);
    }
  }, [address, signer]);

  const loadBorrowInfo = useCallback(async (tokenAddress : any) => {
    setLoading(true);
    try {
      const tokenObject = await getTokenInfo(tokenAddress, provider);
      setToken(tokenObject);
      await getBorrowableQuota(tokenObject);
    } catch (error) {
      toast.error("Failed to load information for borrowing!");
      console.log(error);
    }
    setLoading(false);
  }, [getBorrowableQuota]);

  useEffect(() => {
    if (address && tokenAddress) {
      loadBorrowInfo(tokenAddress);
    }
  }, [address, loadBorrowInfo, tokenAddress]);

  const handleChange = (e : any) => {
    let tmpVal = e.target.value ? e.target.value : 0;
    if (tmpVal < 0 || isNaN(tmpVal)) {
      return;
    } else if (!(typeof tmpVal === 'string' && (tmpVal.endsWith(".") || tmpVal.startsWith(".")))) {
      tmpVal = Number(e.target.value.toString());
    }
    setAmount(tmpVal);
  }

  const handleBorrow = async () => {
    setLoading(true);
    try {
      const assetPool = new ethers.Contract(AssetPoolAddress.address, AssetPoolABI.abi, signer);
      const tx = await assetPool.borrow(token.address, ethers.utils.parseUnits(toString(amount), token.decimals));
      await tx.wait();
      toast.info(`Token borrowed successfully! Transaction hash: ${tx.hash}`);
      setAmount(0);
      await getBorrowableQuota(token);
    } catch (error) {
      toast.error("Cannot borrow token!");
      console.error(error);
    }
    setLoading(false);
  }

  return <div>
    <Grid item>
      <Grid container columnGap={12}>
        <Grid item>
          <Typography sx={{ mt: 1 }}>Borrow Assets</Typography>
        </Grid>
      </Grid>
      <Divider />
      <div>
         
          <div className='w-full p-2 mt-2 flex-col items-center'>
                 
                 <p className='font-semibold text-md'>Amount to Borrow</p>
 
                 <input type='number' id="reward_per_block"  value={amount == 0 ? '' : amount} 
                 onChange={handleChange} placeholder={`enter borrowed token (${token.symbol}) amount`} 
                 className='bg-none w-full mt-2 text-lg font-normal placeholder:text-slate-500 placeholder:font-normal placeholder:text-lg  bg-cream shadow-sm p-2 rounded-lg outline-none border-none' />
             </div>
             <div className='w-full flex justify-between pr-2 items-center'>
        <p className='p-2 font-semibold'>Borrowable Quota of {token.symbol}:</p>
        <div className='space-x-1 justify-center items-center'>
        <span className='font-medium'>{borrowableQuota}</span>
        <div className="text-xs cursor-pointer float-end font-semibold text-[#D7009A]" onClick={() => setAmount(borrowableQuota)} >Max</div>
        </div>
        </div>
        <Grid item xs={4}></Grid>
        <div className='w-full flex space-x-2 p-2'>
          <Button className='!bg-cream w-1/2 text-[#D7009A] font-semibold rounded-lg' disabled={amount <= 0 || amount > borrowableQuota} fullWidth onClick={() => handleBorrow()} >
          {loading ? <CircularProgress sx={{ color: '#D7009A' }} /> : "Borrow"}
          </Button>
        </div>
        <Grid item xs={4}></Grid>
     
        </div>
    </Grid>
  </div>
};

export default Borrow;