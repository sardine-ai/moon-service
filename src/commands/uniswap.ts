import { abi as uniswapRouterV2ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json';
import { Router, TradeOptions, WETH, CurrencyAmount, ETHER, Fetcher, Trade, Route, Percent, TradeType, SwapParameters, Pair } from "@uniswap/sdk";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "ethers";
import { FireblocksClient } from "../clients/fireblocks";
import config from "../config";

const UNISWAP_ROUTER_V2_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

const swap = async (amount: string, pair: Pair, fireblocksClient: FireblocksClient) => {
  const route = new Route([pair], ETHER)
  const amountIn = parseEther(amount).toString();
  const trade = new Trade(route, CurrencyAmount.ether(amountIn), TradeType.EXACT_INPUT);

  const recipient = await fireblocksClient.getVaultAddress(config.vaultAccountId, config.ethAssetId);
  const tradeOptions: TradeOptions = {
      allowedSlippage: new Percent('50', '10000'),
      ttl: 3000,
      recipient
  };

  const swapParams: SwapParameters = Router.swapCallParameters(trade, tradeOptions);
  const provider = ethers.getDefaultProvider(config.ethChain);
  const router = new ethers.Contract(UNISWAP_ROUTER_V2_ADDRESS, uniswapRouterV2ABI, provider);
  const swapTx = await router.populateTransaction[swapParams.methodName](...swapParams.args, { value: swapParams.value });

  return await fireblocksClient.sendEthTransaction(
    config.vaultAccountId,
    {
      to: swapTx.to,
      nonce: swapTx.nonce,
      gasLimit: swapTx.gasLimit,
      gasPrice: swapTx.gasPrice, 
      amountEth: swapTx.value,
      data: swapTx.data,
    }
  )
}

export const swapUsdcToEthUninjected = (
  fireblocksClient: FireblocksClient
) => async (amount: string) => {
  const usdc = await Fetcher.fetchTokenData(config.ethChainId, config.ethUsdcAddress);
  const weth = WETH[config.ethChainId as keyof typeof WETH];  
  const pair = await Fetcher.fetchPairData(usdc, weth);
  return swap(amount, pair, fireblocksClient);
}