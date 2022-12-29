/* eslint-disable */
import _m0 from 'protobufjs/minimal';

export const protobufPackage = 'gen_bq_schema';

/**
 * Message containing options related to BigQuery schema generation
 * and management via Protobuf.
 */
export interface BigQueryFieldOptions {
  /**
   * Flag to specify that a field should be marked as 'REQUIRED' when
   * used to generate schema for BigQuery.
   */
  require: boolean;
  /**
   * Optionally override whatever type is resolved by the schema
   * generator. This is useful, for example, to store epoch timestamps
   * with the underlying 'TIMESTAMP' type, when normally, they would
   * be structured as 'INTEGER' fields.
   */
  typeOverride: string;
  /** Optionally omit a field from BigQuery schema. */
  ignore: boolean;
  /** Set the description for a field in BigQuery schema. */
  description: string;
  /** Customize the name of the field in the BigQuery schema. */
  name: string;
}

function createBaseBigQueryFieldOptions(): BigQueryFieldOptions {
  return {
    require: false,
    typeOverride: '',
    ignore: false,
    description: '',
    name: ''
  };
}

export const BigQueryFieldOptions = {
  encode(
    message: BigQueryFieldOptions,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.require === true) {
      writer.uint32(8).bool(message.require);
    }
    if (message.typeOverride !== '') {
      writer.uint32(18).string(message.typeOverride);
    }
    if (message.ignore === true) {
      writer.uint32(24).bool(message.ignore);
    }
    if (message.description !== '') {
      writer.uint32(34).string(message.description);
    }
    if (message.name !== '') {
      writer.uint32(42).string(message.name);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): BigQueryFieldOptions {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBigQueryFieldOptions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.require = reader.bool();
          break;
        case 2:
          message.typeOverride = reader.string();
          break;
        case 3:
          message.ignore = reader.bool();
          break;
        case 4:
          message.description = reader.string();
          break;
        case 5:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BigQueryFieldOptions {
    return {
      require: isSet(object.require) ? Boolean(object.require) : false,
      typeOverride: isSet(object.typeOverride)
        ? String(object.typeOverride)
        : '',
      ignore: isSet(object.ignore) ? Boolean(object.ignore) : false,
      description: isSet(object.description) ? String(object.description) : '',
      name: isSet(object.name) ? String(object.name) : ''
    };
  },

  toJSON(message: BigQueryFieldOptions): unknown {
    const obj: any = {};
    message.require !== undefined && (obj.require = message.require);
    message.typeOverride !== undefined &&
      (obj.typeOverride = message.typeOverride);
    message.ignore !== undefined && (obj.ignore = message.ignore);
    message.description !== undefined &&
      (obj.description = message.description);
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BigQueryFieldOptions>, I>>(
    object: I
  ): BigQueryFieldOptions {
    const message = createBaseBigQueryFieldOptions();
    message.require = object.require ?? false;
    message.typeOverride = object.typeOverride ?? '';
    message.ignore = object.ignore ?? false;
    message.description = object.description ?? '';
    message.name = object.name ?? '';
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
