# Welcome to Deximpli

Swap, Stake, Farm, Borrow and Send tokens instantly to anyone via email.


## Introduction

Deximpli is a cutting-edge DeFi platform built on Base, Optimism, Mode, and Celo. It features a comprehensive suite of financial tools, including a decentralized exchange (DEX) with liquidity provision and yield farming, a dynamic crypto loan system with multi-collateral support and adjustable interest rates, and advanced staking mechanisms. A standout feature of Deximpli is its email-based crypto transfer system, which allows users to send funds via email without requiring the recipient to have an account or wallet. The recipient simply needs to verify ownership of the email address to withdraw the funds. This innovative system leverages account abstraction and zero-knowledge proofs for secure and seamless transactions.

## Demo

### Home page

![Home page](./frontend/public/images/homepage.png)

### Swap page

![Swap page](./frontend/public/images/swappage.png)

### Loan page

![Swap page](./frontend/public/images/loanpage.png)

## Features
- **Cross-Chain Bridge:** Seamlessly transfer assets between different blockchains, enhancing interoperability.

- **Email-Based Crypto Transfers:** Send and receive crypto using only an email address; no wallet required for recipients. Withdraw funds with email ownership verification using account abstraction and zero-knowledge proof.

- **Token Swaps:** Perform token swaps easily with an integrated Automated Market Maker (AMM) and Constant Product Market Maker (CPMM).

- **Liquidity Provision:** Provide liquidity and earn rewards through streamlined mechanisms.

- **Staking & Yield Farming:** Engage in staking with auto-compounding and multi-asset staking to maximize returns.

- **Lending & Borrowing:** Access crypto loans with features including multi-collateral support, dynamic interest rates, and an integrated price feed oracle.

- **User-Friendly Interface:** Simplified web2-like processes with no need for wallets, private keys, or seed phrases.

- **DKIM Signature Verification:** Utilizing zero-knowledge (zk) proofs and the verification of DKIM signatures in email headers, we ensure a secure and private authentication process.

- **ERC-4337 Contract Wallet Integration:** Ownership of the ERC-4337 contract wallet can be transferred to the temporary wallet address, streamlining the user experience without compromising on security.

- **Cross-Chain Compatibility:** The ERC-4337 smart contract wallet address corresponding to the email remains constant across all EVM-compatible chains, ensuring a unified wallet experience regardless of the blockchain network.

## Current Limitations and Future Work

- **Email Provider Support:** For demonstration purposes, we currently support authentication via **Gmail** only. However, expanding support to include additional email providers is planned for future development and requires minimal effort.
- **Expiration Time:** Incorporating expiration times in the emails sent by users, alongside mechanisms like passkeys, to secure sessions on-chain within the designated expiration timeframe.
- **Enterprise Paymaster:** Enabling enterprise email domains to act as Paymasters, covering gas fees for their employees through verifiable zk proofs on the blockchain.

## Technologies Used

- **Blockchain network:** Mode testnet, Base Sepolia, Optimism Sepolia, Celo Alfajores.
- **Blockchain Smart contract Verificaton :** BlockScout.
- **Blockchain Cross Chain Bridge :** ChainLink.
- **Smart Contract development Framework :** Hardhat.
- **AA and ZK Smart Contract development Framework :** Foundary.
- **Frontend development Framework :** Next Js.
- **Off-chain Database :** PostSql.

## Getting Started

This section provides a comprehensive guide to setting up the Ethereum Email Wallet Connector on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following tools and accounts set up:

