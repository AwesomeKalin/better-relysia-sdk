import { CreateWalletOpt, RelysiaCreateWallet, RelysiaGetAddress, RelysiaGetAllAddress, RelysiaLeaderboard, RelysiaUserProfileData } from "./types";
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
}
/**
    * Authenticate with the Relysia API. Does not support OAuth.
 * @param {string} email Email address of the Relysia account
 * @param {string} password Password of the Relysia account
 * @param {number} [retries=20] Number of retries that requests should do
 * @returns {Promise<'Incorrect Password' | BetterRelysiaSDK | 'Account doesn\'t exist'>}
 */
export declare function authenticate(email: string, password: string, retries?: number): Promise<'Incorrect Password' | BetterRelysiaSDK | 'Account doesn\'t exist'>;
