import { BuyGenieNFTParams } from "./genie";
import { BuyClubHouseNFTParams } from "./clubhouse";
import { TransferEvmFundsParams } from "./transfer";

export type CommandParams = TransferEvmFundsParams & BuyClubHouseNFTParams & BuyGenieNFTParams