- [Node.js](https://nodejs.org/en): A JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Pnpm](https://pnpm.io/installation) or any other package manager like npm: For managing project dependencies.
- [Bun](https://bun.sh/): Utilized for enhanced frontend development experience due to its speed.
- [Foundry](https://book.getfoundry.sh/getting-started/installation): A smart contract development toolkit.
- [Circom](https://docs.circom.io/getting-started/installation/): For developing and compiling zero-knowledge circuits.
- An email service with DKIM signature support: Currently, for demonstration purposes, Gmail is the supported email service.

### Installation

#### Cloning the Repository

Start by cloning the project repository:

```bash
git clone https://github.com/paschal533/Deximpli.git
```

### Smart Contract Setup

1. **Install Smart Contract Dependencies:**

   Navigate to the `contracts` directory and install the necessary dependencies:

   ```bash
   cd contracts && pnpm install
   ```

2. **Configure Environment Variables:**

   Set up your environment variables for deployment:

   ```bash
   export PRIVATE_KEY=<YOUR_PRIVATE_KEY>
   export RPC_URL=<RPC_URL>
   ```

3. **Deploy the AA Email Account Factory:**

   Deploy your smart contract with the provided script:

   ```bash
   ./script/deploy-contract.sh

   # Verify the contract if you want
   # Caution: You should modify the variables inside the shell script to the deployment address before running the script
   ./script/verify-contract.sh
   ```

### Zero-Knowledge Circuits

4. **Install Circom Dependencies:**

   Move to the `circuits` directory and install dependencies: development

   ```bash
   cd ../circuits && pnpm install
   ```

5. **Build the Circuits:**

   Compile your zero-knowledge circuits:

   ```bash
   pnpm run build
   ```

6. **Trusted Setup:**

   Perform the trusted setup for the circuits:

   ```bash
   pnpm run trusted-setup
   ```

7. **Generate and Verify Proofs (Optional):**

   Test proof generation and verification:

   ```bash
   pnpm run gen-proof && pnpm run verify-proof
   ```

### Backend Configuration

8. **Install Backend Dependencies:**

   Prepare your backend environment:

   ```bash
   cd ../backend && pnpm install
   # Establish a soft link to your rapidsnark binary
   ls -s <YOUR_RAPIDSNARK_BINARY> ./rapidsnark
   ```

9. **Update Smart Contract Address:**

   In `./src/wallet.ts`, update the address with the one from your deployed Email Account Factory.

10. **Launch the Backend Service:**

    Begin listening for requests:

    ```bash
    pnpm run listen
    ```

### Smart Contract Configuration

11. **Install the dependencies:**

    Begin by running:
   ```
    pnpm install
   ```

12. **Test the Smart contract:**
    
    Run:
    ```
    npx hardhat test
    ```

   to test the smart contract

13. **Run the node and deploy the smart contract on localhost:**
  
     Run `npx hardhat node` to start the localhost blockchain. Then
     run `npm run deploy` to deploy the smart contracts on the localhost blockchain.

### Frontend Launch

14. **Prepare Frontend Environment:**

    Install frontend dependencies:

    ```bash
    cd ../frontend && bun install
    ```

15. **Start the Development Server:**

    Launch your frontend application:

    ```
    bun run dev
    ```

## License

MIT License - Deximpli

## Contract Addresses

### Mode Testnet Addresses

```
    SimpleDeFiTokenContractAddress: 0x9100FB0C2DA8CFb1B740B94880b63dAB1Ad72d9b,
    MemeTokenContractAddress: 0xc324DBE247ce2F28B4B3a6111886B61200178819,
    FooTokenContractAddress: 0x49b5426983c9EE54B52513e72373d9145E39c5FE,
    BarTokenContractAddress: 0x8e7723832B2326d04Fffc580aE702fB935A72F4C,
    WrappedETHContractAddress: 0x767645AC4b22CD57195051dC9679a0BBa2f8De31,
    PairFactoryContractAddress: 0xD5aB1d1f446068137C9d0969A1806582DE5c162E,
    AMMRouterContractAddress: 0x88AaC1582332cFb75AD88d378770a4CED031B3a6,
    StakingPoolManagerContractAddress: 0x215a4E3cD6d4e2eAC067866Bdad6a9d425E14e8f,
    AssetPoolShareDeployerContractAddress: 0x0C1304b8391aB2F8922DEaf5E1dB19AEAE20bCA7,
    PriceOraclev2ContractAddress: 0xF98F5A048aFeC9153Cc2055eED89D676bC4843FA,
    AssetPoolContractAddress: 0x6f575EFeCA59d7Fc2556Ed4FeBd0babb935E64B7,
    PoolConfiguration: 0xf0eD06428b8E137D38f88278E67FE56247bc36f2
```

### Base Sepolia Addresses
```
    SimpleDeFiTokenContractAddress: 0xDd4EA4EF4a616Dd3bBcE696C32BB3738d6029707,
    MemeTokenContractAddress: 0xf1d8e639A2402eD519055326468F99DCfCB3e74b,
    FooTokenContractAddress: 0x76A0eD161CA6686dD4AE0cE35a71E81C9e58D5f3,
    BarTokenContractAddress: 0x0C3D5a0712C0045Ccad7bF2a13f9F36B5f7cd753,
    WrappedETHContractAddress: 0xB3aA5B4c39e7D0A67fC986A4F442d93E17fF26B6,
    PairFactoryContractAddress: 0x71F36065Ff72274FC68fe1b2BF97761FDBea996A,
    AMMRouterContractAddress: 0x96CA3c554738fD44d1D53E676E48dE3Fc4d0d9ec,
    StakingPoolManagerContractAddress: 0xe66F75313039d85ce00C0E2eC3337D54B0bc70B3,
    AssetPoolShareDeployerContractAddress: 0xa0c82F8977Cd6273d13d1235BE8744d56531b63c,
    PriceOraclev2ContractAddress: 0xbD9F64A903F59f8dFaCc53d56D977D84Cbd3074C,
    AssetPoolContractAddress: 0xB5251d0CE88d7B5C9B6fA149227B005d1739F8b4,
    PoolConfiguration: 0x1e83f20dEbA13480daEF2FB2d879965947d099c7
```

### Optimism Sepolia Addresses 
```
    SimpleDeFiTokenContractAddress: 0xD1185FcBA090739798F74578AB8EdF55Fc620812,
    MemeTokenContractAddress: 0x39E83eCA36F5AbbD1856D60c0a51e8c2458a51F5,
    FooTokenContractAddress: 0x0514eA79397801ea4CF2fB6Ad9157A73eB136987,
    BarTokenContractAddress: 0x606854C6d1f679fbbC94acbCE91f36F88Fa94167,
    WrappedETHContractAddress: 0xbe9861E6d3b0d552e326f94FF4BaC47bf682b5d7,
    PairFactoryContractAddress: 0x2E27322C8b6939116E9ea9Fd4Af4F81F6F8bADe6,
    AMMRouterContractAddress: 0x454bb6B35e1e461d0100bd277c5F1B95CDF3Ee33,
    StakingPoolManagerContractAddress: 0x7dacb9DA65fAaB14348042038c744E497234E48C,
    AssetPoolShareDeployerContractAddress: 0x933f9a9bf8694B28D4878b01cDbB2E94648510Cf,
    PriceOraclev2ContractAddress: 0x26EFd44d355DD478b8e8bCcB2bdfB928DF400DEf,
    AssetPoolContractAddress: 0x8DB1F3C57F7592a8E3F61030626DD1744b7b78F5,
    PoolConfiguration: 0xc096f36778368DE0d7612e5830e988e4BA44F4c1
```

### Celo Alfajores Addresses

```
    SimpleDeFiTokenContractAddress: 0x219Ffdd264F891837b8552fdE65f44BcB68A4C7c,
    MemeTokenContractAddress: 0xCc02A8aa68747225B6e7788bD64BBdaCb54e5c9e,
    FooTokenContractAddress: 0xbf07FCC10F057E897B2e67982d990701E7434e50,
    BarTokenContractAddress: 0xaf0ED3eEe9a9aA5c94260096C0075B554e2Fe296,
    WrappedETHContractAddress: 0x4D5F0Ec4F467D4467D7bA29F53e595d1fdB08536,
    PairFactoryContractAddress: 0x72a8f637D3De42eD490528fed7F1390135f61005,
    AMMRouterContractAddress: 0x4b47Cc0dD771e75f75D55141cFc26C6D0a26bA99,
    StakingPoolManagerContractAddress: 0xb0EFF270BbD0f23FC0f9dA508ACd00ff2E92c4B6,
    AssetPoolShareDeployerContractAddress: 0x051D8b6d3522F84b55148f9a03E0ca203E07a8Df,
    PriceOraclev2ContractAddress: 0x233a027C58833519ee6aCe03Ae5956E34c45b85e,
    AssetPoolContractAddress: 0x5424fe6064b058798A37D241829ABB41476dFa92,
    PoolConfiguration: 0x767645AC4b22CD57195051dC9679a0BBa2f8De31
```
### Account Abstraction Addresses
  ```
     Mode Testnet: 0x601566d18cdaE8D4347bB6ba43C5C2247D9c1f5a
     Base Sepolia: 0x5424fe6064b058798A37D241829ABB41476dFa92,
     Optimism Sepolia: 0x215a4E3cD6d4e2eAC067866Bdad6a9d425E14e8f,
     Celo Alfajores: 0x601566d18cdaE8D4347bB6ba43C5C2247D9c1f5a,
  ```

## Contract address verified on BlockScout

### ERC20 TOKENS
https://optimism-sepolia.blockscout.com/address/0xD1185FcBA090739798F74578AB8EdF55Fc620812#code

### WETH
https://optimism-sepolia.blockscout.com/address/0xbe9861E6d3b0d552e326f94FF4BaC47bf682b5d7#code

### PAIR FACTORY
https://optimism-sepolia.blockscout.com/address/0x2E27322C8b6939116E9ea9Fd4Af4F81F6F8bADe6#code

### AMM ROUTER
https://optimism-sepolia.blockscout.com/address/0x454bb6B35e1e461d0100bd277c5F1B95CDF3Ee33#code

### Staking Pool Manager
https://optimism-sepolia.blockscout.com/address/0x7dacb9DA65fAaB14348042038c744E497234E48C#code

### Asset Pool Share Deployer
https://optimism-sepolia.blockscout.com/address/0x933f9a9bf8694B28D4878b01cDbB2E94648510Cf#code

### PriceOracleV2
https://optimism-sepolia.blockscout.com/address/0x26EFd44d355DD478b8e8bCcB2bdfB928DF400DEf#code

### AssetPool
https://optimism-sepolia.blockscout.com/address/0x8DB1F3C57F7592a8E3F61030626DD1744b7b78F5#code
