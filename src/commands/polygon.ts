import Web3, { POSClient, use } from "@maticnetwork/maticjs"
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers'
import { providers, Wallet, Contract } from "ethers";
const { ethers, BigNumber } = require('ethers')
const JSBI = require('jsbi')

const { AlphaRouter } = require('@uniswap/smart-order-router')
const { Token, CurrencyAmount, TradeType, Percent } = require('@uniswap/sdk-core')

require('dotenv').config();

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")

console.log(process.env.ROOT_RPC);
const web3 = createAlchemyWeb3(process.env.ROOT_RPC)
const web3Mumbai = createAlchemyWeb3(process.env.MATIC_RPC)
const web3MumbaiProvider = new ethers.providers.JsonRpcProvider(process.env.MATIC_RPC)

// install ethers plugin
use(Web3ClientPlugin)

const rootChainManagerProxyABI = require("./abi/RootChainManagerProxyABI.json");
const rootChainManagerProxyAddress = "0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74";

const rootChainManagerABI = require("./abi/RootChainManagerABI.json");
const rootChainManagerAddress = "0xe45d449909905f82a5e0b0F2afA5953C2E3583Fd";

const rootChainManager = new web3.eth.Contract(rootChainManagerABI, rootChainManagerAddress);

const wethProxyAddressMumbai = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";
const wethAddressMumbai = "0x195fe6EE6639665CCeB15BCCeB9980FC445DFa0B";
const wethMubaiABI = require("./abi/WETHMumbaiABI.json");

const ERC20ABI = require('./abi/ERC20ABI.json')
const uniswapAddress = "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45";
const wethContract = new web3Mumbai.eth.Contract(wethMubaiABI, wethAddressMumbai);

const chainId = 80001
const router = new AlphaRouter({ chainId: chainId, provider: web3MumbaiProvider })

const name0 = 'Wrapped Ether'
const symbol0 = 'WETH'
const decimals0 = 18
const address0 = '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa'

const name1 = 'Wrapped Matic'
const symbol1 = 'WMATIC'
const decimals1 = 18
const address1 = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'

const WETH = new Token(chainId, address0, decimals0, symbol0, name0)
const WMATIC = new Token(chainId, address1, decimals1, symbol1, name1)

export const getWethContract = () => new ethers.Contract(address0, ERC20ABI, web3Mumbai)
export const getUniContract = () => new ethers.Contract(address1, ERC20ABI, web3Mumbai)

export const getPrice = async (inputAmount, slippageAmount, deadline, walletAddress) => {
  const percentSlippage = new Percent(slippageAmount, 100)
  const wei = ethers.utils.parseUnits(inputAmount.toString(), decimals0)
  const currencyAmount = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(wei))

  const route = await router.route(
    currencyAmount,
    WMATIC,
    TradeType.EXACT_INPUT,
    {
      recipient: walletAddress,
      slippageTolerance: percentSlippage,
      deadline: deadline,
    }
  )

  const transaction = {
    data: route.methodParameters.calldata,
    to: uniswapAddress,
    value: BigNumber.from(route.methodParameters.value),
    from: walletAddress,
    gasPrice: BigNumber.from(route.gasPriceWei),
    gasLimit: ethers.utils.hexlify(1000000)
  }

  const quoteAmountOut = route.quote.toFixed(6)
  const ratio = (inputAmount / quoteAmountOut).toFixed(3)

  return [
    transaction,
    quoteAmountOut,
    ratio
  ]
}

export const runSwap = async (transaction, signer) => {
  const approvalAmount = ethers.utils.parseUnits('10', 18).toString()
  const contract0 = getWethContract()
  await contract0.connect(signer).approve(
    uniswapAddress,
    approvalAmount
  )

  signer.sendTransaction(transaction)
}

const swapEthToWETH = async () => {
  console.log("Public Key: ", process.env.SARDINE_PUBLIC);

  const data = await rootChainManager.depositEtherFor(process.env.SARDINE_PUBLIC);
  console.log(data);

  var nonce = await web3.eth.getTransactionCount(process.env.SARDINE_PUBLIC, 'latest'); //get latest nonce
  //the transaction
  let tx = {
      'from': process.env.SARDINE_PUBLIC,
      'to': rootChainManagerProxyAddress,
      'value': '1000000000000000',
      'nonce': nonce,
      'gas': 500000,
      'data': data.data
  };

  let signPromise = web3.eth.accounts.signTransaction(tx, process.env.SARDINE_PRIVATE)
  signPromise
  .then((signedTx) => {
      web3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
          function (err, hash) {
              if (!err) {
                  console.log(
                  "The hash of the transaction is: ",
                  hash,
                  "\nCheck Alchemy's Mempool to view the status of your transaction!"
                  )
              } else {
                  console.log(
                  "Something went wrong when submitting your transaction:",
                  err
                  )
              }
          }
      )
      .then(result => {
        console.log(result)
      })
  })
  .catch((err) => {
      console.log(" Promise failed:", err)
  })
}

const swapWETHtoPolygon = async () => {
  const approvalAmount = ethers.utils.parseUnits('10', 18).toString()
  const contract0 = getWethContract()
  await contract0.connect(signer).approve(
    V3_SWAP_ROUTER_ADDRESS,
    approvalAmount
  )

  const swap = await getPrice(
    '1000000000000000',
    2,
    Math.floor(Date.now()/1000 + (10 * 60)),
    process.env.SARDINE_PUBLIC
  )

  console.log(swap);

  let signPromise = web3Mumbai.eth.accounts.signTransaction(swap[0], process.env.SARDINE_PRIVATE)
  signPromise
  .then((signedTx) => {
      web3Mumbai.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
            if (!err) {
                console.log(
                "The hash of the mint is: ",
                hash,
                "\nCheck Alchemy's Mempool to view the status of your transaction!"
                )
            } else {
                console.log(
                "Something went wrong when submitting your transaction:",
                err
                )
            }
        }
      )
      .then(result => {
        console.log(result)
      })
  })
  .catch((err) => {
      console.log(" Promise failed:", err)
  })
}

// const getPOSClient = async (network = 'testnet', version = 'mumbai') => {
//   let posClient = new POSClient();
//   await posClient.init({
//     network: network,
//     version: version,
//     parent: {
//       provider: new Wallet(process.env.SARDINE_PRIVATE, parentProvider),
//       defaultConfig: {
//         from : process.env.SARDINE_PUBLIC
//       }
//     },
//     child: {
//       provider: new Wallet(process.env.SARDINE_PRIVATE, childProvider),
//       defaultConfig: {
//         from : process.env.SARDINE_PUBLIC
//       }
//     }
//   });

//   return posClient;
// }

swapWETHtoPolygon()
.then();