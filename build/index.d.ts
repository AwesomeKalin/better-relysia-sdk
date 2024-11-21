/** @import { AtomicSwapAcceptOpts, AtomicSwapOfferOpts, BalanceOpts, CreateWalletOpt, HistoryOpts, RawTxOpts, RedeemOpts, RelysiaAsm, RelysiaAtomicSwapAccept, RelysiaAtomicSwapInspect, RelysiaAtomicSwapOffer, RelysiaAuth, RelysiaBalance, RelysiaBasic, RelysiaCreateWallet, RelysiaGetAddress, RelysiaGetAllAddress, RelysiaHistory, RelysiaLeaderboard, RelysiaMnemonic, RelysiaRawTx, RelysiaRedeem, RelysiaSweep, RelysiaUserDetailsUnproccessed, RelysiaUserProfileData, RelysiaWallets, TransferSchema } from './types' */
import { AtomicSwapAcceptOpts, AtomicSwapOfferOpts, BalanceOpts, CreateWalletOpt, HistoryOpts, RawTxOpts, RedeemOpts, RelysiaAsm, RelysiaAtomicSwapAccept, RelysiaAtomicSwapOffer, RelysiaBalance, RelysiaCreateWallet, RelysiaGetAddress, RelysiaGetAllAddress, RelysiaHistory, RelysiaLeaderboard, RelysiaMnemonic, RelysiaRawTx, RelysiaRedeem, RelysiaSweep, RelysiaUserProfileData, RelysiaWallets } from "./types";
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
     * @private
     * @returns {Promise<void | false>}
     */
    private checkAuth;
    /**
     * Gets the user profile from Relysia.
     * @public
     * @returns {Promise<RelysiaUserProfileData>}
     */
    getUserProfile(): Promise<RelysiaUserProfileData>;
    /**
     * @private
     * @returns {Promise<RelysiaUserProfileData>}
     */
    private getUserProfileRepeat;
    /**
     * Creates a new Relysia wallet.
     * @public
     * @param {string} walletTitle The title of the wallet.
     * @param {CreateWalletOpt} [opt]
     * @returns {Promise<RelysiaCreateWallet>}
     */
    createWallet(walletTitle: string, opt?: CreateWalletOpt): Promise<RelysiaCreateWallet>;
    /**
     * @private
     * @param {string} walletTitle
     * @param {CreateWalletOpt} [opt]
     * @returns {Promise<RelysiaCreateWallet>}
     */
    private createWalletRepeat;
    /**
     * Get an address and the paymail for a specified wallet.
     * @public
     * @param {string} [walletId] The Wallet ID that you wish to get the address for. Defaults to default wallet if not specified
     * @returns {Promise<RelysiaGetAddress>}
     */
    getAddress(walletId?: string): Promise<RelysiaGetAddress>;
    /**
     * @private
     * @param {string} [walletId]
     * @returns {Promise<RelysiaGetAddress>}
     */
    private getAddressRepeat;
    /**
     * Get all addresses related to your wallet.
     * @public
     * @param {string} [walletId] Wallet ID of the wallet you want to use. Leave blank to use default wallet
     * @returns {Promise<RelysiaGetAllAddress>}
     */
    getAllAddressess(walletId?: string): Promise<RelysiaGetAllAddress>;
    /**
     * @private
     * @param {string} [walletId]
     * @returns {Promise<RelysiaGetAllAddress>}
     */
    private getAllAddressessRepeat;
    /**
     * Gets the leaderboard of those who hold a particular STAS token.
     * @public
     * @param {string} tokenId The token id of the token you wish to query.
     * @param {number} [nextPageToken] The next page token given by a previous response.
     * @returns {Promise<RelysiaLeaderboard>}
     */
    leaderboard(tokenId: string, nextPageToken?: number): Promise<RelysiaLeaderboard>;
    /**
     * @private
     * @param {string} tokenId
     * @param {number} [nextPageToken]
     * @returns {Promise<RelysiaLeaderboard>}
     */
    private leaderboardRepeat;
    /**
     * Gets all wallets in the Relysia account.
     * @public
     * @returns {Promise<RelysiaWallets>}
     */
    wallets(): Promise<RelysiaWallets>;
    /**
     * @private
     * @returns {Promise<RelysiaWallets>}
     */
    private walletsRepeat;
    /** Gets the mnemonic of a wallet
     * @public
     * @param {string} [walletId] Wallet ID of the wallet you want to use. Leave blank to use default wallet
     * @returns {Promise<RelysiaMnemonic>}
     */
    mnemonic(walletId?: string): Promise<RelysiaMnemonic>;
    /**
     * @private
     * @param {string} [walletId]
     * @returns {Promise<RelysiaMnemonic>}
     */
    private mnemonicRepeat;
    /**
     * Get the balance of the specified wallet
     * @public
     * @param {BalanceOpts} [opts] Optional options to pass to the endpoint
     * @returns {Promise<RelysiaBalance>}
     */
    balance(opts?: BalanceOpts): Promise<RelysiaBalance>;
    /**
     * @private
     * @param {BalanceOpts} [opts]
     * @returns {Promise<RelysiaBalance>}
     */
    private balanceRepeat;
    /**
     * Get wallet history
     * @public
     * @param {HistoryOpts} [opts] Optional options to pass
     * @returns {Promise<RelysiaHistory>}
     */
    history(opts?: HistoryOpts): Promise<RelysiaHistory>;
    /**
     * @private
     * @param {HistoryOpts} [opts]
     * @returns {Promise<RelysiaHistory>}
     */
    private historyRepeat;
    /**
     * Transfer all assets from a specific private key
     * @public
     * @param {string} privateKey The private key you wish to sweep from
     * @param {string} [walletID]
     * @returns {Promise<RelysiaSweep | 'Reached Max Attempts' | 'Non-existant wallet' | 'Not a valid private key'>}
     */
    sweep(privateKey: string, walletID?: string): Promise<RelysiaSweep | 'Reached Max Attempts' | 'Non-existant wallet' | 'Not a valid private key'>;
    /**
     * @private
     * @param {string} privateKey
     * @param {string} [walletID]
     * @returns {Promise<RelysiaSweep>}
     */
    private sweepRepeat;
    /**
     * Create a raw transaction
     * @public
     * @param {RawTxOpts} opts Function Options
     * @returns {Promise<RelysiaRawTx>}
     */
    rawTx(opts: RawTxOpts): Promise<RelysiaRawTx>;
    /**
     * @private
     * @param {RawTxOpts} opts
     * @returns {Promise<RelysiaRawTx>}
     */
    private rawTxRepeat;
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
     * @private
     * @param {string} asm
     * @param {number} amount
     * @param {string} [walletID]
     * @returns {Promise<RelysiaAsm>}
     */
    private asmRepeat;
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
     * @private
     * @param {string} tokenId
     * @param {number} amount
     * @param {RedeemOpts} [opts]
     * @returns {Promise<RelysiaRedeem>}
     */
    private redeemTokenRepeat;
    /**
     * Create an atomic swap offer
     * @public
     * @param {AtomicSwapOfferOpts[]} opts Function options
     * @param {string} walletId The wallet you want to use
     * @returns {Promise<RelysiaAtomicSwapOffer>}
     */
    atomicSwapOffer(opts: AtomicSwapOfferOpts[], walletId: string): Promise<RelysiaAtomicSwapOffer>;
    /**
     * @private
     * @param {AtomicSwapOfferOpts[]} opts
     * @param {string} [walletId]
     * @returns {Promise<RelysiaAtomicSwapOffer>}
     */
    private atomicSwapOfferRepeat;
    /**
     * Accept an atomic swap
     * @public
     * @param {AtomicSwapAcceptOpts} opts Function Options
     * @param {string} [walletId] The wallet you want to use
     * @returns {Promise<RelysiaAtomicSwapAccept>}
     */
    atomicSwapAccept(opts: AtomicSwapAcceptOpts, walletId?: string): Promise<RelysiaAtomicSwapAccept>;
    /**
     * @private
     * @param {AtomicSwapAcceptOpts} opts
     * @param {string} [walletId]
     * @returns {Promise<RelysiaAtomicSwapAccept>}
     */
    private atomicSwapAcceptRepeat;
    /**
     * Allows you to inspect an atomic swap to check the validity of it
     * @public
     * @param {AtomicSwapAcceptOpts} opts The function options
     * @param {string} [walletId] The wallet you wish to use
     * @returns {Promise<any>}
     */
    inspectAtomicSwap(opts: AtomicSwapAcceptOpts, walletId?: string): Promise<any>;
    /**
     * @private
     * @param {AtomicSwapAcceptOpts} opts
     * @param {string} [walletId]
     * @returns {any}
     */
    private inspectAtomicSwapRepeat;
}
/**
    * Authenticate with the Relysia API. Does not support OAuth.
 * @param {string} email Email address of the Relysia account
 * @param {string} password Password of the Relysia account
 * @param {number} [retries=20] Number of retries that requests should do
 * @returns {Promise<BetterRelysiaSDK>}
 */
export declare function authenticate(email: string, password: string, retries?: number): Promise<BetterRelysiaSDK>;
