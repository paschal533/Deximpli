# Welcome to Deximpli

Keyless, Secure Wallet via Email & ZK Proofs


## Introduction

Deximpli is a cutting-edge DeFi platform built on Base, Optimism, Mode, and Celo. It features a comprehensive suite of financial tools, including a decentralized exchange (DEX) with liquidity provision and yield farming, a dynamic crypto loan system with multi-collateral support and adjustable interest rates, and advanced staking mechanisms. A standout feature of Deximpli is its email-based crypto transfer system, which allows users to send funds via email without requiring the recipient to have an account or wallet. The recipient simply needs to verify ownership of the email address to withdraw the funds. This innovative system leverages account abstraction and zero-knowledge proofs for secure and seamless transactions.

## Demo

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

3. **Deploy the Email Account Factory:**

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

### Frontend Launch

11. **Prepare Frontend Environment:**

    Install frontend dependencies:

    ```bash
    cd ../frontend && bun install
    ```

12. **Start the Development Server:**

    Launch your frontend application:

    ```
    bun run dev
    ```

## License

MIT License - Deximpli
