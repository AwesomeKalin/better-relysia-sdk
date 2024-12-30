/** @import { BetterRelysiaSDK } from '../object' */
/** @import { RedeemOpts, RelysiaRedeem, RelysiaBasic } from '../types' */
import { BetterRelysiaSDK } from "../object";
import { RedeemOpts, RelysiaRedeem } from "../types";
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} tokenId
 * @param {number} amount
 * @param {RedeemOpts} [opts]
 * @returns {Promise<RelysiaRedeem>}
 */
export declare function redeemToken(this: BetterRelysiaSDK, tokenId: string, amount: number, opts?: RedeemOpts): Promise<RelysiaRedeem>;
