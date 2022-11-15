import { Bundle } from "../types/models";
import { ExecuteBundle } from "../clients/transactions/helpers";
import { StoreBundle } from "../repositories/base-repository";
import { CommandParams } from "../types/command";
import { Logger } from "winston";

export const commandUninjected = (
  logger: Logger,
  buildBundle: (params: CommandParams) => Bundle,
  storeBundle: StoreBundle,
  executeBundle: ExecuteBundle,
) => async (params: CommandParams) => {
  logger.info(`Processing Order: ${JSON.stringify(params)}`)
  const bundle = buildBundle(params);
  await storeBundle(bundle);
  return await executeBundle(bundle);
}