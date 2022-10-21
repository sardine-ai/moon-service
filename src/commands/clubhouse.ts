import { BuyClubHouseNFTParams } from "../types/clubHouse";
import { ITransactionSubmissionClient } from "../clients/transactions";
import Logger from "../loaders/logger";

export const buyClubHouseNFTUninjected = (
  _transactionSubmissionClient: ITransactionSubmissionClient,
) => async (_buyClubHouseNFTParams: BuyClubHouseNFTParams) => {
  Logger.info("hello world");
}