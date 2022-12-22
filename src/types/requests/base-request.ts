import { Expose } from 'class-transformer';
import { CommandParams } from '../command';

export class BaseRequest {
  @Expose()
  clientId?: string;

  @Expose()
  customerId?: string;

  @Expose()
  sessionKey?: string;

  @Expose()
  requestId?: string;

  @Expose()
  timestamp?: number;
}

export const getBaseRequest = (commandParams: CommandParams): BaseRequest => {
  return {
    clientId: commandParams.clientId,
    customerId: commandParams.customerId,
    sessionKey: commandParams.sessionKey,
    requestId: commandParams.requestId,
    timestamp: commandParams.timestamp
  }
}
