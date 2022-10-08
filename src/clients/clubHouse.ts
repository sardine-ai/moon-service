import { BuyClubHouseNFTParams } from "../types/clubHouse";

export interface IClubhouseClient {
  getCallData(buyClubhouseNFTParams: BuyClubHouseNFTParams): void
}

export class ClubhouseClient implements IClubhouseClient {
  async getCallData(_buyClubhouseNFTParams: BuyClubHouseNFTParams): Promise<void> {
    console.log("hello world");
  }
}