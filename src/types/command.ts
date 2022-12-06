import { BuyGenieNFTParams } from "./genie";
import { BuyClubHouseNFTParams } from "./clubhouse";
import { TransferEvmFundsParams } from "./transfer";
import { BuyNftParams } from "./nft";
import { Bundle } from "../types/models";
import { FireblocksWebhookResponse } from "../types/fireblocks";

export type CommandParams = TransferEvmFundsParams 
  & BuyClubHouseNFTParams 
  & BuyGenieNFTParams 
  & BuyNftParams
  & FireblocksWebhookResponse

export type BuildBundle = (params: CommandParams) => Promise<Bundle>