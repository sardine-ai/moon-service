import { ITransactionSubmissionClient } from "../clients/transactions";
import { GenieClient } from "../clients/genie";
import { BuyGenieNFTParams, GenieCallDataResponse } from "../types/genie/index";
import { swapUsdcToEth } from "./index";
import { CryptoConfig } from "../config/crypto-config";
import winston from "winston";

export const buyGenieNFTUninjected = (
  _logger: winston.Logger,
  genieClient: GenieClient,
  transactionSubmissionClient: ITransactionSubmissionClient,
  cryptoConfig: CryptoConfig
) => async (BuyGenieNFTParams: BuyGenieNFTParams) => {
  const callData: GenieCallDataResponse = await genieClient.getCallData(BuyGenieNFTParams);
  await swapUsdcToEth(callData.valueToSend)
  await transactionSubmissionClient.sendEthTransaction({
    to: callData.to,
    value: callData.valueToSend,
    data: callData.data,
    chain: cryptoConfig.ethChain,
    assetSymbol: "NATIVE"
  });
}