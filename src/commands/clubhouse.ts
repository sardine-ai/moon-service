import { BuyClubHouseNFTParams } from "../types/clubHouse";
import { FireblocksClient } from "../clients/transactions";
import Logger from "../loaders/logger";

export const buyClubHouseNFTUninjected = (
  _fireblocksClient: FireblocksClient,
) => async (_buyClubHouseNFTParams: BuyClubHouseNFTParams) => {
  Logger.info("hello world");
}