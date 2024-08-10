import { useState, useEffect, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import ManagerABI from "@/contracts/StakingPoolManager.json";
import { toString } from "@/utils/Helper";
import { StakingPoolABI } from "@/utils/StakingPoolABI";
import { getTokenInfo, getLiquidityPools } from "@/utils/Helper";
import { useEthersSigner } from "@/components/Wallet";
import { getBlockNumber } from "@wagmi/core";
import { useAccount } from "wagmi";
import { getBalance } from "@wagmi/core";
import { configConnect } from "@/blockchain/config";
import { SuppotedWrappedETHContractAddress } from "@/utils/Tokens";
import {
  SuppotedTokens,
  SuppotedStakingPoolManagerContractAddress,
} from "@/utils/Tokens";
import { SwapContext } from "@/context/swap-provider";

const useStake = () => {
  const { address, isConnecting, connector: activeConnector } = useAccount();
  const { provider } = useContext(SwapContext);
  const signer = useEthersSigner();
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
  const [loadingTokens, setLoadingTokens] = useState<boolean>(false);
  const [tokens, setTokens] = useState<any>([]);
  const [loadingStake, setLoadingStake] = useState(true);

  const handleSelectToken = (token: any) => {
    if (tokenIndex === indexStakedToken) {
      setStakedToken(token);
      setTokensSelected(Object.keys(rewardToken).length > 0);
    } else if (tokenIndex === indexRewardToken) {
      setRewardToken(token);
      setTokensSelected(Object.keys(stakedToken).length > 0);
    } else {
      toast.error("Shouldn't reach here, unsupported token index!");
    }
  };

  const handleChange = (e: any) => {
    let tmpVal = e.target.value ? e.target.value : 0;
    let id = e.target.id;
    if (tmpVal < 0 || (isNaN(tmpVal) && id !== "reward_per_block")) {
      tmpVal = e.target.value;
    } else if (
      !(
        typeof tmpVal === "string" &&
        (tmpVal.endsWith(".") || tmpVal.startsWith("."))
      )
    ) {
      tmpVal = Number(e.target.value.toString());
    }
    if (id === "reward_per_block") {
      setRewardPerBlock(tmpVal);
    } else if (id === "start_block") {
      setStartBlock(tmpVal);
    } else if (id === "end_block") {
      setEndBlock(tmpVal);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const stakingPoolManager = new ethers.Contract(
        SuppotedStakingPoolManagerContractAddress(provider?._network.chainId),
        ManagerABI.abi,
        signer,
      );
      const tx = await stakingPoolManager.createStakingPool(
        stakedToken.address,
        rewardToken.address,
        ethers.utils.parseUnits(toString(rewardPerBlock), rewardToken.decimals),
        startBlock,
        endBlock,
        {
          maxFeePerGas: ethers.utils.parseUnits("60", "gwei"), // Set this to a higher value
          maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei"),
        },
      );
      await tx.wait();
      toast.info(
        `Staking pool is created successfully! Transaction Hash: ${tx.hash}`,
      );
      setStakedToken({});
      setRewardToken({});
      setRewardPerBlock(100);
      setStartBlock(0);
      setEndBlock(0);
      getStakingPools();
      //@ts-ignore
      await getBlockNumber(configConnect, {
        chainId: provider?._network.chainId,
      }).then((number: any) => setCurrentBlock(number));
    } catch (error) {
      toast.error("Cannot create staking pool!");
      console.error(error);
    }
    setLoading(false);
  };

  const getStakingPools = useCallback(async () => {
    setLoadingStake(true);
    try {
      const stakingPoolManager = new ethers.Contract(
        SuppotedStakingPoolManagerContractAddress(provider?._network.chainId),
        ManagerABI.abi,
        signer,
      );
      // Get all staking pool addresses from staking pool manager
      const stakingPools = await stakingPoolManager.getAllStakingPools();
      const pools = [];
      const liquidityPools = await getLiquidityPools(provider);
      for (const address of stakingPools) {
        const stakingPool = new ethers.Contract(
          address,
          StakingPoolABI,
          signer,
        );
        const stakedTokenAddress = await stakingPool.stakedToken();
        if (liquidityPools.has(stakedTokenAddress)) {
          // Skip farming pools
          continue;
        }
        const rewardStartBlock = await stakingPool.rewardStartBlock();
        const rewardEndBlock = await stakingPool.rewardEndBlock();
        const rewardPerBlock = await stakingPool.rewardPerBlock();
        const stakedToken = await getTokenInfo(stakedTokenAddress, provider);
        const rewardToken = await getTokenInfo(
          await stakingPool.rewardToken(),
          provider,
        );
        const stakedAmount = (await stakingPool.userInfo(address)).amount;
        const stakedTotal = await stakingPool.stakedTokenSupply();
        const pendingReward = await stakingPool.getPendingReward(address);

        pools.push({
          address,
          rewardStartBlock,
          rewardEndBlock,
          rewardPerBlock,
          stakedToken,
          rewardToken,
          stakedAmount,
          pendingReward,
          stakedTotal,
        });
      }
      setStakingPools(pools);
      setLoadingStake(false);
    } catch (error) {
      setLoadingStake(false);
      toast.error("Cannot fetch staking pools!");
      console.error(error);
    }
  }, [signer, provider]);

  const handleHarvest = async (address: any) => {
    setLoading(true);
    try {
      const stakingPool = new ethers.Contract(address, StakingPoolABI, signer);
      const tx = await stakingPool.deposit(0);
      await tx.wait();
      toast.info(
        `Successfully harvest reward token! Transaction hash: ${tx.hash}`,
      );
      //@ts-ignore
      await getBlockNumber(configConnect, {
        chainId: provider?._network.chainId,
      }).then((number: any) => setCurrentBlock(number));
      await getStakingPools();
    } catch (error) {
      toast.error("Cannot harvest token!");
      console.error(error);
    }
    setLoading(false);
  };

  const handleClick = (item: any) => async (event: any, isExpanded: any) => {
    setExpanded(isExpanded ? item.address : false);
  };

  const handleHideExpired = (event: any) => {
    setHideExpired(event.target.checked);
  };

  const getSupportedTokens = useCallback(
    async (erc20Only?: boolean) => {
      setLoadingTokens(true);
      // The native coin of EVM and its wrapped form
      const _tokens = [
        {
          address: SuppotedWrappedETHContractAddress(
            provider?._network.chainId,
          ),
          name: "Ether",
          symbol: "ETH",
          logo: "/images/eth.png",
          decimals: 18,
        },
        {
          address: SuppotedWrappedETHContractAddress(
            provider?._network.chainId,
          ),
          name: "Wrapped ETH",
          symbol: "WETH",
          logo: "/images/eth.png",
          decimals: 18,
        },
      ];
      if (erc20Only) {
        // Remove the first element since ETH is not an ERC20 token
        _tokens.shift();
      }
      if (provider?._network.chainId) {
        //@ts-ignore
        for (let TokenAddress of SuppotedTokens(provider?._network.chainId)) {
          //@ts-ignore
          _tokens.push(await getTokenInfo(TokenAddress, provider));
        }
        setTokens(_tokens);
        setLoadingTokens(false);
      }
      //@ts-ignore
    },
    [provider],
  );

  useEffect(() => {
    const init = async () => {
      if (address && signer) {
        //@ts-ignore
        await getBlockNumber(configConnect, {
          chainId: provider?._network.chainId,
        }).then((number: any) => setCurrentBlock(Number(number)));
        getStakingPools();
      }
      getSupportedTokens(true);
    };
    init();
  }, [address, getStakingPools, signer, provider]);

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
    tokens,
    loadingTokens,
    loadingStake,
  };
};

export default useStake;
