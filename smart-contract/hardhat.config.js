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
     chainId: 1337                
   },
   optimismSepolia : {
      url: 'https://sepolia.optimism.io',
      accounts: [process.env.PRIVATE_KEY],
    },
 },
 etherscan: {
    apiKey: {
      // Is not required by blockscout. Can be any non-empty string
      optimismSepolia: "abc"
    },
    customChains: [
      {
        network: "optimism-sepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://optimism-sepolia.blockscout.com/api",
          browserURL: "https://optimism-sepolia.blockscout.com/",
        }
      }
    ]
  },
  sourcify: {
    enabled: false
  }
};
