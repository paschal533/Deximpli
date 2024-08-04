"use client"
import { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from "@web3-react/core";
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import ManagerAddress from '@/contracts/StakingPoolManager-address.json';
import ManagerABI from '@/contracts/StakingPoolManager.json';
import { toString } from '@/utils/Helper';
import { StakingPoolABI } from '@/utils/StakingPoolABI';
import { getTokenInfo, getLiquidityPools } from '@/utils/Helper';
import { useEthersProvider, useEthersSigner } from '@/components/Wallet';
import { getBlockNumber } from '@wagmi/core'
import { useAccount } from 'wagmi'
import { getBalance } from '@wagmi/core'
import { configConnect } from '@/blockchain/config';

const useStake = () => {
    const { address, isConnecting, connector: activeConnector, } = useAccount()
    const provider = useEthersProvider()
    const signer = useEthersSigner()
  const [stakedToken, setStakedToken] = useState<any>({});
  const [rewardToken, setRewardToken] = useState<any>({});
  const [rewardPerBlock, setRewardPerBlock] = useState(100);
  const [startBlock, setStartBlock] = useState(0);
  const [endBlock, setEndBlock] = useState(0);
  const [tokenIndex, setTokenIndex] = useState(0); // 0 = stakedToken, 1 = rewardToken
  const [openModal, setOpenModal] = useState(false);
  const [tokensSelected, setTokensSelected] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<any>(0);
  const [loading, setLoading] = useState(false);
  const [indexStakedToken, indexRewardToken] = [0, 1];
  const [expanded, setExpanded] = useState(false);
  const [stakingPools, setStakingPools] = useState<any>([]);
  const [hideExpired, setHideExpired] = useState(false);

  const handleSelectToken = (token : any) => {
    if (tokenIndex === indexStakedToken) {
      setStakedToken(token);
      setTokensSelected(Object.keys(rewardToken).length > 0);
    } else if (tokenIndex === indexRewardToken) {
      setRewardToken(token);
      setTokensSelected(Object.keys(stakedToken).length > 0);
    } else {
      toast.error("Shouldn't reach here, unsupported token index!");
    }
  }

  const handleChange = (e : any) => {
    let tmpVal = e.target.value ? e.target.value : 0;
    let id = e.target.id;
    if (tmpVal < 0 || (isNaN(tmpVal) && id !== 'reward_per_block')) {
      tmpVal = e.target.value;
    } else if (!(typeof tmpVal === 'string' && (tmpVal.endsWith(".") || tmpVal.startsWith(".")))) {
      tmpVal = Number(e.target.value.toString());
    }
    if (id === 'reward_per_block') {
      setRewardPerBlock(tmpVal);
    } else if (id === 'start_block') {
      setStartBlock(tmpVal);
    } else if (id === 'end_block') {
      setEndBlock(tmpVal);
    }
  }

  const handleCreate = async () => {
    setLoading(true);
    try {
      const stakingPoolManager = new ethers.Contract(ManagerAddress.address, ManagerABI.abi, signer);
      const tx = await stakingPoolManager.createStakingPool(stakedToken.address, rewardToken.address,
        ethers.utils.parseUnits(toString(rewardPerBlock), rewardToken.decimals), startBlock, endBlock);
      await tx.wait();
      toast.info(`Staking pool is created successfully! Transaction Hash: ${tx.hash}`);
      setStakedToken({});
      setRewardToken({});
      setRewardPerBlock(100);
      setStartBlock(0);
      setEndBlock(0);
      await getBlockNumber(configConnect).then((number : any) => setCurrentBlock(number));
    } catch (error) {
      toast.error("Cannot create staking pool!");
      console.error(error);
    }
    setLoading(false);
  }

  const getStakingPools = useCallback(async () => {
    try {
      const stakingPoolManager = new ethers.Contract(ManagerAddress.address, ManagerABI.abi, signer);
      // Get all staking pool addresses from staking pool manager
      const stakingPools = await stakingPoolManager.getAllStakingPools();
      const pools = [];
      const liquidityPools = await getLiquidityPools();
      for (const address of stakingPools) {
        const stakingPool = new ethers.Contract(address, StakingPoolABI, signer);
        const stakedTokenAddress = await stakingPool.stakedToken();
        if (liquidityPools.has(stakedTokenAddress)) {
          // Skip farming pools
          continue;
        }
        const rewardStartBlock = await stakingPool.rewardStartBlock();
        const rewardEndBlock = await stakingPool.rewardEndBlock();
        const rewardPerBlock = await stakingPool.rewardPerBlock();
        const stakedToken = await getTokenInfo(stakedTokenAddress);
        const rewardToken = await getTokenInfo(await stakingPool.rewardToken());
        const stakedAmount = (await stakingPool.userInfo(address)).amount;
        const stakedTotal = await stakingPool.stakedTokenSupply();
        const pendingReward = await stakingPool.getPendingReward(address);

        pools.push({
          address, rewardStartBlock, rewardEndBlock, rewardPerBlock,
          stakedToken, rewardToken, stakedAmount, pendingReward, stakedTotal
        });
      }
      setStakingPools(pools);
    } catch (error) {
      toast.error("Cannot fetch staking pools!");
      console.error(error);
    }
  }, [signer]);

  const handleHarvest = async (address : any) => {
    setLoading(true);
    try {
      const stakingPool = new ethers.Contract(address, StakingPoolABI, signer);
      const tx = await stakingPool.deposit(0);
      await tx.wait();
      toast.info(`Successfully harvest reward token! Transaction hash: ${tx.hash}`);
      await getBlockNumber(configConnect).then((number : any) => setCurrentBlock(number));
      await getStakingPools();
    } catch (error) {
      toast.error("Cannot harvest token!");
      console.error(error);
    }
    setLoading(false);
  }


  const handleClick = (item : any) => async (event : any, isExpanded : any) => {
    setExpanded(isExpanded ? item.address : false);
  }

  const handleHideExpired = (event : any) => {
    setHideExpired(event.target.checked);
  }

  console.log(currentBlock);

  useEffect(() => {
    const init = async () => {
      if (address) {
        await getBlockNumber(configConnect).then((number : any) => setCurrentBlock(number));
        getStakingPools();
      }
    }
    init()
  }, [address, getStakingPools]);

    return {
        address,
        signer,
        provider,
        handleSelectToken,
        setTokenIndex,
        stakedToken,
        handleChange,
        rewardPerBlock,
        rewardToken,
        startBlock,
        endBlock,
        tokensSelected,
        loading,
        handleCreate,
        currentBlock,
        stakingPools,
        hideExpired,
        handleHideExpired,
        expanded,
        handleClick,
        handleHarvest,
    }
}

export default useStake;