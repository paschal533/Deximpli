import { useEffect, useRef, useState, useCallback } from "react";
import { buildGraphFromEdges, findAllPaths } from '@/utils/Graph';
import { ERC20ABI } from '@/utils/ERC20ABI';
import WETHABI from '@/contracts/WETH.json';
import { toast } from 'react-toastify';
import { TokenPairABI } from '@/utils/TokenPairABI';
import { getErrorMessage, getTokenInfo, toString, isETH } from '@/utils/Helper';
import { ethers } from 'ethers';
import FactoryABI from '@/contracts/PairFactory.json';
import AMMRouterABI from '@/contracts/AMMRouter.json';
import { SuppotedTokens, 
  SuppotedWrappedETHContractAddress,
  SuppotedPairFactoryContractAddress,
  SuppotedAMMRouterContractAddress
} from "@/utils/Tokens";
import { useEthersProvider, useEthersSigner } from '@/components/Wallet';
import { useAccount } from 'wagmi'
import { getBalance } from '@wagmi/core'
import { configConnect } from '@/blockchain/config';
import { isAddress } from "viem";

const useSwap = () => {
    const MODE_SWAP = 0;
    const MODE_WRAP = 1;
    const MODE_UNWRAP = 2;
    const { address, isConnecting, connector: activeConnector, } = useAccount()
    const signer = useEthersSigner()
    const provider = useEthersProvider({chainId: signer?.provider._network.chainId})
    const [tokenIndex, setTokenIndex] = useState(0); // 0 = tokenA, 1 = tokenB
    const [tokens, setTokens] = useState<any>([]);
    const [tokenA, setTokenA] = useState<any>({
        address: SuppotedWrappedETHContractAddress(provider?._network.chainId),
        name: 'Ether',
        symbol: 'ETH',
        logo: "/images/eth.png",
        decimals: 18
      });
    const [tokenB, setTokenB] = useState<any>({});
    const [amountA, setAmountA] = useState<number>(0);
    const [amountB, setAmountB] = useState<number>(0);
    const [balanceA, setBalanceA] = useState(0);
    const [balanceB, setBalanceB] = useState(0);
    const [price, setPrice] = useState(0);
    const [priceImpact, setPriceImpact] = useState(0);
    const [allowAmount, setAllowAmount] = useState(0);
    const [paths, setPaths] = useState<any>([]);
    const [bestPath, setBestPath] = useState<any>();
    const [hoverOnSwitch, setHoverOnSwitch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [indexTokenA, indexTokenB] = [0, 1];
    const [graph, setGraph] = useState(false);
    const [tokensSelected, setTokensSelected] = useState(false);
    const [swapMode, setSwapMode] = useState(MODE_SWAP);
    const [loadingTokens, setLoadingTokens] = useState<boolean>(false)
    const [loadingTokenPrice, setLoadingTokenPrice] = useState<boolean>(false)
    const [userEmail, setUserEmail] = useState<string>("")
    const [currentChainId, setCurrrentChainId] = useState<any>(provider?._network.chainId)
    const [network, setNetwork] = useState<any>({"image": "/images/base.png", "name":"BASE"})
    const [networkselectedA, setNetworkSelectedA] = useState<any>({"image": "/images/base.png", "name":"BASE", "id":84532, "address": "0x601566d18cdaE8D4347bB6ba43C5C2247D9c1f5a", "CCIP_BnM": "0x88A2d74F47a237a62e7A51cdDa67270CE381555e", "CCIP_LnM": "0xA98FA8A008371b9408195e52734b1768c0d1Cb5c"})
    const cryptoSupportData = [
      {"image": "/images/base.png", "name":"BASE", "id":84532},
      {"image": "/images/optimism.png", "name":"OPTIMISM", "id":11155420},
      {"image": "/images/celo.png", "name":"CELO", "id":44787},
      {"image": "/images/mode.png", "name":"MODE", "id":919},
   ]

   const networks = [
    {"image": "/images/base.png", "name":"BASE", "id":84532, "address": "0x601566d18cdaE8D4347bB6ba43C5C2247D9c1f5a", "CCIP_BnM": "0x88A2d74F47a237a62e7A51cdDa67270CE381555e", "CCIP_LnM": "0xA98FA8A008371b9408195e52734b1768c0d1Cb5c"},
    {"image": "/images/optimism.png", "name":"OPTIMISM", "id":11155420, "CCIP_BnM": "0x8aF4204e30565DF93352fE8E1De78925F6664dA7", "CCIP_LnM": "0x044a6B4b561af69D2319A2f4be5Ec327a6975D0a", "address": "0xb4BF84b079E080Be165174357cEdC10FACAAB9Ae", "chainSelector" : "5224473277236331295"},
    {"image": "/images/celo.png", "name":"CELO", "id":44787, "address": "0xa2EF6cCB0b4A6c23FBb4e56e839456613bF03970", "CCIP_BnM": "0x7e503dd1dAF90117A1b79953321043d9E6815C72", "CCIP_LnM": "0x7F4e739D40E58BBd59dAD388171d18e37B26326f", "chainSelector" : "3552045678561919002"},
    {"image": "/images/mode.png", "name":"MODE", "id":919, "address": "0x2Db56C7de28B1B78b623715c98f74156790f82c8", "CCIP_BnM": "0xB9d4e1141E67ECFedC8A8139b5229b7FF2BF16F5", "CCIP_LnM": "0x86f9Eed8EAD1534D87d23FbAB247D764fC725D49", "chainSelector" : "829525985033418733"},
]

    const getSigner = () => {
       try {
        if(provider){
          let _chainId = provider?._network.chainId;
          setCurrrentChainId(_chainId)
          let _network = cryptoSupportData.filter((item) => { return item.id == _chainId })
          let _networkSelected = networks.filter((item) => { return item.id == _chainId })
          setNetwork( _network[0])
          setNetworkSelectedA(_networkSelected[0])
        }
       }catch(error){
        console.log(error)
       }
    }

    useEffect(() => {
      getSigner();
  }, [provider])


    const selectToken = (_tokenA : any, _tokenB : any) => {
        if (Object.keys(_tokenA).length > 0 && Object.keys(_tokenB).length > 0) {
          const resetToken = () => {
            setTokensSelected(false);
            tokenIndex === indexTokenA ? setTokenA({}) : setTokenB({});
          }
          if (_tokenA.address === _tokenB.address) {
            if (_tokenA.address === SuppotedWrappedETHContractAddress(provider?._network.chainId) && _tokenA.symbol !== _tokenB.symbol) {
              if (isETH(_tokenA, provider)) {
                setSwapMode(MODE_WRAP);
              } else {
                setSwapMode(MODE_UNWRAP);
              }
            } else {
              resetToken();
              toast.error('The selected tokens are identical, please select another token!');
              return;
            }
          } else {
            // Check if there is a path between token A and token B
            const _paths = findAllPaths(_tokenA.address, _tokenB.address, graph);
            if (_paths.length <= 0) {
              resetToken();
              toast.error(`There is no swap path from ${_tokenA.symbol} to ${_tokenB.symbol}!`);
              return;
            }
            setSwapMode(MODE_SWAP);
            setPaths(_paths);
          }
        }
        setTokenA(_tokenA);
        setTokenB(_tokenB);
        setAmountA(0);
        setAmountB(0);
        setPrice(0);
        setAllowAmount(0);
        setBestPath([]);
        setTokensSelected(true);
    }

    const initGraph = useCallback(async () => {
        setLoading(true);
        try {
          let factory = new ethers.Contract(SuppotedPairFactoryContractAddress(provider?._network.chainId), FactoryABI.abi, provider);
          const nPairs = await factory.allPairsLength();
          const edgeList = [];
    
          // Iterate through all pairs to get the edges of the graph
          for (let i = 0; i < nPairs; i++) {
            let pairAddress = await factory.allPairs(i);
            let tokenPair = new ethers.Contract(pairAddress, TokenPairABI, provider);
            let _tokenA = await getTokenInfo(await tokenPair.tokenA(), provider);
            let _tokenB = await getTokenInfo(await tokenPair.tokenB(), provider);
            edgeList.push([_tokenA, _tokenB]);
          }
          // Make the graph with edge list
          const _graph = buildGraphFromEdges(edgeList);
          setGraph(_graph);
          if (edgeList.length > 0) {
            // Set tokenA and tokenB from the first token pair.
            const [_tokenA, _tokenB] = edgeList[0];
            setTokenA(_tokenA);
            setTokenB(_tokenB);
            setTokensSelected(true);
            const _paths = findAllPaths(_tokenA.address, _tokenB.address, _graph);
            setPaths(_paths);
          }
        } catch (error) {
          toast.error("Cannot initiate data for swapping!")
          console.log(error);
        }
        setLoading(false);
    }, [provider]);

    const checkAllowance = useCallback(async () => {
        if (!tokensSelected || isETH(tokenA, provider)) {
          return;
        }
        try {
          const _token = new ethers.Contract(tokenA.address, ERC20ABI, signer);
          let _allow = await _token.allowance(address, SuppotedAMMRouterContractAddress(provider?._network.chainId));
          _allow = Number(ethers.utils.formatUnits(_allow, tokenA.decimals));
          setAllowAmount(_allow);
        } catch (error) {
          toast.error(getErrorMessage(error, "Cannot check allowances!"));
          console.error(error);
        }
    }, [address, signer, tokenA, tokensSelected, provider]);

    const getBalances = useCallback(async () => {
        if (!tokensSelected) {
          return;
        }
        try {
          if (isETH(tokenA, provider)) {
              const balance = await getBalance(configConnect, {
                //@ts-ignore
                address: address,
                chainId: currentChainId, 
            })
            const _balanceA = balance.value
            setBalanceA(Number(ethers.utils.formatUnits(_balanceA)));
          } else {
            const _tokenA = new ethers.Contract(tokenA.address, ERC20ABI, signer);
            const _balanceA = await _tokenA.balanceOf(address);
            setBalanceA(Number(ethers.utils.formatUnits(_balanceA, tokenA.decimals)));
          }
          if (isETH(tokenB, provider)) {
            const balance = await getBalance(configConnect, {
              //@ts-ignore
              address: address, 
              chainId: currentChainId,
          })
            const _balanceB = balance.value
            setBalanceB(Number(ethers.utils.formatUnits(_balanceB)));
          } else {
            const _tokenB = new ethers.Contract(tokenB.address, ERC20ABI, signer);
            const _balanceB = await _tokenB.balanceOf(address);
            setBalanceB(Number(ethers.utils.formatUnits(_balanceB, tokenB.decimals)));
          }
        } catch (error) {
          toast.error(getErrorMessage(error, "Cannot get token balances!"), { toastId: 'BALANCE_0' });
          console.log(error);
        }
      }, [address, signer, tokenA, tokenB, currentChainId, provider, tokensSelected]);
    
      useEffect(() => {
        if (!graph && swapMode === MODE_SWAP) {
          initGraph();
        }
        if (address) {
          checkAllowance();
          getBalances();
        }
      }, [address, checkAllowance, getBalances, graph, initGraph, swapMode]);
    
      const handleMax = () => {
        setAmountA(balanceA);
        setTokenIndex(indexTokenA);
        if (swapMode === MODE_SWAP) {
          getReceivingAmount(balanceA);
        } else {
          setAmountB(balanceA);
        }
      }
    
      const handleChange = (e : any) => {
        let tmpVal = e.target.value ? e.target.value : 0;
        let id = e.target.id;
        if (tmpVal < 0 || isNaN(tmpVal)) {
          tmpVal = id === 'tokenA' ? amountA : amountB;
        } else if (!(typeof tmpVal === 'string' && (tmpVal.endsWith(".") || tmpVal.startsWith(".")))) {
          tmpVal = Number(e.target.value.toString());
        }
        if (id === 'tokenA') {
          setAmountA(tmpVal);
          if (swapMode !== MODE_SWAP) {
            setAmountB(tmpVal);
          }
          setTokenIndex(indexTokenA);
        } else if (id === 'tokenB') {
          setAmountB(tmpVal);
          if (swapMode !== MODE_SWAP) {
            setAmountA(tmpVal);
          }
          setTokenIndex(indexTokenB);
        }
      }
    
      const getReceivingAmount = async (amount? : any) => {
        // amount is used for handleMax()
        amount = amount > 0 ? amount : amountA;
        if (amount <= 0) {
          return;
        }
        setLoading(true);
        console.log("loading")
        try {
          const ammRouter = new ethers.Contract(SuppotedAMMRouterContractAddress(provider?._network.chainId), AMMRouterABI.abi, provider);
          let max = Number.MIN_SAFE_INTEGER;
          let _bestPath = null;
          for (const path of paths) {
            const _amount = ethers.utils.parseUnits(toString(amount), tokenA.decimals);
            const amounts = await ammRouter.getAmountsOut(_amount, path);
            const _amountB = Number(ethers.utils.formatUnits(amounts[amounts.length - 1], tokenB.decimals));
            if (_amountB > max) {
              max = _amountB;
              _bestPath = path;
            }
          }
          setAmountB(max);
          setBestPath(_bestPath);
          const newPrice = amount / max;
          setPrice(newPrice);
          estimatePriceImpact(ammRouter, _bestPath, newPrice);
        } catch (error) {
          toast.error('Cannot get receiving amount!');
          console.error(error);
        }
        setLoading(false);
      }
    
      const getSpendingAmount = async () => {
        if (amountB <= 0) {
          return;
        }
        setLoading(true);
        try {
          const ammRouter = new ethers.Contract(SuppotedAMMRouterContractAddress(provider?._network.chainId), AMMRouterABI.abi, provider);
          let min = Number.MAX_SAFE_INTEGER;
          let _bestPath = null;
          for (const path of paths) {
            const _amount = ethers.utils.parseUnits(toString(amountB), tokenA.decimals);
            const amounts = await ammRouter.getAmountsIn(_amount, path);
            const _amountA = Number(ethers.utils.formatUnits(amounts[0], tokenA.decimals));
            if (_amountA < min) {
              min = _amountA;
              _bestPath = path;
            }
          }
          setAmountA(min);
          setBestPath(_bestPath);
          const newPrice = min / amountB;
          setPrice(newPrice);
          estimatePriceImpact(ammRouter, _bestPath, newPrice);
        } catch (error) {
          toast.error('Insufficient reserves!');
          console.error(error);
        }
        setLoading(false);
      }
    
      const printSwapPath = (path : any) => {
        let result = '';
        if (!path || path.length < 2) {
          return result;
        }
        for (const address of path) {
          //@ts-ignore
          result += ` => ${graph.get(address).token.symbol}`;
        }
        return result.substring(4);
      }
    
      const estimatePriceImpact = async (ammRouter : any, path : any, newPrice : any) => {
        // Get the old price based on existing reserves through the path.
        let oldPrice = 1;
        for (let i = 0; i < path.length - 1; i++) {
          const [reserveA, reserveB,] = await ammRouter.getReserves(path[i], path[i + 1]);
          //@ts-ignore
          oldPrice = oldPrice * Number(ethers.utils.formatUnits(reserveA, graph.get(path[i]).token.decimals))
          //@ts-ignore
            / Number(ethers.utils.formatUnits(reserveB, graph.get(path[i + 1]).token.decimals));
        }
        setPriceImpact(100 * (newPrice / oldPrice - 1));
      }
    
      const handleApprove = async () => {
        setLoading(true);
        try {
          const _token = new ethers.Contract(tokenA.address, ERC20ABI, signer);
          const _allowAmount = ethers.utils.parseUnits(toString(amountA), tokenA.decimals);
          const tx = await _token.approve(SuppotedAMMRouterContractAddress(provider?._network.chainId), _allowAmount);
          await tx.wait();
          toast.info(`${tokenA.symbol} is enabled!`);
          await checkAllowance();
        } catch (error) {
          toast.error(getErrorMessage(error, `Cannot enable ${tokenA.symbol} !`));
          console.error(error);
        }
        setLoading(false);
      }
      const handleSwap = async () => {
        setLoading(true);
        try {
          const ammRouter = new ethers.Contract(SuppotedAMMRouterContractAddress(provider?._network.chainId), AMMRouterABI.abi, signer);
          //@ts-ignore
          const deadline = parseInt(new Date().getTime() / 1000) + 30;
          let tx;
          if (isETH(tokenA, provider)) {
            tx = await (tokenIndex === indexTokenA ?
              ammRouter.swapExactETHForTokens(
                ethers.utils.parseUnits(toString(amountB * 0.9), tokenB.decimals),
                bestPath, address, deadline, {
                value: ethers.utils.parseUnits(toString(amountA), tokenA.decimals)
              }) :
              ammRouter.swapETHForExactTokens(
                ethers.utils.parseUnits(toString(amountB), tokenB.decimals),
                bestPath, address, deadline, {
                value: ethers.utils.parseUnits(toString(amountA * 1.1), tokenA.decimals)
              }));
          } else if (isETH(tokenB, provider)) {
            tx = await (tokenIndex === indexTokenA ?
              ammRouter.swapExactTokensForETH(
                ethers.utils.parseUnits(toString(amountA), tokenA.decimals),
                ethers.utils.parseUnits(toString(amountB * 0.9), tokenB.decimals),
                bestPath, address, deadline) :
              ammRouter.swapTokensForExactETH(
                ethers.utils.parseUnits(toString(amountB), tokenB.decimals),
                ethers.utils.parseUnits(toString(amountA * 1.1), tokenA.decimals),
                bestPath, address, deadline
              ));
          } else {
            tx = await (tokenIndex === indexTokenA ?
              ammRouter.swapExactTokensForTokens(
                ethers.utils.parseUnits(toString(amountA), tokenA.decimals),
                ethers.utils.parseUnits(toString(amountB * 0.9), tokenB.decimals),  // Min acceptable receiving amount
                bestPath, isAddress, deadline) :
              ammRouter.swapTokensForExactTokens(
                ethers.utils.parseUnits(toString(amountB), tokenB.decimals),
                ethers.utils.parseUnits(toString(amountA * 1.1), tokenA.decimals),  // Max acceptable spending amount
                bestPath, address, deadline
              ));
          }
          await tx.wait();
          toast.info(`Swap succeeded! Transaction Hash: ${tx.hash}`)
          setAmountA(0);
          setAmountB(0);
          await getBalances();
          await checkAllowance();
        } catch (error) {
          toast.error(getErrorMessage(error, 'Cannot perform swap!'));
          console.error(error);
        }
        setLoading(false);
      }
    
      const handleWrap = async () => {
        setLoading(true);
        try {
          const contract = new ethers.Contract(SuppotedWrappedETHContractAddress(provider?._network.chainId), WETHABI.abi, signer);
          const tx = await (swapMode === MODE_WRAP ?
            contract.deposit({ value: ethers.utils.parseUnits(toString(amountA)) }) :
            contract.withdraw(ethers.utils.parseUnits(toString(amountA))));
          await tx.wait();
          toast.info(`${swapMode === MODE_WRAP ? "wrap" : "unwrap"} succeeded! Transaction Hash: ${tx.hash}`);
          setAmountA(0);
          setAmountB(0);
          await getBalances();
        } catch (error) {
          toast.error(getErrorMessage(error,
            `Cannot perform ${swapMode === MODE_WRAP ? "wrap" : "unwrap"} !`));
          console.error(error);
        }
        setLoading(false);
      }

      const getSupportedTokens = useCallback(async (erc20Only? : any, customTokens? : any) => {
        setLoadingTokens(true)
        if (customTokens && customTokens.length > 0) {
          setTokens(customTokens);
          return;
        }
        // The native coin of EVM and its wrapped form
        const _tokens = [{
          address: SuppotedWrappedETHContractAddress(provider?._network.chainId),
          name: 'Ether',
          symbol: 'ETH',
          logo: "/images/eth.png",
          decimals: 18
        }, {
          address: SuppotedWrappedETHContractAddress(provider?._network.chainId),
          name: 'Wrapped ETH',
          symbol: 'WETH',
          logo: "/images/eth.png",
          decimals: 18
        }];
        if (erc20Only) {
          // Remove the first element since ETH is not an ERC20 token
          _tokens.shift();
        }
         if(provider?._network.chainId){
          //@ts-ignore
          for (let TokenAddress of SuppotedTokens(provider?._network.chainId)) {
            //@ts-ignore
            _tokens.push(await getTokenInfo(TokenAddress, provider));
          }
          setTokens(_tokens);
          setLoadingTokens(false)
         }
        //@ts-ignore
      }, [provider]);
    
      useEffect(() => {
        if(provider){
          getSupportedTokens();
        }
      }, [getSupportedTokens, provider])
    

  const disconnectWallet = async () => {};

  return {
    disconnectWallet,
    selectToken,
    initGraph,
    checkAllowance,
    handleApprove,
    handleChange,
    handleSwap,
    printSwapPath,
    estimatePriceImpact,
    handleWrap,
    getSpendingAmount,
    getReceivingAmount,
    handleMax,
    getBalances,
    tokenA, 
    setTokenA,
    tokenB, 
    setTokenB,
    amountA, 
    setAmountA,
    amountB, 
    setAmountB,
    balanceA, 
    setBalanceA,
    balanceB, 
    setBalanceB,
    price, 
    setPrice,
    priceImpact, 
    setPriceImpact,
    allowAmount, 
    setAllowAmount,
    paths, 
    setPaths,
    bestPath, 
    setBestPath, 
    hoverOnSwitch,
    setHoverOnSwitch,
    loading, 
    setLoading,
    indexTokenA,
    indexTokenB,
    graph,
    setGraph,
    tokensSelected,
    setTokensSelected,
    swapMode,
    setSwapMode,
    MODE_SWAP,
    MODE_WRAP,
    MODE_UNWRAP,
    tokenIndex, 
    setTokenIndex,
    address,
    isETH,
    tokens,
    network,
    setNetwork,
    loadingTokens,
    setTokens,
    provider,
    setLoadingTokens,
    signer,
    userEmail, 
    setUserEmail,
    currentChainId,
    networkselectedA, 
    setNetworkSelectedA
  };
};

export default useSwap;