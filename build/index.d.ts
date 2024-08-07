/** @typedef {import('./types').BalanceOpts} BalanceOpts */
/** @typedef {import('./types').CreateWalletOpt} CreateWalletOpt */
/** @typedef {import('./types').HistoryOpts} HistoryOpts */
/** @typedef {import('./types').RawTxOpts} RawTxOpts */
/** @typedef {import('./types').RedeemOpts} RedeemOpts */
/** @typedef {import('./types').RelysiaAsm} RelysiaAsm */
/** @typedef {import('./types').RelysiaAuth} RelysiaAuth */
/** @typedef {import('./types').RelysiaBalance} RelysiaBalance */
/** @typedef {import('./types').RelysiaBasic} RelysiaBasic */
/** @typedef {import('./types').RelysiaCreateWallet} RelysiaCreateWallet */
/** @typedef {import('./types').RelysiaGetAddress} RelysiaGetAddress */
/** @typedef {import('./types').RelysiaGetAllAddress} RelysiaGetAllAddress */
/** @typedef {import('./types').RelysiaHistory} RelysiaHistory */
/** @typedef {import('./types').RelysiaLeaderboard} RelysiaLeaderboard */
/** @typedef {import('./types').RelysiaMnemonic} RelysiaMnemonic */
/** @typedef {import('./types').RelysiaRawTx} RelysiaRawTx */
/** @typedef {import('./types').RelysiaRedeem} RelysiaRedeem */
/** @typedef {import('./types').RelysiaSweep} RelysiaSweep */
/** @typedef {import('./types').RelysiaUserDetailsUnproccessed} RelysiaUserDetailsUnproccessed */
/** @typedef {import('./types').RelysiaUserProfileData} RelysiaUserProfileData */
/** @typedef {import('./types').RelysiaWallets} RelysiaWallets */
/** @typedef {import('./types').TransferSchema} TransferSchema */
import { BalanceOpts, CreateWalletOpt, HistoryOpts, RawTxOpts, RedeemOpts, RelysiaAsm, RelysiaBalance, RelysiaCreateWallet, RelysiaGetAddress, RelysiaGetAllAddress, RelysiaHistory, RelysiaLeaderboard, RelysiaMnemonic, RelysiaRawTx, RelysiaRedeem, RelysiaSweep, RelysiaUserProfileData, RelysiaWallets } from "./types";
export declare class BetterRelysiaSDK {
    authToken: string;
    authTimestamp: number;
    email: string;
    password: string;
    retries: number;
    retriesLeft: number;
    /**
     * @private
     * @returns {Promise<void | false>}
     */
    private checkAuth;
    /**
     * Gets the user profile from Relysia.
     * @public
     * @returns {Promise<RelysiaUserProfileData | 'Reached Max Attempts'>}
     */
    getUserProfile(): Promise<RelysiaUserProfileData | 'Reached Max Attempts'>;
    /**
     * @private
     * @returns {Promise<RelysiaUserProfileData | 'Reached Max Attempts'>}
     */
    private getUserProfileRepeat;
    /**
     * Creates a new Relysia wallet.
     * @public
     * @param {string} walletTitle The title of the wallet.
     * @param {CreateWalletOpt} [opt]
     * @returns {Promise<"Reached Max Attempts" | "Invalid Mnemonic!" | "Paymail in incorrect format!" | "Invalid wallet type!" | "Not a URL!" | RelysiaCreateWallet>}
     */
    createWallet(walletTitle: string, opt?: CreateWalletOpt): Promise<"Reached Max Attempts" | "Invalid Mnemonic!" | "Paymail in incorrect format!" | "Invalid wallet type!" | "Not a URL!" | RelysiaCreateWallet>;
    /**
     * @private
     * @param {string} walletTitle
     * @param {CreateWalletOpt} [opt]
     * @returns {Promise<"Reached Max Attempts" | "Invalid Mnemonic!" | "Paymail in incorrect format!" | "Invalid wallet type!" | "Not a URL!" | RelysiaCreateWallet>}
     */
    private createWalletRepeat;
    /**
     * Get an address and the paymail for a specified wallet.
     * @public
     * @param {string} [walletId] The Wallet ID that you wish to get the address for. Defaults to default wallet if not specified
     * @returns {Promise<RelysiaGetAddress | 'Reached Max Attempts' | 'Non-existant wallet'>}
     */
    getAddress(walletId?: string): Promise<RelysiaGetAddress | 'Reached Max Attempts' | 'Non-existant wallet'>;
    /**
     * @private
     * @param {string} [walletId]
     * @returns {Promise<RelysiaGetAddress | 'Reached Max Attempts' | 'Non-existant wallet'>}
     */
    private getAddressRepeat;
    /**
     * Get all addresses related to your wallet.
     * @public
     * @param {string} [walletId] Wallet ID of the wallet you want to use. Leave blank to use default wallet
     * @returns {Promise<RelysiaGetAllAddress | 'Reached Max Attempts' | 'Non-existant wallet'>}
     */
    getAllAddressess(walletId?: string): Promise<RelysiaGetAllAddress | 'Reached Max Attempts' | 'Non-existant wallet'>;
    /**
     * @private
     * @param {string} [walletId]
     * @returns {Promise<RelysiaGetAllAddress | 'Reached Max Attempts' | 'Non-existant wallet'>}
     */
    private getAllAddressessRepeat;
    /**
     * Gets the leaderboard of those who hold a particular STAS token.
     * @public
     * @param {string} tokenId The token id of the token you wish to query.
     * @param {number} [nextPageToken] The next page token given by a previous response.
     * @returns {Promise<RelysiaLeaderboard | 'Reached Max Attempts' | 'Invalid Token ID!' | 'No entries in leaderboard'>}
     */
    leaderboard(tokenId: string, nextPageToken?: number): Promise<RelysiaLeaderboard | 'Reached Max Attempts' | 'Invalid Token ID!' | 'No entries in leaderboard'>;
    /**
     * @private
     * @param {string} tokenId
     * @param {number} [nextPageToken]
     * @returns {Promise<RelysiaLeaderboard | 'Reached Max Attempts' | 'Invalid Token ID!' | 'No entries in leaderboard'>}
     */
    private leaderboardRepeat;
    /**
     * Gets all wallets in the Relysia account.
     * @public
     * @returns {Promise<RelysiaWallets | 'Reached Max Attempts'>}
     */
    wallets(): Promise<RelysiaWallets | 'Reached Max Attempts'>;
    /**
     * @private
     * @returns {Promise<RelysiaWallets | 'Reached Max Attempts'>}
     */
    private walletsRepeat;
    /** Gets the mnemonic of a wallet
     * @public
     * @param {string} [walletId] Wallet ID of the wallet you want to use. Leave blank to use default wallet
     * @returns {Promise<RelysiaMnemonic | 'Reached Max Attempts' | 'Non-existant wallet'>}
     */
    mnemonic(walletId?: string): Promise<RelysiaMnemonic | 'Reached Max Attempts' | 'Non-existant wallet'>;
    /**
     * @private
     * @param {string} [walletId]
     * @returns {Promise<RelysiaMnemonic | 'Reached Max Attempts' | 'Non-existant wallet'>}
     */
    private mnemonicRepeat;
    /**
     * Get the balance of the specified wallet
     * @public
     * @param {BalanceOpts} [opts] Optional options to pass to the endpoint
     * @returns {Promise<RelysiaBalance | 'Reached Max Attempts' | 'Non-existant wallet' | 'Invalid nextPageToken' | 'Invalid Currency'>}
     */
    balance(opts?: BalanceOpts): Promise<RelysiaBalance | 'Reached Max Attempts' | 'Non-existant wallet' | 'Invalid nextPageToken' | 'Invalid Currency'>;
    /**
     * @private
     * @param {BalanceOpts} [opts]
     * @returns {Promise<RelysiaBalance | 'Reached Max Attempts' | 'Non-existant wallet' | 'Invalid nextPageToken' | 'Invalid Currency'>}
     */
    private balanceRepeat;
    /**
     * Get wallet history
     * @public
     * @param {HistoryOpts} [opts] Optional options to pass
     * @returns {Promise<RelysiaHistory | 'Reached Max Attempts' | 'Non-existant wallet'>}
     */
    history(opts?: HistoryOpts): Promise<RelysiaHistory | 'Reached Max Attempts' | 'Non-existant wallet'>;
    /**
     * @private
     * @param {HistoryOpts} [opts]
     * @returns {Promise<RelysiaHistory | 'Reached Max Attempts' | 'Non-existant wallet'>}
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
     * @returns {Promise<RelysiaSweep | 'Reached Max Attempts' | 'Non-existant wallet' | 'Not a valid private key'>}
     */
    private sweepRepeat;
    /**
     * Create a raw transaction
     * @public
     * @param {RawTxOpts} opts Function Options
     * @returns {Promise<RelysiaRawTx | 'Reached Max Attempts' | 'Non-existant wallet' | 'Insufficient Balance'>}
     */
    rawTx(opts: RawTxOpts): Promise<RelysiaRawTx | 'Reached Max Attempts' | 'Non-existant wallet' | 'Insufficient Balance'>;
    /**
     * @private
     * @param {RawTxOpts} opts
     * @returns {Promise<RelysiaRawTx | 'Reached Max Attempts' | 'Non-existant wallet' | 'Insufficient Balance'>}
     */
    private rawTxRepeat;
    /**
     * Make a transaction with a custom script. Relatively limited and should be avoided where possible
     * @public
     * @param {string} asm The custom bitcoin script to be added as an output
     * @param {number} amount The amount of BSV to lock in the script
     * @param {string} [walletID] The wallet you want to use
     * @returns {Promise<RelysiaAsm | 'Reached Max Attempts' | 'Non-existant wallet' | 'Insufficient Balance'>}
     */
    asm(asm: string, amount: number, walletID?: string): Promise<RelysiaAsm | 'Reached Max Attempts' | 'Non-existant wallet' | 'Insufficient Balance'>;
    /**
     * @private
     * @param {string} asm
     * @param {number} amount
     * @param {string} [walletID]
     * @returns {Promise<RelysiaAsm | 'Reached Max Attempts' | 'Non-existant wallet' | 'Insufficient Balance'>}
     */
    private asmRepeat;
    /**
     * Dissolve a token for satoshis
     * @public
     * @param {string} tokenId The token you wish to redeem
     * @param {number} amount How much you wish to redeem
     * @param {RedeemOpts} [opts] Additional options
     * @returns {Promise<RelysiaRedeem | 'Reached Max Attempts' | 'Non-existant wallet' | 'Insufficient Balance'>}
     */
    redeemToken(tokenId: string, amount: number, opts?: RedeemOpts): Promise<RelysiaRedeem | 'Reached Max Attempts' | 'Non-existant wallet' | 'Insufficient Balance'>;
    /**
     * @private
     * @param {string} tokenId
     * @param {number} amount
     * @param {RedeemOpts} [opts]
     * @returns {Promise<RelysiaRedeem | 'Reached Max Attempts' | 'Non-existant wallet' | 'Insufficient Balance'>}
     */
    private redeemTokenRepeat;
}
/**
    * Authenticate with the Relysia API. Does not support OAuth.
 * @param {string} email Email address of the Relysia account
 * @param {string} password Password of the Relysia account
 * @param {number} [retries=20] Number of retries that requests should do
 * @returns {Promise<'Incorrect Password' | BetterRelysiaSDK | 'Account doesn\'t exist'>}
 */
export declare function authenticate(email: string, password: string, retries?: number): Promise<'Incorrect Password' | BetterRelysiaSDK | 'Account doesn\'t exist'>;
