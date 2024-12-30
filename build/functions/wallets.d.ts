/** @import { BetterRelysiaSDK } from '../object' */
/** @import { BalanceOpts, CreateWalletOpt, HistoryOpts, RelysiaBalance, RelysiaBasic, RelysiaCreateWallet, RelysiaGetAddress, RelysiaGetAllAddress, RelysiaHistory, RelysiaLeaderboard, RelysiaMnemonic, RelysiaWallets } from '../types' */
import { BetterRelysiaSDK } from "../object";
import { BalanceOpts, CreateWalletOpt, HistoryOpts, RelysiaBalance, RelysiaGetAddress, RelysiaGetAllAddress, RelysiaHistory, RelysiaLeaderboard, RelysiaMnemonic, RelysiaWallets } from "../types";
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} walletTitle
 * @param {CreateWalletOpt} [opt]
 * @returns {Promise<any>}
 */
export declare function createWallet(this: BetterRelysiaSDK, walletTitle: string, opt?: CreateWalletOpt): Promise<any>;
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} [walletId]
 * @returns {Promise<RelysiaGetAddress>}
 */
export declare function getAddress(this: BetterRelysiaSDK, walletId?: string): Promise<RelysiaGetAddress>;
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} [walletId]
 * @returns {Promise<RelysiaGetAllAddress>}
 */
export declare function getAllAddressess(this: BetterRelysiaSDK, walletId?: string): Promise<RelysiaGetAllAddress>;
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} tokenId
 * @param {number} [nextPageToken]
 * @returns {Promise<RelysiaLeaderboard>}
 */
export declare function leaderboard(this: BetterRelysiaSDK, tokenId: string, nextPageToken?: number): Promise<RelysiaLeaderboard>;
/**
 * @param {BetterRelysiaSDK} this
 * @returns {Promise<RelysiaWallets>}
 */
export declare function wallets(this: BetterRelysiaSDK): Promise<RelysiaWallets>;
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} [walletId]
 * @returns {Promise<RelysiaMnemonic>}
 */
export declare function mnemonic(this: BetterRelysiaSDK, walletId?: string): Promise<RelysiaMnemonic>;
/**
 * @param {BetterRelysiaSDK} this
 * @param {BalanceOpts} [opts]
 * @returns {Promise<RelysiaBalance>}
 */
export declare function balance(this: BetterRelysiaSDK, opts?: BalanceOpts): Promise<RelysiaBalance>;
/**
 * @param {BetterRelysiaSDK} this
 * @param {HistoryOpts} [opts]
 * @returns {Promise<RelysiaHistory>}
 */
export declare function history(this: BetterRelysiaSDK, opts?: HistoryOpts): Promise<RelysiaHistory>;
