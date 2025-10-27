/** @import { RelysiaAuth, RelysiaUserProfileData, RelysiaBasic, CreateWalletOpt, RelysiaCreateWallet, RelysiaGetAddress, RelysiaGetAllAddress, RelysiaLeaderboard, RelysiaWallets, RelysiaMnemonic, BalanceOpts, RelysiaBalance, HistoryOpts, RelysiaHistory, RelysiaSweep, RawTxOpts, RelysiaRawTx, RelysiaAsm, RedeemOpts, RelysiaRedeem, AtomicSwapOfferOpts, RelysiaAtomicSwapOffer, AtomicSwapAcceptOpts, RelysiaAtomicSwapAccept, RelysiaAtomicSwapInspect, AtomicSwapWithIDOpts, RelysiaAtomicSwapWithID } from './types' */
import { RelysiaUserProfileData, RelysiaGetAddress, RelysiaGetAllAddress, RelysiaLeaderboard, RelysiaWallets, RelysiaMnemonic, BalanceOpts, RelysiaBalance, HistoryOpts, RelysiaHistory, RelysiaSweep, RawTxOpts, RelysiaRawTx, RelysiaAsm, RedeemOpts, RelysiaRedeem, AtomicSwapOfferOpts, RelysiaAtomicSwapOffer, AtomicSwapAcceptOpts, RelysiaAtomicSwapAccept, AtomicSwapWithIDOpts, RelysiaAtomicSwapWithID } from "./types";
export declare class BetterRelysiaSDK {
    authToken: string;
    authTimestamp: number;
    email: string;
    password: string;
    retries: number;
    retriesLeft: number;
    /** @default Headers */
    getHeaders: Headers;
    /** @default Headers */
    postHeaders: Headers;
    /**
     * @protected
     * @returns {Promise<void | false>}
     */
    protected checkAuth(): Promise<void | false>;
    /**
     * Gets the user profile from Relysia.
     * @public
     * @returns {Promise<RelysiaUserProfileData>}
     */
    getUserProfile(): Promise<RelysiaUserProfileData>;
    /**
     * Get an address and the paymail for a specified wallet.
     * @public
     * @param {string} [walletId] The Wallet ID that you wish to get the address for. Defaults to default wallet if not specified
     * @returns {Promise<RelysiaGetAddress>}
     */
    getAddress(walletId?: string): Promise<RelysiaGetAddress>;
    /**
     * Get all addresses related to your wallet.
     * @public
     * @param {string} [walletId] Wallet ID of the wallet you want to use. Leave blank to use default wallet
     * @returns {Promise<RelysiaGetAllAddress>}
     */
    getAllAddressess(walletId?: string): Promise<RelysiaGetAllAddress>;
    /**
     * Gets the leaderboard of those who hold a particular STAS token.
     * @public
     * @param {string} tokenId The token id of the token you wish to query.
     * @param {number} [nextPageToken] The next page token given by a previous response.
     * @returns {Promise<RelysiaLeaderboard>}
     */
    leaderboard(tokenId: string, nextPageToken?: number): Promise<RelysiaLeaderboard>;
    /**
     * Gets all wallets in the Relysia account.
     * @public
     * @returns {Promise<RelysiaWallets>}
     */
    wallets(): Promise<RelysiaWallets>;
    /** Gets the mnemonic of a wallet
     * @public
     * @param {string} [walletId] Wallet ID of the wallet you want to use. Leave blank to use default wallet
     * @returns {Promise<RelysiaMnemonic>}
     */
    mnemonic(walletId?: string): Promise<RelysiaMnemonic>;
    /**
     * Get the balance of the specified wallet
     * @public
     * @param {BalanceOpts} [opts] Optional options to pass to the endpoint
     * @returns {Promise<RelysiaBalance>}
     */
    balance(opts?: BalanceOpts): Promise<RelysiaBalance>;
    /**
     * Get wallet history
     * @public
     * @param {HistoryOpts} [opts] Optional options to pass
     * @returns {Promise<RelysiaHistory>}
     */
    history(opts?: HistoryOpts): Promise<RelysiaHistory>;
    /**
     * Transfer all assets from a specific private key
     * @public
     * @param {string} privateKey The private key you wish to sweep from
     * @param {string} [walletID]
     * @returns {Promise<RelysiaSweep>}
     */
    sweep(privateKey: string, walletID?: string): Promise<RelysiaSweep>;
    /**
     * Create a raw transaction
     * @public
     * @param {RawTxOpts} opts Function Options
     * @returns {Promise<RelysiaRawTx>}
     */
    rawTx(opts: RawTxOpts): Promise<RelysiaRawTx>;
    /**
     * Make a transaction with a custom script. Relatively limited and should be avoided where possible
     * @public
     * @param {string} asm The custom bitcoin script to be added as an output
     * @param {number} amount The amount of BSV to lock in the script
     * @param {string} [walletID] The wallet you want to use
     * @returns {Promise<RelysiaAsm>}
     */
    asm(asm: string, amount: number, walletID?: string): Promise<RelysiaAsm>;
    /**
     * Dissolve a token for satoshis
     * @public
     * @param {string} tokenId The token you wish to redeem
     * @param {number} amount How much you wish to redeem
     * @param {RedeemOpts} [opts] Additional options
     * @returns {Promise<RelysiaRedeem>}
     */
    redeemToken(tokenId: string, amount: number, opts?: RedeemOpts): Promise<RelysiaRedeem>;
    /**
     * Create an atomic swap offer
     * @public
     * @param {AtomicSwapOfferOpts[]} opts Function options
     * @param {string} walletId The wallet you want to use
     * @returns {Promise<RelysiaAtomicSwapOffer>}
     */
    atomicSwapOffer(opts: AtomicSwapOfferOpts[], walletId: string): Promise<RelysiaAtomicSwapOffer>;
    /**
     * Accept an atomic swap
     * @public
     * @param {AtomicSwapAcceptOpts} opts Function Options
     * @param {string} [walletId] The wallet you want to use
     * @returns {Promise<RelysiaAtomicSwapAccept>}
     */
    atomicSwapAccept(opts: AtomicSwapAcceptOpts, walletId?: string): Promise<RelysiaAtomicSwapAccept>;
    /**
     * Allows you to inspect an atomic swap to check the validity of it
     * @public
     * @param {AtomicSwapAcceptOpts} opts The function options
     * @param {string} [walletId] The wallet you wish to use
     * @returns {Promise<any>}
     */
    inspectAtomicSwap(opts: AtomicSwapAcceptOpts, walletId?: string): Promise<any>;
    /**
     * Create an atomic swap that uses an id instead of a swap hex
     * @public
     * @param {AtomicSwapWithIDOpts[]} opts The function options
     * @param {string} [walletID] The wallet you wish to use
     * @returns {Promise<RelysiaAtomicSwapWithID>}
     */
    atomicSwapWithId(opts: AtomicSwapWithIDOpts[], walletID?: string): Promise<RelysiaAtomicSwapWithID>;
    /**
     * Accepts an atomic swap that uses an id instead of a swap hex. Returns an array of strings
     * @public
     * @param {string[]} ids Array of swap ids
     * @param {string} [walletID] The wallet you wish to use
     * @returns {Promise<string[]>}
     */
    acceptAtomicSwapWithId(ids: string[], walletID?: string): Promise<string[]>;
}
