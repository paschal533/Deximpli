"use client"
import { useState, useEffect, useCallback, useContext } from 'react';
import { useWeb3React } from "@web3-react/core";
import { Button, Divider, Grid, Typography, useTheme, TextField, IconButton, CircularProgress } from '@mui/material';
import { ethers } from 'ethers';
import { StakingPoolABI } from '@/utils/StakingPoolABI';
import { toast } from 'react-toastify';
import { getTokenInfo, toString } from '@/utils/Helper';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { StakeContext } from '@/context/stake-provider';
import { SwapContext } from '@/context/swap-provider'

const Withdraw = ({ poolAddress } : { poolAddress : any}) => {
  const theme = useTheme();
  const { address, signer } = useContext(StakeContext)
  const { network } = useContext(SwapContext)
  const [stakingPoolAddress, setStakingPoolAddress] = useState('');
  const [stakedToken, setStakedToken] = useState<any>({});
  const [stakedAmount, setStakedAmount] = useState<any>(0);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getStakedToken = useCallback(async (poolAddress : any) => {
    if (Object.keys(stakedToken).length > 0) {
      return;
    }
    try {
      const stakingPool = new ethers.Contract(poolAddress, StakingPoolABI, signer);
      const _stakedToken = await getTokenInfo(await stakingPool.stakedToken());
      setStakedToken(_stakedToken);
      setStakingPoolAddress(poolAddress);
    } catch (error) {
      toast.error(`Cannot get the information of staked token with staking pool address ${poolAddress}!`);
      console.error(error);
    }
  }, [signer, stakedToken]);

  const getStakedAmount = useCallback(async () => {
    if (stakingPoolAddress === '') return;
    try {
      const stakingPool = new ethers.Contract(stakingPoolAddress, StakingPoolABI, signer);
      const userInfo = await stakingPool.userInfo(address);
      setStakedAmount(ethers.utils.formatUnits(userInfo.amount, stakedToken.decimals));
    } catch (error) {
      toast.error('Cannot get staked token amount!');
      console.error(error);
    }
  }, [address, signer, stakedToken, stakingPoolAddress])

  const handleChange = (e : any) => {
    let tmpVal = e.target.value ? e.target.value : 0;
    if (tmpVal < 0 || isNaN(tmpVal)) {
      return;
    } else if (!(typeof tmpVal === 'string' && (tmpVal.endsWith(".") || tmpVal.startsWith(".")))) {
      tmpVal = Number(e.target.value.toString());
    }
    setAmount(tmpVal);
  }

  const handleWithdraw = async () => {
    if (stakingPoolAddress === '') {
      toast.error("Staking pool not found!");
      return;
    }
    setLoading(true);
    try {
      const stakingPool = new ethers.Contract(stakingPoolAddress, StakingPoolABI, signer);
      const tx = await stakingPool.withdraw(ethers.utils.parseUnits(toString(amount), stakedToken.decimals));
      await tx.wait();
      toast.info(`Withdraw token successfully! Transaction hash: ${tx.hash}`);
      setAmount(0);
      await getStakedAmount();
    } catch (error) {
      toast.error("Cannot withdraw staked token!");
      console.error(error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (address && poolAddress) {
      getStakedToken(poolAddress);
      getStakedAmount();
    }
  }, [address, poolAddress, getStakedAmount, getStakedToken,]);

  if (!address) {
    return <Typography>Please connect to a wallet to stake</Typography>;
  } else if (Object.keys(stakedToken).length === 0) {
    return <Typography>Please provide valid "pool" search parameter in URL</Typography>
  }

  return <Grid container>
    <Grid item>
      <Grid container columnGap={12}>
        <Grid item>
          <Typography sx={{ mt: 1 }}>Withdraw Staked Token ({stakedToken.symbol})</Typography>
        </Grid>
      </Grid>
      <Divider  />
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography sx={{ mt: 2 }}>Amount to Withdraw</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField label={`Please enter the amount of ${stakedToken.symbol} to withdraw`} value={amount}
            onChange={handleChange} fullWidth />
          <Typography>Staked {stakedToken.symbol}: {stakedAmount}</Typography>
          <Button sx={{ fontSize: 12, padding: '0px' }} onClick={() => setAmount(stakedAmount)} >Max</Button>
        </Grid>
        <Grid item xs={4} />
        <Grid item xs={4}>
          <Button disabled={amount <= 0 || amount > stakedAmount} fullWidth onClick={() => handleWithdraw()}>
            {loading ? <CircularProgress sx={{ color: 'white' }} /> : (amount > stakedAmount ? "Withdraw too much!" : "Withdraw")}
          </Button>
        </Grid>
        <Grid item xs={4} />
      </Grid>
    </Grid>
  </Grid >;
}

export default Withdraw;