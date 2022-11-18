import { BuyGenieNFTParams } from "./genie";
import { BuyClubHouseNFTParams } from "./clubhouse";
import { TransferEvmFundsParams } from "./transfer";
import { BuyNftParams } from "./nft";

export type CommandParams = TransferEvmFundsParams 
  & BuyClubHouseNFTParams 
  & BuyGenieNFTParams 
  & BuyNftParams