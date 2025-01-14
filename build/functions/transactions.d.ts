/** @import { BetterRelysiaSDK } from '../object' */
/** @import { RelysiaSweep, RelysiaBasic, RawTxOpts, RelysiaRawTx, RelysiaAsm, AtomicSwapOfferOpts, RelysiaAtomicSwapOffer, AtomicSwapAcceptOpts, RelysiaAtomicSwapAccept, RelysiaAtomicSwapInspect } from '../types' */
import { BetterRelysiaSDK } from "../object";
import { RelysiaSweep, RawTxOpts, RelysiaRawTx, RelysiaAsm, AtomicSwapOfferOpts, RelysiaAtomicSwapOffer, AtomicSwapAcceptOpts, RelysiaAtomicSwapAccept } from "../types";
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} privateKey
 * @param {string} [walletID]
 * @returns {Promise<RelysiaSweep>}
 */
export declare function sweep(this: BetterRelysiaSDK, privateKey: string, walletID?: string): Promise<RelysiaSweep>;
/**
 * @param {BetterRelysiaSDK} this
 * @param {RawTxOpts} opts
 * @returns {Promise<RelysiaRawTx>}
 */
export declare function rawTx(this: BetterRelysiaSDK, opts: RawTxOpts): Promise<RelysiaRawTx>;
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} asm
 * @param {number} amount
 * @param {string} [walletID]
 * @returns {Promise<RelysiaAsm>}
 */
export declare function asm(this: BetterRelysiaSDK, asm: string, amount: number, walletID?: string): Promise<RelysiaAsm>;
/**
 * @param {BetterRelysiaSDK} this
 * @param {AtomicSwapOfferOpts[]} opts
 * @param {string} walletId
 * @returns {Promise<RelysiaAtomicSwapOffer>}
 */
export declare function atomicSwapOffer(this: BetterRelysiaSDK, opts: AtomicSwapOfferOpts[], walletId: string): Promise<RelysiaAtomicSwapOffer>;
/**
 * @param {BetterRelysiaSDK} this
 * @param {AtomicSwapAcceptOpts} opts
 * @param {string} [walletId]
 * @returns {Promise<RelysiaAtomicSwapAccept>}
 */
export declare function atomicSwapAccept(this: BetterRelysiaSDK, opts: AtomicSwapAcceptOpts, walletId?: string): Promise<RelysiaAtomicSwapAccept>;
/**
 * @param {BetterRelysiaSDK} this
 * @param {AtomicSwapAcceptOpts} opts
 * @param {string} [walletId]
 * @returns {Promise<any>}
 */
export declare function inspectAtomicSwap(this: BetterRelysiaSDK, opts: AtomicSwapAcceptOpts, walletId?: string): Promise<any>;
