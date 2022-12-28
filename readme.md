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
9. Run `yarn install` to install dependencies (compiling will not work)
10. Run `yarn dev -- self` to start the server with public/private key pair. Moon services fakes transaction submissions by default
  - `yarn dev -- fireblocks` to use fireblocks instead

Docker setup coming soon...

## Name convention

- Folder: kebab-case
- File: kebab-case
- Interface: PascalCase
- Variable: camelCase
- Function: camelCase

## Features
to use a feature make sure your server is running and make sure `TEMP_API_KEY` is set in the headers under the `X-API-Key` key.

### Transfer Funds
_This feature allows crypto backend to send api requests to wallet service to transfer funds to different addresses in different currencies_
Steps for Transfering WETH on Polygon Mumbai using your Public Private Key Pair:
1. Go to the mumbai faucer and request test polygon at: `https://faucet.polygon.technology/` 
2. Go to`https://uniswap.org/`, launch the app and switch to `polygon-mumbai`
3. Swap your matic for WETH
4. Call `localhost:8000/api/v1/transfer-funds` with the following body:
```
{
    "amountInAsset": 0.00001,
    "assetSymbol": "WETH",
    "chain": "polygon_test",
    "toAddress": "0x4cc1756281D7203A172C63E9df9307dABA5523A8" // WETH ADDRESS ON MUMBAI
}
```

### Buy NFT
_This feature allows you to buy a given NFT on a given platform through an API request. Only available now for seaport_
Steps:
1. Go to `https://testnets.opensea.io/` and click on an NFT you would "like" to purcahse. The url should look something like thid: `https://testnets.opensea.io/assets/goerli/0xf4910c763ed4e47a585e2d34baa9a4b611ae448c/67022434631017884391824511567400835126939038864993395292924042664566883090433` Note the contractAddress and nftId. In this case that would be `0xf4910c763ed4e47a585e2d34baa9a4b611ae448c` and `67022434631017884391824511567400835126939038864993395292924042664566883090433` respectively.
2. Request a quote to purchase the NFT by sending a GET request to `localhost:8000/api/v1/quote-buy-nft` with the following body:
```
{
    "nftId": "67022434631017884391824511567400835126939038864993395292924042664566883090433",
    "collectionName": "a dog collection",
    "contractAddress": "0xf4910c763ed4e47a585e2d34baa9a4b611ae448c",
    "chain": "goerli",
    "recipientAddress": "0x4cc1756281D7203A172C63E9df9307dABA5523A8",
    "platform": "opensea"
}
```
3. You can then purchase the NFT by send a POST request to `localhost:8000/api/v1/quote-buy-nft` with the same body as above.

### Swap Tokens
_This feature allows you to swap tokens using the 0x api. Right now only avaible on mainnets since devnets to not have enough liquidity_
1. Request a quote by calling a GET request to `localhost:8000/api/v1/quote-swap-tokens` with the following body (Calling this on devnet will request the 0x mainnet endpoint):
```
{
    "sellToken": "ETH",
    "buyToken": "WETH",
    "buyAmount": 100000,
    "chain": "goerli"
}
```
2. You can then swap the tokens by calling a POST request to `localhost:8000/api/v1/swap-tokens` with the same body as above.

### Get Bundle Status
_This endpoint is for getting the status of a bundle after submitting it to the blockchain_
For a full setup: 
1. Start the server with fireblocks as your transaction submission client `yarn run dev -- fireblocks`.
2. Install ngrok here `https://ngrok.com/download`
3. Open another terminal and start ngrok with `ngrok http 8000`
4. Note the ngrok url and in the fireblocks console under settings > Configure Webhook URLS add the ngrok url followed by the fireblocks webhook extension: `https://94b5-174-140-97-44.ngrok.io/api/v1/fireblocks-webhook`
5. Go to `webhook.site` and note the webhook url.
6. In the .env file add the webhook.site url to the `CRYPTO_BACKEND_URL` variable.
7. Now submit any transaction. As the the fireblocks states change you will start to see the webhooks being sent out to your webhook url. You can also make a GET request to `localhost:8000/api/v1/get-bundle-status` with the following body to get the status of the bundle:
```
{
    "bundleId": "0a06d0a4-66da-444f-8f8d-28639856ca83"
}
```

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
