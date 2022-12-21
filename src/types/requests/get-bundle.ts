/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseRequest } from './base-request';
import { IsDefined } from 'class-validator';
import { Expose } from 'class-transformer';

export class GetBundleStatus extends BaseRequest {
  @IsDefined()
  @Expose()
  bundleId: string;
}
