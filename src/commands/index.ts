import { swapUsdcToEthUninjected } from "./uniswap";
import { buyClubHouseNFTUninjected } from "./clubhouse";
import { buyGenieNFTUninjected } from "./genie";
import { FireblocksClient } from "../clients/fireblocks";
import { GenieClient } from "../clients/genie";
import getCryptoConfig from "../config/cryptoConfig";
import getFireblocksConfig from "../config/fireblocksConfig";

const cryptoConfig = getCryptoConfig();
const fireblocksConfig = getFireblocksConfig();

const fireblocksClient: FireblocksClient = new FireblocksClient(cryptoConfig.ethChain, cryptoConfig.polygonChain, fireblocksConfig)
const genieClient: GenieClient = new GenieClient();

export const swapUsdcToEth = swapUsdcToEthUninjected(cryptoConfig, fireblocksClient);
export const buyClubHouseNFT = buyClubHouseNFTUninjected(fireblocksClient);
export const buyGenieNFT = buyGenieNFTUninjected(genieClient, fireblocksClient);
