import { Expose } from "class-transformer";

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