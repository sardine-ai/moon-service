import { swapUsdcToEthUninjected } from "./uniswap";
import { buyClubHouseNFTUninjected } from "./clubhouse";
import { buyGenieNFTUninjected } from "./genie";
import { FireblocksClient } from "../clients/fireblocks";
import config from "../config";
import { GenieClient } from "../clients/genie";

const fireblocksClient: FireblocksClient = new FireblocksClient(config.ethChain, config.polygonChain)
const genieClient: GenieClient = new GenieClient();

export const swapUsdcToEth = swapUsdcToEthUninjected(fireblocksClient);
export const buyClubHouseNFT = buyClubHouseNFTUninjected(fireblocksClient);
export const buyGenieNFT = buyGenieNFTUninjected(genieClient, fireblocksClient);
