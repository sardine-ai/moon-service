import { BuyClubHouseNFTParams } from "../types/clubHouse";
import { ITransactionSubmissionClient } from "../clients/transactions";
import winston from "winston";

export const buyClubHouseNFTUninjected = (
  logger: winston.Logger,
  _transactionSubmissionClient: ITransactionSubmissionClient,
) => async (_buyClubHouseNFTParams: BuyClubHouseNFTParams) => {
  logger.info("hello world");
}