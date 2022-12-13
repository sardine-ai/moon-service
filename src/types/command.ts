import { BuyGenieNFTParams } from "./genie";
import { BuyClubHouseNFTParams } from "./requests/clubhouse";
import { TransferEvmFundsParams } from "./requests/transfer";
import { BuyNftParams } from "./requests/nft";
import { Bundle } from "./models";
import { FireblocksWebhookResponse } from "./fireblocks";
import { GetBundleStatus } from "./requests";

export type CommandParams = TransferEvmFundsParams 
  & BuyClubHouseNFTParams 
  & BuyGenieNFTParams 
  & BuyNftParams
  & FireblocksWebhookResponse
  & GetBundleStatus

export type BuildBundle = (params: CommandParams) => Promise<Bundle>