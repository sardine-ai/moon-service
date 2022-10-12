import { FireblocksClient } from "../clients/fireblocks";
import { GenieClient } from "../clients/genie";
import { BuyGenieNFTParams, GenieCallDataResponse } from "../types/genie";
import { swapUsdcToEth } from "./index";
import config from "../config";

export const buyGenieNFTUninjected = (
  genieClient: GenieClient,
  fireblocksClient: FireblocksClient
) => async (BuyGenieNFTParams: BuyGenieNFTParams) => {
  const callData: GenieCallDataResponse = await genieClient.getCallData(BuyGenieNFTParams);
  await swapUsdcToEth(callData.valueToSend)
  await fireblocksClient.sendEthTransaction(
    config.vaultAccountId,
    {
      to: callData.to,
      amountEth: callData.valueToSend,
      data: callData.data
    }
  )
}