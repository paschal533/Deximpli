import { useState, useEffect, useCallback, useContext } from 'react';
import { Button, Divider, Grid, Typography, useTheme, TextField, IconButton, CircularProgress } from '@mui/material';
import { ethers } from 'ethers';
import { StakingPoolABI } from '@/utils/StakingPoolABI';
import { ERC20ABI } from '@/utils/ERC20ABI';
import { toast } from 'react-toastify';
import { getTokenInfo, toString } from '@/utils/Helper';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { StakeContext } from '@/context/stake-provider';
import { SwapContext } from '@/context/swap-provider'

const SupplyStakingReward = ({ poolAddress } : { poolAddress : any}) => {
  const { address, signer } = useContext(StakeContext)
  const { network } = useContext(SwapContext)
  const [rewardToken, setRewardToken] = useState<any>({});
  const [stakingPoolAddress, setStakingPoolAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getRewardToken = useCallback(async (poolAddress : any) => {
    if (stakingPoolAddress.length > 0 && Object.keys(rewardToken).length > 0) {
      return;
    }
    try {
      const stakingPool = new ethers.Contract(poolAddress, StakingPoolABI, signer);
      const _rewardToken = await getTokenInfo(await stakingPool.rewardToken());
      setRewardToken(_rewardToken);
      setStakingPoolAddress(poolAddress);
    } catch (error) {
      toast.error(`Cannot get the information of reward token with staking pool address ${poolAddress}!`);
      console.error(error);
    }
  }, [signer, stakingPoolAddress, rewardToken]);

  const getBalance = useCallback(async () => {
    if (stakingPoolAddress === '') return;
    try {
      const tokenContract = new ethers.Contract(rewardToken.address, ERC20ABI, signer);
      const _balance = await tokenContract.balanceOf(address);
      setBalance(Number(ethers.utils.formatUnits(_balance, rewardToken.decimals)));
    } catch (error) {
      toast.error('Cannot get balance for reward token!');
      console.error(error);
    }
  }, [address, signer, rewardToken, stakingPoolAddress]);

  const handleChange = (e : any) => {
    let tmpVal = e.target.value ? e.target.value : 0;
    if (tmpVal < 0 || isNaN(tmpVal)) {
      return;
    } else if (!(typeof tmpVal === 'string' && (tmpVal.endsWith(".") || tmpVal.startsWith(".")))) {
      tmpVal = Number(e.target.value.toString());
    }
    setAmount(tmpVal);
  }

  const handleSupply = async () => {
    setLoading(true);
    try {
      const tokenContract = new ethers.Contract(rewardToken.address, ERC20ABI, signer);
      const tx = await tokenContract.transfer(stakingPoolAddress, ethers.utils.parseUnits(toString(amount), rewardToken.decimals));
      await tx.wait();
      toast.info(`Successfully transferred reward token to staking pool! Transaction Hash: ${tx.hash}`);
      setAmount(0);
      await getBalance();
    } catch (error) {
      toast.error("Cannot supply token to staking pool");
      console.error(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (address && poolAddress) {
      getRewardToken(poolAddress);
      getBalance();
    }
  }, [address, poolAddress, getBalance, getRewardToken]);

  if (!address) {
    return <Typography>Please connect to a wallet to supply reward</Typography>;
  } else if (Object.keys(rewardToken).length === 0) {
    return <Typography>Please provide valid "pool" search parameter in URL</Typography>
  }

  return <div>
    <Grid item>
      <Grid container columnGap={12} className='mb-4'>
        <Grid item>
          <Typography sx={{ mt: 1 }}>Supply Reward Token ({rewardToken.symbol})</Typography>
        </Grid>
      </Grid>
      <Divider />
      <div>
         
          <div className='w-full p-2 mt-2 flex items-center justify-between'>
                 
                 <p className='font-semibold text-md'>Reward Per Block</p>
 
                 <input type='number' id="reward_per_block"  value={amount == 0 ? '' : amount} 
                 onChange={handleChange} placeholder={`0 (${rewardToken.symbol})`} 
                 className='bg-none w-1/2 text-xl font-bold placeholder:text-slate-500 placeholder:font-bold placeholder:text-xl  bg-cream shadow-sm p-2 rounded-lg outline-none border-none' />
             </div>
        <div className='w-full flex justify-between pr-2 items-center'>
        <p className='p-2 font-semibold'>Balance of {rewardToken.symbol}:</p>
        <span className='font-medium'> {balance}</span>
        </div>
        <Grid item xs={4}></Grid>
        <div className='w-full p-2'>
          <Button className='bg-cream text-[#D7009A] rounded-lg' disabled={amount <= 0} fullWidth onClick={() => handleSupply()}>
            {loading ? <CircularProgress sx={{ color: 'white' }} /> : "Supply"}
          </Button>
        </div>
        <Grid item xs={4}></Grid>
      </div>
    </Grid>
  </div>
}
export default SupplyStakingReward;