import { ITransactionSubmissionClient } from "../clients/transactions";
import { GenieClient } from "../clients/genie";
import { BuyGenieNFTParams, GenieCallDataResponse } from "../types/genie/index";
import { swapUsdcToEth } from "./index";
import { CryptoConfig } from "../config/crypto-config";
import winston from "winston";

export const buyGenieNFTUninjected = (
  _logger: winston.Logger,
  genieClient: GenieClient,
  _transactionSubmissionClient: ITransactionSubmissionClient,
  _cryptoConfig: CryptoConfig
) => async (BuyGenieNFTParams: BuyGenieNFTParams) => {
  const callData: GenieCallDataResponse = await genieClient.getCallData(BuyGenieNFTParams);
  await swapUsdcToEth(callData.valueToSend)
  // await transactionSubmissionClient.sendTransaction({
  //   to: callData.to,
  //   value: callData.valueToSend,
  //   callData: callData.data,
  //   chain: cryptoConfig.ethChain,
  //   assetSymbol: "ETH"
  // });
}