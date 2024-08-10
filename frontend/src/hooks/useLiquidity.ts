import { useState, useEffect, useCallback, useContext } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import FactoryABI from '@/contracts/PairFactory.json';
import { TokenPairABI } from '@/utils/TokenPairABI';
import { useEthersSigner } from '@/components/Wallet';
import { getTokenInfo, getErrorMessage, toString, isETH } from '@/utils/Helper';
import { ERC20ABI } from '@/utils/ERC20ABI';
import AMMRouterABI from '@/contracts/AMMRouter.json';
import { useAccount } from 'wagmi'
import { getBalance } from '@wagmi/core'
import { configConnect } from '@/blockchain/config';
import { SwapContext } from '@/context/swap-provider';
import { SuppotedPairFactoryContractAddress, SuppotedAMMRouterContractAddress } from '@/utils/Tokens';

const useLiquidity = () => {
  const { address, isConnecting, connector: activeConnector, } = useAccount()
  const { provider } = useContext(SwapContext)
  const signer = useEthersSigner()
  const [loading, setLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [liquidity, setLiquidity] = useState<any>([]);
  const [sharePercent, setSharePercent] = useState<number>(0);
  const [pooledTokenA, setPooledTokenA] = useState<number>(0);
  const [pooledTokenB, setPooledTokenB] = useState<number>(0);
  const [amountA, setAmountA] = useState<number>(0);
  const [amountB, setAmountB] = useState<number>(0);
  const [allowA, setAllowA] = useState<boolean>(false);
  const [allowB, setAllowB] = useState<boolean>(false);
  const [allowAmountA, setAllowAmountA] = useState<number>(0);
  const [allowAmountB, setAllowAmountB] = useState<number>(0);
  const [balanceA, setBalanceA] = useState<any>(0);
  const [balanceB, setBalanceB] = useState<any>(0);
  const [reserveA, setReserveA] = useState<any>(0);
  const [reserveB, setReserveB] = useState<any>(0);
  const [tokenA, setTokenA] = useState<any>({});
  const [tokenB, setTokenB] = useState<any>({});
  const [pair, setPair] = useState<any>('');
  const [availableBalance, setAvailableBalance] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [tokenIndex, setTokenIndex] = useState<number>(0); // 0 = tokenA, 1 = tokenB
  const [tokensSelected, setTokenSelected] = useState<boolean>(false);
  const [indexTokenA, indexTokenB] = [0, 1];

  const getLiquidity = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    let tmpLiq = [];
    try {
      let factory = new ethers.Contract(SuppotedPairFactoryContractAddress(provider?._network.chainId), FactoryABI.abi, signer);
      // Fetch how many pairs are there in the DEX
      const nPairs = await factory.allPairsLength();

      // Iterate through all pairs to get the pair addresses and the pooled tokens
      for (let i = 0; i < nPairs; i++) {
        let pairAddress = await factory.allPairs(i);
        let tokenPair = new ethers.Contract(pairAddress, TokenPairABI, signer);
        let tmpBalance = await tokenPair.balanceOf(address);
        let balance = tmpBalance / 10 ** 18; // We know the decimals of LP Tokens are all 18 for the DEX
        if (balance > 0) {
          let tokenA = await getTokenInfo(await tokenPair.tokenA(), provider);
          let tokenB = await getTokenInfo(await tokenPair.tokenB(), provider);
          tmpLiq.push({ pairAddress, balance, tokenA, tokenB });
        }
      }
      setLiquidity(tmpLiq);
    } catch (error) {
      toast.error("Cannot get liquidity for current user!");
      console.error(error);
    }
    setLoading(false);
  }, [address, signer, provider ]);

  const handleClick = (pair: any) => async (event :any, isExpanded : any) => {
    setExpanded(isExpanded ? pair.pairAddress : false);
    let lpToken = new ethers.Contract(pair.pairAddress, TokenPairABI, provider);
    let totalSupply = await lpToken.totalSupply();
    let shareRatio = pair.balance / Number(ethers.utils.formatUnits(totalSupply, 18));
    setSharePercent(100 * shareRatio);

    let [_reserveA, _reserveB,] = await lpToken.getReserves();
    setPooledTokenA(Number(ethers.utils.formatUnits(_reserveA, pair.tokenA.decimals)) * shareRatio);
    setPooledTokenB(Number(ethers.utils.formatUnits(_reserveB, pair.tokenB.decimals)) * shareRatio);
  };

  const setTokenInfo = useCallback(async (pairAddress : any) => {
    if (tokensSelected) {
      return;
    }
    try {
      const tokenPair = new ethers.Contract(pairAddress, TokenPairABI, signer);
      const _tokenA = await getTokenInfo(await tokenPair.tokenA(), provider);
      const _tokenB = await getTokenInfo(await tokenPair.tokenB(), provider);
      setTokenA(_tokenA);
      setTokenB(_tokenB);
      setTokenSelected(true);
    } catch (error) {
      toast.error(getErrorMessage(error, "Cannot fetch token information for the pair!"), { toastId: 'PAIR_0' })
      console.error(error);
    }
  }, [signer, tokensSelected, provider]);

  // Set reserves using token addresses(tokens information are known)
  const getReserves = useCallback(async () => {
    if (!tokensSelected) {
      return;
    }
    try {
      const ammRouter = new ethers.Contract(SuppotedAMMRouterContractAddress(provider?._network.chainId), AMMRouterABI.abi, signer);
      const [_reserveA, _reserveB, _pairAddress] = await ammRouter.getReserves(tokenA.address, tokenB.address);
      setPair(_pairAddress);
      setReserveA(ethers.utils.formatUnits(_reserveA, tokenA.decimals));
      setReserveB(ethers.utils.formatUnits(_reserveB, tokenB.decimals));
    } catch (error) {
      toast.info("Looks you are the first one to provide liquidity for the pair.", { toastId: 'RESERVE_0' })
      setPair('');
      console.log(error);
    }
  }, [signer, tokenA, tokenB, tokensSelected, provider?._network.chainId]);

  const getBalances = useCallback(async () => {
    if (!tokensSelected) {
      return;
    }
    try {
      if (isETH(tokenA, provider)) {
        const balance = await getBalance(configConnect, {
            //@ts-ignore
            address: address,
            //@ts-ignore
            chainId: provider?._network.chainId
        })
        const _balanceA = balance.value
        setBalanceA(Number(ethers.utils.formatUnits(_balanceA)));
      } else {
        const _tokenA = new ethers.Contract(tokenA.address, ERC20ABI, provider);
        const _balanceA = await _tokenA.balanceOf(address);
        setBalanceA(Number(ethers.utils.formatUnits(_balanceA, tokenA.decimals)));
      }
      if (isETH(tokenB, provider)) {
        const balance = await getBalance(configConnect, {
            //@ts-ignore
            address: address,
            //@ts-ignore
            chainId: provider?._network.chainId
        })
        const _balanceB = balance.value
        setBalanceB(Number(ethers.utils.formatUnits(_balanceB)));
      } else {
        const _tokenB = new ethers.Contract(tokenB.address, ERC20ABI, provider);
        const _balanceB = await _tokenB.balanceOf(address);
        setBalanceB(Number(ethers.utils.formatUnits(_balanceB, tokenB.decimals)));
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Cannot get token balances!"), { toastId: 'BALANCE_0' });
      console.log(error);
    }
  }, [address, signer, tokenA, tokenB, provider, tokensSelected, provider?._network.chainId]);

  const checkAllowances = useCallback(async () => {
    if (!tokensSelected) {
      return;
    }
    try {
      if (isETH(tokenA, provider)) {
        setAllowA(true);
      } else {
        const _tokenA = new ethers.Contract(tokenA.address, ERC20ABI, signer);
        let _allowA = await _tokenA.allowance(address, SuppotedAMMRouterContractAddress(provider?._network.chainId));
        _allowA = Number(ethers.utils.formatUnits(_allowA, tokenA.decimals));
        setAllowAmountA(_allowA);
        setAllowA(_allowA >= amountA);
      }
      if (isETH(tokenB, provider)) {
        setAllowB(true);
      } else {
        const _tokenB = new ethers.Contract(tokenB.address, ERC20ABI, signer);
        let _allowB = await _tokenB.allowance(address, SuppotedAMMRouterContractAddress(provider?._network.chainId));
        _allowB = Number(ethers.utils.formatUnits(_allowB, tokenB.decimals));
        setAllowAmountB(_allowB);
        setAllowB(_allowB >= amountB);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Cannot check allowances!"));
      console.error(error);
    }
  }, [address, signer, tokenA, tokenB, amountA, amountB, tokensSelected, provider?._network.chainId]);

  useEffect(() => {
    const pairAddress = ''; //searchParam.get('pair');
    if (address && pairAddress) {
      setTokenInfo(pairAddress);
      getReserves();
      getBalances();
      checkAllowances();
    } else if (tokensSelected) {
      getReserves();
      getBalances();
      checkAllowances();
    }
  }, [address, tokensSelected, provider?._network.chainId, checkAllowances, getBalances, getReserves, setTokenInfo]);

  const handleChange = (e : any) => {
    let tmpVal = e.target.value ? e.target.value : 0;
    let id = e.target.id;
    if (tmpVal < 0 || isNaN(tmpVal)) {
      tmpVal = id === 'tokenA' ? amountA : amountB;
    } else if (!(typeof tmpVal === 'string' && (tmpVal.endsWith(".") || tmpVal.startsWith(".")))) {
      tmpVal = Number(e.target.value.toString());
    }
    if (id === 'tokenA') {
      setAmountA(toString(tmpVal));
      let _amountB = amountB;
      if (pair) {
        //@ts-ignore
        _amountB = (tmpVal * reserveB / reserveA).toFixed(2);
        setAmountB(toString(_amountB));
      }
      setAvailableBalance(tmpVal <= balanceA && _amountB <= balanceB);
      setAllowA(isETH(tokenA, provider) || allowAmountA >= tmpVal);
      setAllowB(isETH(tokenB, provider) || allowAmountB >= _amountB);
    } else {
      setAmountB(toString(tmpVal));
      let _amountA = amountA;
      if (pair) {
        //@ts-ignore
        _amountA = (tmpVal * reserveA / reserveB).toFixed(2);
        setAmountA(toString(_amountA));
      }
      setAvailableBalance(_amountA <= balanceA && tmpVal <= balanceB);
      setAllowA(isETH(tokenA, provider) || allowAmountA >= _amountA);
      setAllowB(isETH(tokenB, provider) || allowAmountB >= tmpVal);
    }
  }

  const handleApprove = async (index : any) => {
    setLoading(true);
    const [token, amount] = index === indexTokenA ? [tokenA, amountA] : [tokenB, amountB];
    try {
      const tokenContract = new ethers.Contract(token.address, ERC20ABI, signer);
      const allowAmount = ethers.utils.parseUnits(toString(amount), token.decimals);
      const tx = await tokenContract.approve(SuppotedAMMRouterContractAddress(provider?._network.chainId), allowAmount);
      await tx.wait();
      toast.info(`${token.symbol} is enabled!`);
      if (index === indexTokenA) {
        setAllowA(true);
      } else {
        setAllowB(true);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, `Cannot enable ${token.symbol} !`));
      console.error(error);
    }
    setLoading(false);
  }

  const handleAddLiquidity = async () => {
    setLoading(true);
    try {
      const ammRouter = new ethers.Contract(SuppotedAMMRouterContractAddress(provider?._network.chainId), AMMRouterABI.abi, signer);
      //@ts-ignore
      const deadline = parseInt(new Date().getTime() / 1000) + 30
      let tx;
      if (isETH(tokenA, provider)) {
        tx = await ammRouter.addLiquidityETH(tokenB.address,
          ethers.utils.parseUnits(toString(amountB), tokenB.decimals), 0, 0, address, deadline,
          { value: ethers.utils.parseUnits(toString(amountA)) });
      } else if (isETH(tokenB, provider)) {
        tx = await ammRouter.addLiquidityETH(tokenA.address,
          ethers.utils.parseUnits(toString(amountA), tokenA.decimals), 0, 0, address, deadline,
          { value: ethers.utils.parseUnits(toString(amountB)) });
      } else {
        tx = await ammRouter.addLiquidity(tokenA.address, tokenB.address,
          ethers.utils.parseUnits(toString(amountA), tokenA.decimals),
          ethers.utils.parseUnits(toString(amountB), tokenB.decimals),
          0, 0, address, deadline);
      }
      await tx.wait();
      toast.info(`Liquidity provisioning succeeded! Transaction Hash: ${tx.hash}`);
      setAmountA(0);
      setAmountB(0);
      await getBalances();
      await getReserves();
    } catch (error) {
      toast.error(getErrorMessage(error, "Cannot add liquidity!"));
      console.error(error);
    }
    setLoading(false);
  }

  const handleSelectToken = (token : any) => {
    if (tokenIndex === indexTokenA && token.address !== tokenB.address) {
      setTokenA(token);
      setAmountA(0);
      setTokenSelected(Object.keys(tokenB).length > 0);
    } else if (tokenIndex === indexTokenB && token.address !== tokenA.address) {
      setTokenB(token);
      setAmountB(0);
      setTokenSelected(Object.keys(tokenA).length > 0);
    } else {
      toast.error("Please select a different token!");
    }
  }

  const getPrice = (index : any) => {
    const [reserve0, reserve1] = index === 0 ? [reserveA, reserveB] : [reserveB, reserveA];
    const [amount0, amount1] = index === 0 ? [amountA, amountB] : [amountB, amountA];
    const ret = pair ? reserve1 / reserve0 : amount1 / amount0;
    return isNaN(ret) ? "N/A" : ret.toFixed(4);
  }

  const getSharePercent = () => {
    let sharePercent = 100 * Number(amountA) / (Number(amountA) + Number(reserveA));
    return isNaN(sharePercent) || sharePercent < 0.01 ? "< 0.01" : sharePercent.toFixed(2)
  }

  useEffect(() => {
    getLiquidity();
  }, [getLiquidity]);


    return {
     loading, 
     expanded,  
     liquidity,
     sharePercent,
     pooledTokenA,  
     pooledTokenB,
     handleClick,
     address,
     tokenA, 
    handleChange, 
    tokenB, 
    amountA, 
    amountB, 
    balanceA, 
    balanceB,
    tokensSelected,
    getPrice,
    indexTokenA,
    indexTokenB,
    getSharePercent,
    handleApprove,
    allowA,
    allowB,
    handleAddLiquidity,
    availableBalance,
    setTokenIndex,
    handleSelectToken,
    setTokenInfo,
    getReserves,
    getBalances,
    checkAllowances,
    };
}

export default useLiquidity;