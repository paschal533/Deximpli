import { useState, useEffect, useCallback,useContext } from 'react';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import AssetPoolAddress from '@/contracts/AssetPool-address.json';
import FooAddress from '@/contracts/FooToken-address.json';
import BarAddress from '@/contracts/BarToken-address.json';
import WETHAddress from '@/contracts/WETH-address.json';
import AssetPoolABI from '@/contracts/AssetPool.json';
import { getTokenInfo, formatInterest, formatEtherOrNA, boolOrNA } from '@/utils/Helper';
import { SwapContext } from '@/context/swap-provider';
import { useEthersSigner } from '@/components/Wallet';
import { useAccount } from 'wagmi'

const useLoan = () => {
    const { address, isConnecting, connector: activeConnector, } = useAccount()
    const { provider } = useContext(SwapContext)
    const signer = useEthersSigner()
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});
  const [pools, setPools] = useState<any>([]);
  const [INACTIVE, ACTIVE] = [0, 1]; // Pool status

  const getPools = useCallback(async (assetPool : any) => {
    try {
      const _pools = [];
      for (const tokenAddress of [WETHAddress.address, FooAddress.address, BarAddress.address]) {
        const poolInfo = await assetPool.getPool(tokenAddress);
        const userPoolData = await assetPool.getUserPoolData(address, tokenAddress);
        _pools.push({
          assetToken: WETHAddress.address === tokenAddress ? {
            address: tokenAddress, name: "Wrapped ETH", symbol: "WETH", decimals: 18
          } : await getTokenInfo(tokenAddress, provider),
          borrowInterest: poolInfo.borrowRate,
          lendingInterest: poolInfo.lendingRate,
          totalLiquidity: poolInfo.totalLiquidity,
          availableLiquidity: poolInfo.availableLiquidity,
          liquidityBalance: userPoolData.compoundedLiquidityBalance,
          BorrowBalance: userPoolData.compoundedBorrowBalance,
          status: poolInfo.status,
        })
      }
      setPools(_pools);
    } catch (error) {
      toast.error("Cannot fetch pool information!");
      console.error(error);
    }
  }, [address]);

  const getUserInfo = useCallback(async (assetPool : any) => {
    try {
      const userInfo = await assetPool.getUserInfo(address);
      const isAccountHealthy = await assetPool.isAccountHealthy(address);
      setUserInfo({
        totalDeposit: userInfo.totalLiquidityValue,
        totalBorrow: userInfo.totalBorrowedValue,
        maxBorrowable: userInfo.totalCollateralValue,
        isAccountHealthy,
      });
    } catch (error) {
      toast.error("Cannot fetch user information!");
      console.error(error);
    }
  }, [address]);

  const loadPoolsAndUserInfo = useCallback(async () => {
    setLoading(true);
    try {
      const assetPool = new ethers.Contract(AssetPoolAddress.address, AssetPoolABI.abi, signer);
      await getPools(assetPool);
      await getUserInfo(assetPool);
    } catch (error) {
      toast.error("Failed to load asset pool!");
      console.error(error);
    }
    setLoading(false);
  }, [getPools, getUserInfo, signer]);

  useEffect(() => {
    if (address) {
      loadPoolsAndUserInfo();
    }
  }, [address, loadPoolsAndUserInfo]);

  const handleChange = (address : any) => async (event : any, isExpanded : any) => {
    setExpanded(isExpanded ? address : false);
  };

    return {
        address,
        loading,
        userInfo,
        pools,
        handleChange,
        expanded,
        ACTIVE,
        INACTIVE,
        provider, 
        signer
    }
}

export default useLoan;