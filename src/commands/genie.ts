import { FireblocksClient } from "../clients/transactions";
import { GenieClient } from "../clients/genie";
import { BuyGenieNFTParams, GenieCallDataResponse } from "../types/genie";
import { swapUsdcToEth } from "./index";


export const buyGenieNFTUninjected = (
  genieClient: GenieClient,
  fireblocksClient: FireblocksClient
) => async (BuyGenieNFTParams: BuyGenieNFTParams) => {
  const callData: GenieCallDataResponse = await genieClient.getCallData(BuyGenieNFTParams);
  await swapUsdcToEth(callData.valueToSend)
  await fireblocksClient.sendEthTransaction({
    to: callData.to,
    value: callData.valueToSend,
    data: callData.data
  });
}