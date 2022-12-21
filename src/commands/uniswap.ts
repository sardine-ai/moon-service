import { abi as uniswapRouterV2ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json';
import {
  Router,
  TradeOptions,
  WETH,
  CurrencyAmount,
  ETHER,
  Fetcher,
  Trade,
  Route,
  Percent,
  TradeType,
  SwapParameters,
  Pair
} from '@uniswap/sdk';
import { parseEther } from 'ethers/lib/utils';
import { ethers } from 'ethers';
import { ITransactionSubmissionClient } from '../clients/transactions';
import { CryptoConfig } from '../config/crypto-config';
import { getAssetContractDetails } from '../utils/crypto-utils';
import winston from 'winston';

const UNISWAP_ROUTER_V2_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

const swap = async (
  amount: string,
  pair: Pair,
  transactionSubmissionClient: ITransactionSubmissionClient,
  cryptoConfig: CryptoConfig
) => {
  const route = new Route([pair], ETHER);
  const amountIn = parseEther(amount).toString();
  const trade = new Trade(
    route,
    CurrencyAmount.ether(amountIn),
    TradeType.EXACT_INPUT
  );

  const recipient = await transactionSubmissionClient.getFromAddress(
    cryptoConfig.ethChain,
    'ETH'
  );
  const tradeOptions: TradeOptions = {
    allowedSlippage: new Percent('50', '10000'),
    ttl: 3000,
    recipient
  };

  const swapParams: SwapParameters = Router.swapCallParameters(
    trade,
    tradeOptions
  );
  const provider = ethers.getDefaultProvider(cryptoConfig.ethChain);
  const router = new ethers.Contract(
    UNISWAP_ROUTER_V2_ADDRESS,
    uniswapRouterV2ABI,
    provider
  );
  const swapTx = await router.populateTransaction[swapParams.methodName](
    ...swapParams.args,
    { value: swapParams.value }
  );
  console.log(swapTx);
  // return await transactionSubmissionClient.sendTransaction({
  //     to: swapTx.to,
  //     gas: swapTx.gasLimit?.toString(),
  //     value: swapTx.value?.toString(),
  //     data: swapTx.data,
  //     chain: cryptoConfig.ethChain,
  //     assetSymbol: pair.token0.symbol || ""
  // })
};

export const swapUsdcToEthUninjected =
  (
    _logger: winston.Logger,
    cryptoConfig: CryptoConfig,
    fireblocksClient: ITransactionSubmissionClient
  ) =>
  async (amount: string) => {
    const assetContractDetails = getAssetContractDetails(
      cryptoConfig.ethChain,
      'USDC'
    );
    const usdc = await Fetcher.fetchTokenData(
      cryptoConfig.ethChainId,
      assetContractDetails.assetContractAddress
    );
    const weth = WETH[cryptoConfig.ethChainId as keyof typeof WETH];
    const pair = await Fetcher.fetchPairData(usdc, weth);
    return swap(amount, pair, fireblocksClient, cryptoConfig);
  };
