# Wallet Service
## _A serivce for building blockchain transactions and fulfilling them on chain_

## Table of Contents
1. [Setup](#setup)
2. [Features](#features)
3. [Adding new features](#adding-new-features)
4. [Inspiration](#inpiration)

## Setup
1. clone the repo
2. Create a `.env` file using the `.env.example` file. To send transactions to the blockchain using your public/private keypair, install the metamask chrome extension here: `https://metamask.io/download/`. Create a new wallet and give yourself some goerli testnet ETH here: `https://goerlifaucet.com/`. Export the public private key pair and add them to the readme under `SARDINE_PUBLIC` and `SARDINE_PRIVATE` 
3. run `npm install` to install dependencies (compiling will not work)
4. run `npm run dev` to start the server. Uses your public/private key pair by default
  - `npm run dev -- fireblocks` to use fireblocks instead

Docker setup coming soon

## Features
to use a feature make sure your server is running

### Transfer Funds (in progress)
_This feature allows crypto backend to send api requests to wallet service to transfer funds to different addresses in different currencies_
Steps for Transfering WETH on Polygon Mumbai using your Public Private Key Pair:
1. Join the polygon discord server: https://discord.gg/ctfKkChkZC
2. In the `matic-faucet` channel use the commands to request matic
3. Go to`https://uniswap.org/`, launch the app and switch to `polygon-mumbai`
4. Swap your matic for WETH
5. Call `localhost:8000/api/evm/transfer-funds` with the following body:
```
{
    "orders": [
        {
            "assetId": "MATIC",
            "toAddress": "SOME_OTHER_ADDRESS",
            "amountInAsset": "0.1",
            "assetContractAddress": "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889" // WETH ADDRESS ON MUMBAI
        }
    ]
}
```

### Buy Seaport NFT (in progress)
_This feature allows you to buy a given NFT on a seaport marketplace through an API request._
Steps:
1. Go to `https://testnets.opensea.io/` and click on an NFT you would "like" to purcahse. The url should look something like thid: `https://testnets.opensea.io/assets/goerli/0xb00492a72557b778cb31270e78d27716d6340bbf/1` Note the contractAddress and nftId. In this case that would be `0xb00492a72557b778cb31270e78d27716d6340bbf` and `1` respectively.

## Adding New Features
1. In `api/routes` add the endpoint to your new feature
2. Add a controller to handle incoming requests
3. Create a new command file and write the command "uninjected", all dependencies should be passed as arguments and the function should return the injected version.
4. Export the injected version in `commands/index.ts`
5. Test

## Inspiration
- Folder Structure: https://dev.to/santypk4/bulletproof-node-js-project-architecture-4epf
- Functional Dependency Injection: https://hugonteifeh.medium.com/functional-dependency-injection-in-typescript-4c2739326f57
- Request Validation: https://medium.com/@saman.ghm/validation-and-conversion-request-body-in-one-line-for-node-js-with-typescript-6adfac0ccd0a
- Repository Pattern: https://medium.com/@erickwendel/generic-repository-with-typescript-and-node-js-731c10a1b98e
