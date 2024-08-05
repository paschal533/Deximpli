import { useState, useEffect, useCallback, useContext } from 'react';
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
import { SuppotedTokens } from "@/utils/Tokens";
import WETH from '@/contracts/WETH-address.json';
import WETHABI from '@/contracts/WETH.json';
import { SwapContext } from '@/context/swap-provider';
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    goerli,
    sepolia,
    localhost
  } from 'wagmi/chains';

const useFarm = () => {
    const { address, isConnecting, connector: activeConnector, } = useAccount()
    const { provider } = useContext(SwapContext)
    const chainId = localhost.id
    const signer = useEthersSigner()
    const [liquidityPools, setLiquidityPools] = useState(new Map());
  const [stakedToken, setStakedToken] = useState<any>({});
  const [rewardToken, setRewardToken] = useState<any>({});
  const [rewardPerBlock, setRewardPerBlock] = useState(100);
  const [startBlock, setStartBlock] = useState(0);
  const [endBlock, setEndBlock] = useState(0);
  const [tokenIndex, setTokenIndex] = useState(0); // 0 = stakedToken, 1 = rewardToken
  const [openModalStaked, setOpenModalStaked] = useState(false);
  const [openModalReward, setOpenModalReward] = useState(false);
  const [tokensSelected, setTokensSelected] = useState(false);
  const [indexStakedToken, indexRewardToken] = [0, 1];
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [farmingPools, setFarmingPools] = useState<any>([]);
  const [currentBlock, setCurrentBlock] = useState(0);
  const [hideExpired, setHideExpired] = useState(false);
  const [LoadingPoolTokens, setLoadingPoolTokens] = useState<boolean>(false)
  const [tokens, setTokens] = useState<any>([])

  const getFarmingPools = useCallback(async () => {
    try {
      const stakingPoolManager = new ethers.Contract(ManagerAddress.address, ManagerABI.abi, signer);
      // Get all staking pool addresses from staking pool manager
      const stakingPools = await stakingPoolManager.getAllStakingPools();
      const liquidityPools = await getLiquidityPools(provider);
      const pools = [];
      for (const address of stakingPools) {
        const stakingPool = new ethers.Contract(address, StakingPoolABI, signer);
        const stakedTokenAddress = await stakingPool.stakedToken();
        if (!liquidityPools.has(stakedTokenAddress)) {
          // Skip non-farming pools.
          continue;
        }
        const rewardStartBlock = await stakingPool.rewardStartBlock();
        const rewardEndBlock = await stakingPool.rewardEndBlock();
        const rewardPerBlock = await stakingPool.rewardPerBlock();
        const stakedToken = await getTokenInfo(stakedTokenAddress, provider);
        const rewardToken = await getTokenInfo(await stakingPool.rewardToken(), provider);
        const stakedAmount = (await stakingPool.userInfo(address)).amount;
        const stakedTotal = await stakingPool.stakedTokenSupply();
        const pendingReward = await stakingPool.getPendingReward(address);
        const tokenA = liquidityPools.get(stakedTokenAddress).tokenA;
        const tokenB = liquidityPools.get(stakedTokenAddress).tokenB;

        pools.push({
          address, rewardStartBlock, rewardEndBlock, rewardPerBlock,
          stakedToken, rewardToken, stakedAmount, pendingReward, stakedTotal, tokenA, tokenB
        });
      }
      setFarmingPools(pools);
    } catch (error) {
      toast.error("Cannot fetch staking pools!");
      console.log(error);
    }
  }, [address, signer]);

  const handleHarvest = async (address : any) => {
    setLoading(true);
    try {
      const farmingPool = new ethers.Contract(address, StakingPoolABI, signer);
      const tx = await farmingPool.deposit(0);
      await tx.wait();
      toast.info(`Successfully harvest reward token! Transaction hash: ${tx.hash}`);
      await getBlockNumber(configConnect).then((number : any) => setCurrentBlock(number));
      await getFarmingPools();
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
        ethers.utils.parseUnits(toString(rewardPerBlock), rewardToken.decimals), startBlock, endBlock, {
            maxFeePerGas: ethers.utils.parseUnits('60', 'gwei'), // Set this to a higher value
            maxPriorityFeePerGas: ethers.utils.parseUnits('2', 'gwei') 
        });
      await tx.wait();
      toast.info(`Staking pool is created successfully! Transaction Hash: ${tx.hash}`);
      setStakedToken({});
      setRewardToken({});
      setRewardPerBlock(100);
      setStartBlock(0);
      setEndBlock(0);
      await getBlockNumber(configConnect).then((number : any) => setCurrentBlock(number));
      getFarmingPools()
    } catch (error) {
      toast.error("Cannot create farming pool!");
      console.log(error);
    }
    setLoading(false);
  }

  useEffect(() => {
     const init = async () => {
        if (address && signer) {
            await getBlockNumber(configConnect).then((number : any) => setCurrentBlock(number));
            getFarmingPools();
          }
        getLiquidityPools(provider).then(pools => {
            const _liquidityTokens = Array.from(pools.entries()).map((value : any, i : any) => {
                return {
                  "address": value[0],
                  "name": `LP Token for ${value[1].tokenA.symbol} and ${value[1].tokenB.symbol}`,
                  "symbol": `${value[1].tokenA.symbol}-${value[1].tokenB.symbol}`,
                  "decimals": 18
                };
              })
            setTokens(_liquidityTokens); 
            setLoadingPoolTokens(false) 
            setLiquidityPools(pools)
        });
     }

     init();
  }, [address, signer]);

   

    return {
        address,
        signer,
        provider,
        handleSelectToken,
        setTokenIndex,
        stakedToken,
        rewardToken,
        handleChange,
        rewardPerBlock,
        startBlock,
        endBlock,
        tokensSelected,
        loading,
        handleCreate,
        currentBlock,
        liquidityPools,
        tokens,
        LoadingPoolTokens,
        hideExpired,
        handleHideExpired,
        expanded,
        handleClick,
        handleHarvest,
        farmingPools,
    }
}

export default useFarm;