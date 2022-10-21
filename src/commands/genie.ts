import { ITransactionSubmissionClient } from "../clients/transactions";
import { GenieClient } from "../clients/genie";
import { BuyGenieNFTParams, GenieCallDataResponse } from "../types/genie";
import { swapUsdcToEth } from "./index";


export const buyGenieNFTUninjected = (
  genieClient: GenieClient,
  transactionSubmissionClient: ITransactionSubmissionClient
) => async (BuyGenieNFTParams: BuyGenieNFTParams) => {
  const callData: GenieCallDataResponse = await genieClient.getCallData(BuyGenieNFTParams);
  await swapUsdcToEth(callData.valueToSend)
  await transactionSubmissionClient.sendEthTransaction({
    to: callData.to,
    value: callData.valueToSend,
    data: callData.data
  });
}