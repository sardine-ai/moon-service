import axios from 'axios';
import { PolgyonGasDetails } from "src/types/transfer/polygon";

const POLYGON_NETWORK_TO_GAS_URL: { [name: string]: string } = {
  "MUMBAI": "https://gasstation-mumbai.matic.today/v2",
  "MATIC": "https://gasstation-mainnet.matic.network/v2"
}

export const getPolygonGasDetails = async (chain: string): Promise<PolgyonGasDetails> => {
  const url = POLYGON_NETWORK_TO_GAS_URL[chain];
  const result = await axios(url);
  return result.data;

}