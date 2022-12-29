/* eslint-disable */
import _m0 from 'protobufjs/minimal';

export const protobufPackage = 'gen_bq_schema';

export interface BigQueryMessageOptions {
  /**
   * Specifies a name of table in BigQuery for the message.
   *
   * If not blank, indicates the message is a type of record to be stored into BigQuery.
   */
  tableName: string;
  /**
   * If true, BigQuery field names will default to a field's JSON name,
   * not its original/proto field name.
   */
  useJsonNames: boolean;
}

function createBaseBigQueryMessageOptions(): BigQueryMessageOptions {
  return { tableName: '', useJsonNames: false };
}

export const BigQueryMessageOptions = {
  encode(
    message: BigQueryMessageOptions,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.tableName !== '') {
      writer.uint32(10).string(message.tableName);
    }
    if (message.useJsonNames === true) {
      writer.uint32(16).bool(message.useJsonNames);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): BigQueryMessageOptions {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBigQueryMessageOptions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tableName = reader.string();
          break;
        case 2:
          message.useJsonNames = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BigQueryMessageOptions {
    return {
      tableName: isSet(object.tableName) ? String(object.tableName) : '',
      useJsonNames: isSet(object.useJsonNames)
        ? Boolean(object.useJsonNames)
        : false
    };
  },

  toJSON(message: BigQueryMessageOptions): unknown {
    const obj: any = {};
    message.tableName !== undefined && (obj.tableName = message.tableName);
    message.useJsonNames !== undefined &&
      (obj.useJsonNames = message.useJsonNames);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BigQueryMessageOptions>, I>>(
    object: I
  ): BigQueryMessageOptions {
    const message = createBaseBigQueryMessageOptions();
    message.tableName = object.tableName ?? '';
    message.useJsonNames = object.useJsonNames ?? false;
    return message;
  }
};

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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
