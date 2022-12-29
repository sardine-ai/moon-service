/* eslint-disable */
import Long from 'long';
import _m0 from 'protobufjs/minimal';

export const protobufPackage = 'structured_logs';

/** Similar to OutboundRequestResponse, but specific to moon service. */
export interface MoonOutboundRequestResponse {
  url: string;
  method: string;
  requestParams: { [key: string]: string };
  clientId: string;
  sessionKey: string;
  requestBody: string;
  responseBody: string;
  statusCode: number;
  timestamp: number;
  latencyMillis: number;
  serviceName: string;
  requestId: string;
}

export interface MoonOutboundRequestResponse_RequestParamsEntry {
  key: string;
  value: string;
}

function createBaseMoonOutboundRequestResponse(): MoonOutboundRequestResponse {
  return {
    url: '',
    method: '',
    requestParams: {},
    clientId: '',
    sessionKey: '',
    requestBody: '',
    responseBody: '',
    statusCode: 0,
    timestamp: 0,
    latencyMillis: 0,
    serviceName: '',
    requestId: ''
  };
}

export const MoonOutboundRequestResponse = {
  encode(
    message: MoonOutboundRequestResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.url !== '') {
      writer.uint32(10).string(message.url);
    }
    if (message.method !== '') {
      writer.uint32(18).string(message.method);
    }
    Object.entries(message.requestParams).forEach(([key, value]) => {
      MoonOutboundRequestResponse_RequestParamsEntry.encode(
        { key: key as any, value },
        writer.uint32(26).fork()
      ).ldelim();
    });
    if (message.clientId !== '') {
      writer.uint32(34).string(message.clientId);
    }
    if (message.sessionKey !== '') {
      writer.uint32(42).string(message.sessionKey);
    }
    if (message.requestBody !== '') {
      writer.uint32(50).string(message.requestBody);
    }
    if (message.responseBody !== '') {
      writer.uint32(58).string(message.responseBody);
    }
    if (message.statusCode !== 0) {
      writer.uint32(64).int64(message.statusCode);
    }
    if (message.timestamp !== 0) {
      writer.uint32(73).double(message.timestamp);
    }
    if (message.latencyMillis !== 0) {
      writer.uint32(80).int64(message.latencyMillis);
    }
    if (message.serviceName !== '') {
      writer.uint32(90).string(message.serviceName);
    }
    if (message.requestId !== '') {
      writer.uint32(98).string(message.requestId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MoonOutboundRequestResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMoonOutboundRequestResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.url = reader.string();
          break;
        case 2:
          message.method = reader.string();
          break;
        case 3:
          const entry3 = MoonOutboundRequestResponse_RequestParamsEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry3.value !== undefined) {
            message.requestParams[entry3.key] = entry3.value;
          }
          break;
        case 4:
          message.clientId = reader.string();
          break;
        case 5:
          message.sessionKey = reader.string();
          break;
        case 6:
          message.requestBody = reader.string();
          break;
        case 7:
          message.responseBody = reader.string();
          break;
        case 8:
          message.statusCode = longToNumber(reader.int64() as Long);
          break;
        case 9:
          message.timestamp = reader.double();
          break;
        case 10:
          message.latencyMillis = longToNumber(reader.int64() as Long);
          break;
        case 11:
          message.serviceName = reader.string();
          break;
        case 12:
          message.requestId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MoonOutboundRequestResponse {
    return {
      url: isSet(object.url) ? String(object.url) : '',
      method: isSet(object.method) ? String(object.method) : '',
      requestParams: isObject(object.requestParams)
        ? Object.entries(object.requestParams).reduce<{
            [key: string]: string;
          }>((acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
          }, {})
        : {},
      clientId: isSet(object.clientId) ? String(object.clientId) : '',
      sessionKey: isSet(object.sessionKey) ? String(object.sessionKey) : '',
      requestBody: isSet(object.requestBody) ? String(object.requestBody) : '',
      responseBody: isSet(object.responseBody)
        ? String(object.responseBody)
        : '',
      statusCode: isSet(object.statusCode) ? Number(object.statusCode) : 0,
      timestamp: isSet(object.timestamp) ? Number(object.timestamp) : 0,
      latencyMillis: isSet(object.latencyMillis)
        ? Number(object.latencyMillis)
        : 0,
      serviceName: isSet(object.serviceName) ? String(object.serviceName) : '',
      requestId: isSet(object.requestId) ? String(object.requestId) : ''
    };
  },

  toJSON(message: MoonOutboundRequestResponse): unknown {
    const obj: any = {};
    message.url !== undefined && (obj.url = message.url);
    message.method !== undefined && (obj.method = message.method);
    obj.requestParams = {};
    if (message.requestParams) {
      Object.entries(message.requestParams).forEach(([k, v]) => {
        obj.requestParams[k] = v;
      });
    }
    message.clientId !== undefined && (obj.clientId = message.clientId);
    message.sessionKey !== undefined && (obj.sessionKey = message.sessionKey);
    message.requestBody !== undefined &&
      (obj.requestBody = message.requestBody);
    message.responseBody !== undefined &&
      (obj.responseBody = message.responseBody);
    message.statusCode !== undefined &&
      (obj.statusCode = Math.round(message.statusCode));
    message.timestamp !== undefined && (obj.timestamp = message.timestamp);
    message.latencyMillis !== undefined &&
      (obj.latencyMillis = Math.round(message.latencyMillis));
    message.serviceName !== undefined &&
      (obj.serviceName = message.serviceName);
    message.requestId !== undefined && (obj.requestId = message.requestId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MoonOutboundRequestResponse>, I>>(
    object: I
  ): MoonOutboundRequestResponse {
    const message = createBaseMoonOutboundRequestResponse();
    message.url = object.url ?? '';
    message.method = object.method ?? '';
    message.requestParams = Object.entries(object.requestParams ?? {}).reduce<{
      [key: string]: string;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    message.clientId = object.clientId ?? '';
    message.sessionKey = object.sessionKey ?? '';
    message.requestBody = object.requestBody ?? '';
    message.responseBody = object.responseBody ?? '';
    message.statusCode = object.statusCode ?? 0;
    message.timestamp = object.timestamp ?? 0;
    message.latencyMillis = object.latencyMillis ?? 0;
    message.serviceName = object.serviceName ?? '';
    message.requestId = object.requestId ?? '';
    return message;
  }
};

function createBaseMoonOutboundRequestResponse_RequestParamsEntry(): MoonOutboundRequestResponse_RequestParamsEntry {
  return { key: '', value: '' };
}

export const MoonOutboundRequestResponse_RequestParamsEntry = {
  encode(
    message: MoonOutboundRequestResponse_RequestParamsEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== '') {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== '') {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MoonOutboundRequestResponse_RequestParamsEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMoonOutboundRequestResponse_RequestParamsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MoonOutboundRequestResponse_RequestParamsEntry {
    return {
      key: isSet(object.key) ? String(object.key) : '',
      value: isSet(object.value) ? String(object.value) : ''
    };
  },

  toJSON(message: MoonOutboundRequestResponse_RequestParamsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<
    I extends Exact<
      DeepPartial<MoonOutboundRequestResponse_RequestParamsEntry>,
      I
    >
  >(object: I): MoonOutboundRequestResponse_RequestParamsEntry {
    const message = createBaseMoonOutboundRequestResponse_RequestParamsEntry();
    message.key = object.key ?? '';
    message.value = object.value ?? '';
    return message;
  }
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  throw 'Unable to locate global object';
})();

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error(
      'Value is larger than Number.MAX_SAFE_INTEGER'
    );
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
