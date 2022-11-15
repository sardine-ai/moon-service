# 🌒 Moon Service 
## _A service for building blockchain transactions and fulfilling them on chain_

## Table of Contents
1. [Setup](#setup)
2. [Features](#features)
3. [Adding new features](#adding-new-features)
4. [Inspiration](#inpiration)

## Setup
1. clone the repo
2. Install postgreql
3. Start postgres and create a user, give the user the superadmin role & create a database
4. Create a `.env` file using the `.env.example` file.

### Database setup
5. Update the `DATABASE_URL` variable to point to your postgres db
6. Create the migration with `npx prisma migrate dev --create-only` you will be prompted to name the migration
7. Migrate with `npx prisma migrate dev`

### Crypto setup
8. To send transactions to the blockchain using your public/private keypair, install the metamask chrome extension here: `https://metamask.io/download/`. Create a new wallet and give yourself some goerli testnet ETH here: `https://goerlifaucet.com/`. Export the public private key pair and add them to the readme under `SARDINE_PUBLIC` and `SARDINE_PRIVATE` 

### Start Server
9. To receive webhooks from fireblocks 
9. Run `npm install` to install dependencies (compiling will not work)
10. Run `npm run dev` to start the server. Uses your public/private key pair by default
  - `npm run dev -- fireblocks` to use fireblocks instead

Docker setup coming soon...

## Name convention

- Folder: kebab-case
- File: kebab-case
- Interface: PascalCase
- Variable: camelCase
- Function: camelCase

## Features
to use a feature make sure your server is running

### Transfer Funds
_This feature allows crypto backend to send api requests to wallet service to transfer funds to different addresses in different currencies_
Steps for Transfering WETH on Polygon Mumbai using your Public Private Key Pair:
1. Go to the mumbai faucer and request test polygon at: `https://faucet.polygon.technology/` 
2. Go to`https://uniswap.org/`, launch the app and switch to `polygon-mumbai`
3. Swap your matic for WETH
4. Call `localhost:8000/api/evm/transfer-funds` with the following body:
```
{
    "amountInAsset": 0.00001,
    "assetSymbol": "WETH",
    "chain": "polygon_test",
    "toAddress": "0x4cc1756281D7203A172C63E9df9307dABA5523A8" // WETH ADDRESS ON MUMBAI
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
