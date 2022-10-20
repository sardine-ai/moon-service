import { abi as uniswapRouterV2ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json';
import { Router, TradeOptions, WETH, CurrencyAmount, ETHER, Fetcher, Trade, Route, Percent, TradeType, SwapParameters, Pair } from "@uniswap/sdk";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "ethers";
import { FireblocksClient } from "../clients/transactions";
import { CryptoConfig } from '../config/cryptoConfig';

const UNISWAP_ROUTER_V2_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

const swap = async (amount: string, pair: Pair, fireblocksClient: FireblocksClient, cryptoConfig: CryptoConfig) => {
  const route = new Route([pair], ETHER)
  const amountIn = parseEther(amount).toString();
  const trade = new Trade(route, CurrencyAmount.ether(amountIn), TradeType.EXACT_INPUT);

  const recipient = await fireblocksClient.getFromAddress(cryptoConfig.ethAssetId);
  const tradeOptions: TradeOptions = {
      allowedSlippage: new Percent('50', '10000'),
      ttl: 3000,
      recipient
  };

  const swapParams: SwapParameters = Router.swapCallParameters(trade, tradeOptions);
  const provider = ethers.getDefaultProvider(cryptoConfig.ethChain);
  const router = new ethers.Contract(UNISWAP_ROUTER_V2_ADDRESS, uniswapRouterV2ABI, provider);
  const swapTx = await router.populateTransaction[swapParams.methodName](...swapParams.args, { value: swapParams.value });

  return await fireblocksClient.sendEthTransaction(
    {
      to: swapTx.to,
      nonce: swapTx.nonce,
      gas: swapTx.gasLimit,
      gasPrice: swapTx.gasPrice, 
      value: swapTx.value,
      data: swapTx.data,
    }
  )
}

export const swapUsdcToEthUninjected = (
  cryptoConfig: CryptoConfig,
  fireblocksClient: FireblocksClient
) => async (amount: string) => {
  const usdc = await Fetcher.fetchTokenData(cryptoConfig.ethChainId, cryptoConfig.ethUsdcAddress);
  const weth = WETH[cryptoConfig.ethChainId as keyof typeof WETH];  
  const pair = await Fetcher.fetchPairData(usdc, weth);
  return swap(amount, pair, fireblocksClient, cryptoConfig);
}