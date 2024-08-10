import { BaseAddresses, ModeTestnetAddresses, OptimismAddresses, CeloAlfajoresAddresses } from './contractAddresses'

export const SuppotedTokens = (currentChainId : any ) => {
  switch(currentChainId) {
    case 84532:
      return [BaseAddresses.SimpleDeFiTokenContractAddress, BaseAddresses.MemeTokenContractAddress, BaseAddresses.FooTokenContractAddress, BaseAddresses.BarTokenContractAddress];
    case 11155420:
      return [OptimismAddresses.SimpleDeFiTokenContractAddress, OptimismAddresses.MemeTokenContractAddress, OptimismAddresses.FooTokenContractAddress, OptimismAddresses.BarTokenContractAddress];
    case 44787:
      return [CeloAlfajoresAddresses.SimpleDeFiTokenContractAddress, CeloAlfajoresAddresses.MemeTokenContractAddress, CeloAlfajoresAddresses.FooTokenContractAddress, CeloAlfajoresAddresses.BarTokenContractAddress];
    case 919:
      return [ModeTestnetAddresses.SimpleDeFiTokenContractAddress, ModeTestnetAddresses.MemeTokenContractAddress, ModeTestnetAddresses.FooTokenContractAddress, ModeTestnetAddresses.BarTokenContractAddress];
    default:
      return [ModeTestnetAddresses.SimpleDeFiTokenContractAddress, ModeTestnetAddresses.MemeTokenContractAddress, ModeTestnetAddresses.FooTokenContractAddress, ModeTestnetAddresses.BarTokenContractAddress];
  }
    
}

export const SuppotedWrappedETHContractAddress = (currentChainId : any ) => {
  switch(currentChainId) {
    case 84532:
      return BaseAddresses.WrappedETHContractAddress;
    case 11155420:
      return OptimismAddresses.WrappedETHContractAddress;
    case 44787:
      return CeloAlfajoresAddresses.WrappedETHContractAddress;
    case 919:
      return ModeTestnetAddresses.WrappedETHContractAddress
    default:
      return ModeTestnetAddresses.WrappedETHContractAddress
  }
    
}

export const SuppotedPairFactoryContractAddress = (currentChainId : any ) => {
  switch(currentChainId) {
    case 84532:
      return BaseAddresses.PairFactoryContractAddress;
    case 11155420:
      return OptimismAddresses.PairFactoryContractAddress;
    case 44787:
      return CeloAlfajoresAddresses.PairFactoryContractAddress;
    case 919:
      return ModeTestnetAddresses.PairFactoryContractAddress
    default:
      return ModeTestnetAddresses.PairFactoryContractAddress
  }
    
}

export const SuppotedAMMRouterContractAddress = (currentChainId : any ) => {
  switch(currentChainId) {
    case 84532:
      return BaseAddresses.AMMRouterContractAddress;
    case 11155420:
      return OptimismAddresses.AMMRouterContractAddress;
    case 44787:
      return CeloAlfajoresAddresses.AMMRouterContractAddress;
    case 919:
      return ModeTestnetAddresses.AMMRouterContractAddress
    default:
      return ModeTestnetAddresses.AMMRouterContractAddress
  }
    
}

export const SuppotedStakingPoolManagerContractAddress = (currentChainId : any ) => {
  switch(currentChainId) {
    case 84532:
      return BaseAddresses.StakingPoolManagerContractAddress;
    case 11155420:
      return OptimismAddresses.StakingPoolManagerContractAddress;
    case 44787:
      return CeloAlfajoresAddresses.StakingPoolManagerContractAddress;
    case 919:
      return ModeTestnetAddresses.StakingPoolManagerContractAddress
    default:
      return ModeTestnetAddresses.StakingPoolManagerContractAddress
  }
    
}

export const SuppotedAssetPoolShareDeployerContractAddress = (currentChainId : any ) => {
  switch(currentChainId) {
    case 84532:
      return BaseAddresses.AssetPoolShareDeployerContractAddress;
    case 11155420:
      return OptimismAddresses.AssetPoolShareDeployerContractAddress;
    case 44787:
      return CeloAlfajoresAddresses.AssetPoolShareDeployerContractAddress;
    case 919:
      return ModeTestnetAddresses.AssetPoolShareDeployerContractAddress
    default:
      return ModeTestnetAddresses.AssetPoolShareDeployerContractAddress
  }
    
}
export const SuppotedPriceOraclev2ContractAddress = (currentChainId : any ) => {
  switch(currentChainId) {
    case 84532:
      return BaseAddresses.PriceOraclev2ContractAddress;
    case 11155420:
      return OptimismAddresses.PriceOraclev2ContractAddress;
    case 44787:
      return CeloAlfajoresAddresses.PriceOraclev2ContractAddress;
    case 919:
      return ModeTestnetAddresses.PriceOraclev2ContractAddress
    default:
      return ModeTestnetAddresses.PriceOraclev2ContractAddress
  }
    
}
export const SuppotedAssetPoolContractAddress = (currentChainId : any ) => {
  switch(currentChainId) {
    case 84532:
      return BaseAddresses.AssetPoolContractAddress;
    case 11155420:
      return OptimismAddresses.AssetPoolContractAddress;
    case 44787:
      return CeloAlfajoresAddresses.AssetPoolContractAddress;
    case 919:
      return ModeTestnetAddresses.AssetPoolContractAddress
    default:
      return ModeTestnetAddresses.AssetPoolContractAddress
  }
    
}
export const SuppotedPoolConfiguration = (currentChainId : any ) => {
  switch(currentChainId) {
    case 84532:
      return BaseAddresses.PoolConfiguration;
    case 11155420:
      return OptimismAddresses.PoolConfiguration;
    case 44787:
      return CeloAlfajoresAddresses.PoolConfiguration;
    case 919:
      return ModeTestnetAddresses.PoolConfiguration
    default:
      return ModeTestnetAddresses.PoolConfiguration
  }
    
}

export const SuppotedTokensBAR = (currentChainId : any ) => {
  switch(currentChainId) {
    case 84532:
      return  BaseAddresses.BarTokenContractAddress;
    case 11155420:
      return OptimismAddresses.BarTokenContractAddress;
    case 44787:
      return  CeloAlfajoresAddresses.BarTokenContractAddress;
    case 919:
      return  ModeTestnetAddresses.BarTokenContractAddress;
    default:
      return  ModeTestnetAddresses.BarTokenContractAddress;
  }
    
}

export const SuppotedTokensFOO = (currentChainId : any ) => {
  switch(currentChainId) {
    case 84532:
      return  BaseAddresses.FooTokenContractAddress;
    case 11155420:
      return OptimismAddresses.FooTokenContractAddress;
    case 44787:
      return  CeloAlfajoresAddresses.FooTokenContractAddress;
    case 919:
      return  ModeTestnetAddresses.FooTokenContractAddress;
    default:
      return  ModeTestnetAddresses.FooTokenContractAddress;
  }
    
}


