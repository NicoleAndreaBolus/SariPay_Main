import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CDGSVPLPTEBDA4YNNZNI4FGCHZR6R4YLBASPJUWEXX4EFAKPMETKO5MM",
  }
} as const

export type DataKey = {tag: "Order", values: readonly [u64]};

export enum OrderStatus {
  Initialized = 0,
  Funded = 1,
  Delivered = 2,
  Canceled = 3,
}


export interface SupplyOrder {
  amount: i128;
  distributor: string;
  merchant: string;
  status: OrderStatus;
  token: string;
}

export interface Client {
  /**
   * Construct and simulate a get_order transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Read order details from contract storage
   */
  get_order: ({order_id}: {order_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<Option<SupplyOrder>>>

  /**
   * Construct and simulate a fund_order transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Deposits and locks the stablecoin payment amount from merchant into the contract escrow escrow
   */
  fund_order: ({order_id}: {order_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a init_order transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initializes a brand new B2B supply purchase order registry entry
   */
  init_order: ({order_id, merchant, distributor, token, amount}: {order_id: u64, merchant: string, distributor: string, token: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a cancel_order transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Allows the distributor to programmatically reject or cancel an unfulfilled order
   */
  cancel_order: ({order_id}: {order_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a confirm_delivery transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Merchant verifies receipt of goods, executing the payout from escrow to the distributor account
   */
  confirm_delivery: ({order_id}: {order_id: u64}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAQAAAAEAAAAAAAAABU9yZGVyAAAAAAAAAQAAAAY=",
        "AAAAAwAAAAAAAAAAAAAAC09yZGVyU3RhdHVzAAAAAAQAAAAAAAAAC0luaXRpYWxpemVkAAAAAAAAAAAAAAAABkZ1bmRlZAAAAAAAAQAAAAAAAAAJRGVsaXZlcmVkAAAAAAAAAgAAAAAAAAAIQ2FuY2VsZWQAAAAD",
        "AAAAAQAAAAAAAAAAAAAAC1N1cHBseU9yZGVyAAAAAAUAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAALZGlzdHJpYnV0b3IAAAAAEwAAAAAAAAAIbWVyY2hhbnQAAAATAAAAAAAAAAZzdGF0dXMAAAAAB9AAAAALT3JkZXJTdGF0dXMAAAAAAAAAAAV0b2tlbgAAAAAAABM=",
        "AAAAAAAAAChSZWFkIG9yZGVyIGRldGFpbHMgZnJvbSBjb250cmFjdCBzdG9yYWdlAAAACWdldF9vcmRlcgAAAAAAAAEAAAAAAAAACG9yZGVyX2lkAAAABgAAAAEAAAPoAAAH0AAAAAtTdXBwbHlPcmRlcgA=",
        "AAAAAAAAAF5EZXBvc2l0cyBhbmQgbG9ja3MgdGhlIHN0YWJsZWNvaW4gcGF5bWVudCBhbW91bnQgZnJvbSBtZXJjaGFudCBpbnRvIHRoZSBjb250cmFjdCBlc2Nyb3cgZXNjcm93AAAAAAAKZnVuZF9vcmRlcgAAAAAAAQAAAAAAAAAIb3JkZXJfaWQAAAAGAAAAAA==",
        "AAAAAAAAAEBJbml0aWFsaXplcyBhIGJyYW5kIG5ldyBCMkIgc3VwcGx5IHB1cmNoYXNlIG9yZGVyIHJlZ2lzdHJ5IGVudHJ5AAAACmluaXRfb3JkZXIAAAAAAAUAAAAAAAAACG9yZGVyX2lkAAAABgAAAAAAAAAIbWVyY2hhbnQAAAATAAAAAAAAAAtkaXN0cmlidXRvcgAAAAATAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAA=",
        "AAAAAAAAAFBBbGxvd3MgdGhlIGRpc3RyaWJ1dG9yIHRvIHByb2dyYW1tYXRpY2FsbHkgcmVqZWN0IG9yIGNhbmNlbCBhbiB1bmZ1bGZpbGxlZCBvcmRlcgAAAAxjYW5jZWxfb3JkZXIAAAABAAAAAAAAAAhvcmRlcl9pZAAAAAYAAAAA",
        "AAAAAAAAAF9NZXJjaGFudCB2ZXJpZmllcyByZWNlaXB0IG9mIGdvb2RzLCBleGVjdXRpbmcgdGhlIHBheW91dCBmcm9tIGVzY3JvdyB0byB0aGUgZGlzdHJpYnV0b3IgYWNjb3VudAAAAAAQY29uZmlybV9kZWxpdmVyeQAAAAEAAAAAAAAACG9yZGVyX2lkAAAABgAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_order: this.txFromJSON<Option<SupplyOrder>>,
        fund_order: this.txFromJSON<null>,
        init_order: this.txFromJSON<null>,
        cancel_order: this.txFromJSON<null>,
        confirm_delivery: this.txFromJSON<null>
  }
}