import { ethers } from 'ethers';
import { ERC20ABI } from './ERC20ABI';
import FactoryABI from '@/contracts/PairFactory.json';
import FactoryAddress from '@/contracts/PairFactory-address.json';
import { TokenPairABI } from './TokenPairABI';
import WETH from '@/contracts/WETH-address.json';

export const getTokenInfo = async (address : any, provider : any) => {
  let name = "Unknown", symbol = "Unknown", logo = "", decimals = 18;
  if (address === WETH.address) {
    // Shortcut for Ether
    return { address, name: "Ether", symbol: "ETH", decimals: 18 };
  }
  try {
    const contract = new ethers.Contract(address, ERC20ABI, provider);
    name = await contract.name();
    symbol = await contract.symbol();
    decimals = await contract.decimals();
  } catch (error) {
    console.error(error);
  }
  return { address, name, symbol, decimals, logo };
}

export const getLiquidityPools = async (provider : any) => {
  const pools = new Map();
  try {
    const factory = new ethers.Contract(FactoryAddress.address, FactoryABI.abi, provider);
    const nPairs = await factory.allPairsLength();
    for (let i = 0; i < nPairs; i++) {
      const address = await factory.allPairs(i);
      const tokenPair = new ethers.Contract(address, TokenPairABI, provider);
      const tokenA = await getTokenInfo(await tokenPair.tokenA(), provider);
      const tokenB = await getTokenInfo(await tokenPair.tokenB(), provider);
      pools.set(address, { tokenA, tokenB });
    }
  } catch (error) {
    console.error(error);
  }
  return pools;
}

export const ERROR_CODE = {
  'ACTION_REJECTED': 'Action rejected by user!'
}

export const getErrorMessage = (error : any, defaultMessage : string) => {
  return ERROR_CODE[error.code] || defaultMessage;
}

export const toString = (x : any) => {
  if (Math.abs(x) < 1.0) {
    let e = parseInt(x.toString().split('e-')[1]);
    if (e) {
      x *= Math.pow(10, e - 1);
      x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    let e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
      e -= 20;
      x /= Math.pow(10, e);
      x += (new Array(e + 1)).join('0');
    }
  }
  return x.toString();
}

// Check if a token object is ETH
export const isETH = (token : any)=> {
  return token.address === WETH.address && token.symbol === 'ETH';
}

// Format BigNumber interst to percentage
export const formatInterest = (interest : any) => {
  return (Number(ethers.utils.formatEther(interest)) * 100).toFixed(2) + "%";
}

export const formatEtherOrNA = (value : any) => {
  return value ? Number(ethers.utils.formatEther(value)).toFixed(2) : 'N/A';
}

export const boolOrNA = (value : any) => {
  return value === undefined || value === null ? 'N/A' : value.toString();
}