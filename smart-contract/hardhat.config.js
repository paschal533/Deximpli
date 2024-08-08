require("@nomicfoundation/hardhat-toolbox");

const dotenv = require("dotenv");

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {                 
    hardhat: {
     chainId: 1337,
     allowUnlimitedContractSize: true                
   },
   optimismSepolia : {
      url: 'https://sepolia.optimism.io',
      accounts: [process.env.PRIVATE_KEY],
    },
  baseSepolia: {
      url: 'https://sepolia.base.org',
      accounts: [process.env.PRIVATE_KEY],
    },
  alfajores : {
      url: 'https://alfajores-forno.celo-testnet.org',
      accounts: [process.env.PRIVATE_KEY],
    },
   mode: {
      url: "https://sepolia.mode.network",
      accounts: [process.env.PRIVATE_KEY],
      allowUnlimitedContractSize: true
    }
 },
 etherscan: {
    apiKey: {
      // Is not required by blockscout. Can be any non-empty string
      optimismSepolia: "abc",
      baseSepolia: "abc",
      mode: "abc"
      
    },
    customChains: [
      {
        network: "optimismSepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://optimism-sepolia.blockscout.com/api",
          browserURL: "https://optimism-sepolia.blockscout.com/",
        }
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
         apiURL: "https://base-sepolia.blockscout.com/api",
         browserURL: "https://base-sepolia.blockscout.com"
        }
      },
      {
        network: "mode",
        chainId: 919,
        urls: {
         apiURL: "https://sepolia.explorer.mode.network/api",
         browserURL: "https://sepolia.explorer.mode.network"
        }
      },
    ]
  },
  sourcify: {
    enabled: false
  }
};
