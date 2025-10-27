"use strict";
/** @import { RelysiaAuth, RelysiaUserProfileData, RelysiaBasic, CreateWalletOpt, RelysiaCreateWallet, RelysiaGetAddress, RelysiaGetAllAddress, RelysiaLeaderboard, RelysiaWallets, RelysiaMnemonic, BalanceOpts, RelysiaBalance, HistoryOpts, RelysiaHistory, RelysiaSweep, RawTxOpts, RelysiaRawTx, RelysiaAsm, RedeemOpts, RelysiaRedeem, AtomicSwapOfferOpts, RelysiaAtomicSwapOffer, AtomicSwapAcceptOpts, RelysiaAtomicSwapAccept, RelysiaAtomicSwapInspect, AtomicSwapWithIDOpts, RelysiaAtomicSwapWithID, PayInvoiceOpts } from './types' */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetterRelysiaSDK = void 0;
const identity_1 = require("./functions/identity");
const smart_1 = require("./functions/smart");
const transactions_1 = require("./functions/transactions");
const wallets_1 = require("./functions/wallets");
class BetterRelysiaSDK {
    authToken;
    authTimestamp;
    email;
    password;
    retries;
    retriesLeft;
    /** @default Headers */
    getHeaders = new Headers({ accept: 'application/json' });
    /** @default Headers */
    postHeaders = new Headers({ accept: 'application/json', 'Content-Type': 'application/json', });
    /**
     * @protected
     * @returns {Promise<void | false>}
     */
    async checkAuth() {
        if (this.authTimestamp <= Date.now() - 600000) {
            return;
        }
        const response = await fetch('https://api.relysia.com/v1/auth', {
            method: 'POST',
            body: JSON.stringify({
                email: this.email,
                password: this.password,
            }),
            headers: this.postHeaders,
        });
        this.authTimestamp = Date.now();
        const body = await response.json();
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return await this.checkAuth();
            }
            return false;
        }
        this.authToken = body.data.token;
        this.getHeaders.set('authToken', this.authToken);
        this.postHeaders.set('authToken', this.authToken);
    }
    /**
     * Gets the user profile from Relysia.
     * @public
     * @returns {Promise<RelysiaUserProfileData>}
     */
    async getUserProfile() {
        return identity_1.getUserProfile.call(this);
    }
    /**
     * Get an address and the paymail for a specified wallet.
     * @public
     * @param {string} [walletId] The Wallet ID that you wish to get the address for. Defaults to default wallet if not specified
     * @returns {Promise<RelysiaGetAddress>}
     */
    async getAddress(walletId) {
        return wallets_1.getAddress.call(this, walletId);
    }
    /**
     * Get all addresses related to your wallet.
     * @public
     * @param {string} [walletId] Wallet ID of the wallet you want to use. Leave blank to use default wallet
     * @returns {Promise<RelysiaGetAllAddress>}
     */
    async getAllAddressess(walletId) {
        return wallets_1.getAllAddressess.call(this, walletId);
    }
    /**
     * Gets the leaderboard of those who hold a particular STAS token.
     * @public
     * @param {string} tokenId The token id of the token you wish to query.
     * @param {number} [nextPageToken] The next page token given by a previous response.
     * @returns {Promise<RelysiaLeaderboard>}
     */
    async leaderboard(tokenId, nextPageToken) {
        return wallets_1.leaderboard.call(this, tokenId, nextPageToken);
    }
    /**
     * Gets all wallets in the Relysia account.
     * @public
     * @returns {Promise<RelysiaWallets>}
     */
    async wallets() {
        return wallets_1.wallets.call(this);
    }
    /** Gets the mnemonic of a wallet
     * @public
     * @param {string} [walletId] Wallet ID of the wallet you want to use. Leave blank to use default wallet
     * @returns {Promise<RelysiaMnemonic>}
     */
    async mnemonic(walletId) {
        return wallets_1.mnemonic.call(this, walletId);
    }
    /**
     * Get the balance of the specified wallet
     * @public
     * @param {BalanceOpts} [opts] Optional options to pass to the endpoint
     * @returns {Promise<RelysiaBalance>}
     */
    async balance(opts) {
        return wallets_1.balance.call(this, opts);
    }
    /**
     * Get wallet history
     * @public
     * @param {HistoryOpts} [opts] Optional options to pass
     * @returns {Promise<RelysiaHistory>}
     */
    async history(opts) {
        return wallets_1.history.call(this, opts);
    }
    /**
     * Transfer all assets from a specific private key
     * @public
     * @param {string} privateKey The private key you wish to sweep from
     * @param {string} [walletID]
     * @returns {Promise<RelysiaSweep>}
     */
    async sweep(privateKey, walletID) {
        return transactions_1.sweep.call(this, privateKey, walletID);
    }
    /**
     * Create a raw transaction
     * @public
     * @param {RawTxOpts} opts Function Options
     * @returns {Promise<RelysiaRawTx>}
     */
    async rawTx(opts) {
        return transactions_1.rawTx.call(this, opts);
    }
    /**
     * Make a transaction with a custom script. Relatively limited and should be avoided where possible
     * @public
     * @param {string} asm The custom bitcoin script to be added as an output
     * @param {number} amount The amount of BSV to lock in the script
     * @param {string} [walletID] The wallet you want to use
     * @returns {Promise<RelysiaAsm>}
     */
    async asm(asm, amount, walletID) {
        return transactions_1.asm.call(this, asm, amount, walletID);
    }
    /**
     * Dissolve a token for satoshis
     * @public
     * @param {string} tokenId The token you wish to redeem
     * @param {number} amount How much you wish to redeem
     * @param {RedeemOpts} [opts] Additional options
     * @returns {Promise<RelysiaRedeem>}
     */
    async redeemToken(tokenId, amount, opts) {
        return smart_1.redeemToken.call(this, tokenId, amount, opts);
    }
    /**
     * Create an atomic swap offer
     * @public
     * @param {AtomicSwapOfferOpts[]} opts Function options
     * @param {string} walletId The wallet you want to use
     * @returns {Promise<RelysiaAtomicSwapOffer>}
     */
    async atomicSwapOffer(opts, walletId) {
        return transactions_1.atomicSwapOffer.call(this, opts, walletId);
    }
    /**
     * Accept an atomic swap
     * @public
     * @param {AtomicSwapAcceptOpts} opts Function Options
     * @param {string} [walletId] The wallet you want to use
     * @returns {Promise<RelysiaAtomicSwapAccept>}
     */
    async atomicSwapAccept(opts, walletId) {
        return transactions_1.atomicSwapAccept.call(this, opts, walletId);
    }
    /**
     * Allows you to inspect an atomic swap to check the validity of it
     * @public
     * @param {AtomicSwapAcceptOpts} opts The function options
     * @param {string} [walletId] The wallet you wish to use
     * @returns {Promise<any>}
     */
    async inspectAtomicSwap(opts, walletId) {
        return transactions_1.inspectAtomicSwap.call(this, opts, walletId);
    }
    /**
     * Create an atomic swap that uses an id instead of a swap hex
     * @public
     * @param {AtomicSwapWithIDOpts[]} opts The function options
     * @param {string} [walletID] The wallet you wish to use
     * @returns {Promise<RelysiaAtomicSwapWithID>}
     */
    async atomicSwapWithId(opts, walletID) {
        return transactions_1.atomicSwapWithId.call(this, opts, walletID);
    }
    /**
     * Accepts an atomic swap that uses an id instead of a swap hex. Returns an array of strings
     * @public
     * @param {string[]} ids Array of swap ids
     * @param {string} [walletID] The wallet you wish to use
     * @returns {Promise<string[]>}
     */
    async acceptAtomicSwapWithId(ids, walletID) {
        return transactions_1.acceptAtomicSwapWithId.call(this, ids, walletID);
    }
    /**
     * Allows you to pay a generated invoice
     * @public
     * @param {PayInvoiceOpts} opts Invoice options
     * @param {string} [walletID] The wallet you wish to use
     * @returns {Promise<string>}
     */
    async payInvoice(opts, walletID) {
        return transactions_1.payInvoice.call(this, opts, walletID);
    }
}
exports.BetterRelysiaSDK = BetterRelysiaSDK;
