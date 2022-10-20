import fetch from "node-fetch";
import { PolgyonGasDetails } from "src/types/transfer/polygon";

const POLYGON_NETWORK_TO_GAS_URL: { [name: string]: string } = {
  "MUMBAI": "https://gasstation-mumbai.matic.today/v2",
  "MATIC": "https://gasstation-mainnet.matic.network/v2"
}

export const getPolygonGasDetails = async (chain: string): Promise<PolgyonGasDetails> => {
  const url = POLYGON_NETWORK_TO_GAS_URL[chain];
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json() as Promise<PolgyonGasDetails>
    })
}