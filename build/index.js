"use strict";
/** @import { AtomicSwapAcceptOpts, AtomicSwapOfferOpts, BalanceOpts, CreateWalletOpt, HistoryOpts, RawTxOpts, RedeemOpts, RelysiaAsm, RelysiaAtomicSwapAccept, RelysiaAtomicSwapInspect, RelysiaAtomicSwapOffer, RelysiaAuth, RelysiaBalance, RelysiaBasic, RelysiaCreateWallet, RelysiaGetAddress, RelysiaGetAllAddress, RelysiaHistory, RelysiaLeaderboard, RelysiaMnemonic, RelysiaRawTx, RelysiaRedeem, RelysiaSweep, RelysiaUserDetailsUnproccessed, RelysiaUserProfileData, RelysiaWallets, TransferSchema } from './types' */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetterRelysiaSDK = void 0;
exports.authenticate = authenticate;
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
     * @private
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
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const response = await fetch('https://api.relysia.com/v1/user', {
            method: 'GET',
            headers: this.getHeaders,
        });
        if (response.status !== 200) {
            this.retriesLeft--;
            return await this.getUserProfileRepeat();
        }
        let body = await response.json();
        //@ts-expect-error
        const unprocessedDetails = body.data.userDetails;
        body.data.userDetails = {
            userId: unprocessedDetails.userId,
            passwordHash: unprocessedDetails.passwordHash,
            passwordUpdatedAt: new Date(unprocessedDetails.passwordUpdatedAt),
            validSince: new Date(unprocessedDetails.validSince),
            lastLoginAt: new Date(unprocessedDetails.lastLoginAt),
            createdAt: new Date(unprocessedDetails.createdAt),
            lastRefreshAt: new Date(unprocessedDetails.lastRefreshAt),
            photo: unprocessedDetails.photo,
            displayName: unprocessedDetails.displayName,
            phoneNumber: unprocessedDetails.phoneNumber,
        };
        return body.data;
    }
    /**
     * @private
     * @returns {Promise<RelysiaUserProfileData>}
     */
    async getUserProfileRepeat() {
        const response = await fetch('https://api.relysia.com/v1/user', {
            method: 'GET',
            headers: this.getHeaders,
        });
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return await this.getUserProfileRepeat();
            }
            throw new Error('Reached Max Attempts');
        }
        let body = await response.json();
        //@ts-expect-error
        const unprocessedDetails = body.data.userDetails;
        body.data.userDetails = {
            userId: unprocessedDetails.userId,
            passwordHash: unprocessedDetails.passwordHash,
            passwordUpdatedAt: new Date(unprocessedDetails.passwordUpdatedAt),
            validSince: new Date(unprocessedDetails.validSince),
            lastLoginAt: new Date(unprocessedDetails.lastLoginAt),
            createdAt: new Date(unprocessedDetails.createdAt),
            lastRefreshAt: new Date(unprocessedDetails.lastRefreshAt),
            photo: unprocessedDetails.photo,
            displayName: unprocessedDetails.displayName,
            phoneNumber: unprocessedDetails.phoneNumber,
        };
        return body.data;
    }
    /**
     * Creates a new Relysia wallet.
     * @public
     * @param {string} walletTitle The title of the wallet.
     * @param {CreateWalletOpt} [opt]
     * @returns {Promise<RelysiaCreateWallet>}
     */
    async createWallet(walletTitle, opt) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const headers = this.getHeaders;
        headers.set('walletTitle', walletTitle);
        if (opt?.mnemonicPhrase !== undefined) {
            headers.set('mnemonicPhrase', opt.mnemonicPhrase);
        }
        if (opt?.paymail !== undefined) {
            headers.set('paymail', `${opt.paymail}@relysia.com`);
        }
        if (opt?.paymailActivate !== undefined) {
            headers.set('paymailActivate', opt.paymailActivate);
        }
        if (opt?.type !== undefined) {
            headers.set('type', opt.type);
        }
        if (opt?.walletLogo !== undefined) {
            headers.set('walletLogo', opt.walletLogo);
        }
        const response = await fetch('https://api.relysia.com/v1/createWallet', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === 'invalid mnemonic phrase') {
            throw new Error('Invalid Mnemonic');
        }
        else if (body.data.msg === "please write correct paymail, 'example@relysia.com'") {
            throw new Error('Paymail in incorrect format');
        }
        else if (body.data.msg === 'we support only "STANDARD or ESCROW" wallet type !') {
            throw new Error('Invalid wallet type');
        }
        else if (body.data.msg === 'headers/walletlogo must match format "uri"') {
            throw new Error('Not a URL');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            return await this.createWalletRepeat(walletTitle, opt);
        }
        return body.data;
    }
    /**
     * @private
     * @param {string} walletTitle
     * @param {CreateWalletOpt} [opt]
     * @returns {Promise<RelysiaCreateWallet>}
     */
    async createWalletRepeat(walletTitle, opt) {
        const headers = this.getHeaders;
        headers.set('walletTitle', walletTitle);
        if (opt?.mnemonicPhrase !== undefined) {
            headers.set('mnemonicPhrase', opt.mnemonicPhrase);
        }
        if (opt?.paymail !== undefined) {
            headers.set('paymail', `${opt.paymail}@relysia.com`);
        }
        if (opt?.paymailActivate !== undefined) {
            headers.set('paymailActivate', opt.paymailActivate);
        }
        if (opt?.type !== undefined) {
            headers.set('type', opt.type);
        }
        if (opt?.walletLogo !== undefined) {
            headers.set('walletLogo', opt.walletLogo);
        }
        const response = await fetch('https://api.relysia.com/v1/createWallet', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === 'invalid mnemonic phrase') {
            throw new Error('Invalid Mnemonic');
        }
        else if (body.data.msg === "please write correct paymail, 'example@relysia.com'") {
            throw new Error('Paymail in incorrect format');
        }
        else if (body.data.msg === 'we support only "STANDARD or ESCROW" wallet type !') {
            throw new Error('Invalid wallet type');
        }
        else if (body.data.msg === 'headers/walletlogo must match format "uri"') {
            throw new Error('Not a URL');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return await this.createWalletRepeat(walletTitle, opt);
            }
            throw new Error('Reached Max Attempts');
        }
        return body.data;
    }
    /**
     * Get an address and the paymail for a specified wallet.
     * @public
     * @param {string} [walletId] The Wallet ID that you wish to get the address for. Defaults to default wallet if not specified
     * @returns {Promise<RelysiaGetAddress>}
     */
    async getAddress(walletId) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const headers = this.getHeaders;
        if (walletId !== undefined) {
            headers.set('walletId', walletId);
        }
        const response = await fetch('https://api.relysia.com/v1/address', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === `Error while syncing with walletId: ${walletId}`) {
            throw new Error('Non-existant wallet');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            return await this.getAddressRepeat(walletId);
        }
        return body.data;
    }
    /**
     * @private
     * @param {string} [walletId]
     * @returns {Promise<RelysiaGetAddress>}
     */
    async getAddressRepeat(walletId) {
        const headers = this.getHeaders;
        if (walletId !== undefined) {
            headers.set('walletId', walletId);
        }
        const response = await fetch('https://api.relysia.com/v1/address', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === `Error while syncing with walletId: ${walletId}`) {
            throw new Error('Non-existant wallet');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retries > 0) {
                return await this.getAddressRepeat(walletId);
            }
            throw new Error('Reached Max Attempts');
        }
        return body.data;
    }
    /**
     * Get all addresses related to your wallet.
     * @public
     * @param {string} [walletId] Wallet ID of the wallet you want to use. Leave blank to use default wallet
     * @returns {Promise<RelysiaGetAllAddress>}
     */
    async getAllAddressess(walletId) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const headers = this.getHeaders;
        if (walletId !== undefined) {
            headers.set('walletId', walletId);
        }
        const response = await fetch('https://api.relysia.com/v1/allAddresses', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === `Error while syncing with walletId: ${walletId}`) {
            throw new Error('Non-existant wallet');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            return await this.getAllAddressessRepeat(walletId);
        }
        return body.data;
    }
    /**
     * @private
     * @param {string} [walletId]
     * @returns {Promise<RelysiaGetAllAddress>}
     */
    async getAllAddressessRepeat(walletId) {
        const headers = this.getHeaders;
        if (walletId !== undefined) {
            headers.set('walletId', walletId);
        }
        const response = await fetch('https://api.relysia.com/v1/allAddresses', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === `Error while syncing with walletId: ${walletId}`) {
            throw new Error('Non-existant wallet');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return await this.getAllAddressessRepeat(walletId);
            }
            throw new Error('Reached Max Attempts');
        }
        return body.data;
    }
    /**
     * Gets the leaderboard of those who hold a particular STAS token.
     * @public
     * @param {string} tokenId The token id of the token you wish to query.
     * @param {number} [nextPageToken] The next page token given by a previous response.
     * @returns {Promise<RelysiaLeaderboard>}
     */
    async leaderboard(tokenId, nextPageToken) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const headers = this.getHeaders;
        headers.set('tokenId', tokenId);
        if (nextPageToken !== undefined) {
            headers.set('nextPageToken', nextPageToken.toString());
        }
        const response = await fetch('https://api.relysia.com/v1/leaderboard', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === 'invalid tokenId or sn !') {
            throw new Error('Invalid Token ID');
        }
        if (body.data.leaderboard.length === 0) {
            throw new Error('No entries in leaderboard');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            return await this.leaderboardRepeat(tokenId, nextPageToken);
        }
        return body.data;
    }
    /**
     * @private
     * @param {string} tokenId
     * @param {number} [nextPageToken]
     * @returns {Promise<RelysiaLeaderboard>}
     */
    async leaderboardRepeat(tokenId, nextPageToken) {
        const headers = this.getHeaders;
        headers.set('tokenId', tokenId);
        if (nextPageToken !== undefined) {
            headers.set('nextPageToken', nextPageToken.toString());
        }
        const response = await fetch('https://api.relysia.com/v1/leaderboard', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === 'invalid tokenId or sn !') {
            throw new Error('Invalid Token ID');
        }
        if (body.data.leaderboard.length === 0) {
            throw new Error('No entries in leaderboard');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return await this.leaderboardRepeat(tokenId, nextPageToken);
            }
            throw new Error('Reached Max Attempts');
        }
        return body.data;
    }
    /**
     * Gets all wallets in the Relysia account.
     * @public
     * @returns {Promise<RelysiaWallets>}
     */
    async wallets() {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const headers = this.getHeaders;
        const response = await fetch('https://api.relysia.com/v1/wallets', {
            method: 'GET',
            headers,
        });
        if (response.status !== 200) {
            this.retriesLeft--;
            return this.walletsRepeat();
        }
        const body = await response.json();
        return body.data;
    }
    /**
     * @private
     * @returns {Promise<RelysiaWallets>}
     */
    async walletsRepeat() {
        const headers = this.getHeaders;
        const response = await fetch('https://api.relysia.com/v1/wallets', {
            method: 'GET',
            headers,
        });
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return await this.walletsRepeat();
            }
            throw new Error('Reached Max Attempts');
        }
        const body = await response.json();
        return body.data;
    }
    /** Gets the mnemonic of a wallet
     * @public
     * @param {string} [walletId] Wallet ID of the wallet you want to use. Leave blank to use default wallet
     * @returns {Promise<RelysiaMnemonic>}
     */
    async mnemonic(walletId) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const headers = this.getHeaders;
        if (walletId !== undefined) {
            headers.set('walletId', walletId);
        }
        const response = await fetch('https://api.relysia.com/v1/mnemonic', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === `Error while syncing with walletId: ${walletId}`) {
            throw new Error('Non-existant wallet');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            return await this.mnemonicRepeat(walletId);
        }
        return body.data;
    }
    /**
     * @private
     * @param {string} [walletId]
     * @returns {Promise<RelysiaMnemonic>}
     */
    async mnemonicRepeat(walletId) {
        const headers = this.getHeaders;
        if (walletId !== undefined) {
            headers.set('walletId', walletId);
        }
        const response = await fetch('https://api.relysia.com/v1/mnemonic', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === `Error while syncing with walletId: ${walletId}`) {
            throw new Error('Non-existant wallet');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return await this.mnemonicRepeat(walletId);
            }
            throw new Error('Reached Max Attempts');
        }
        return body.data;
    }
    /**
     * Get the balance of the specified wallet
     * @public
     * @param {BalanceOpts} [opts] Optional options to pass to the endpoint
     * @returns {Promise<RelysiaBalance>}
     */
    async balance(opts) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const headers = this.getHeaders;
        if (opts !== undefined) {
            if (opts.nextPageToken !== undefined) {
                headers.set('nextPageToken', opts.nextPageToken);
            }
            if (opts.tokenId !== undefined) {
                headers.set('tokenId', opts.tokenId);
            }
            if (opts.symbol !== undefined) {
                headers.set('symbol', opts.symbol);
            }
            if (opts.walletId !== undefined) {
                headers.set('walletId', opts.walletId);
            }
            if (opts.type !== undefined) {
                headers.set('type', opts.type);
            }
            if (opts.currency !== undefined) {
                headers.set('currency', opts.currency);
            }
            if (opts.maxResults !== undefined) {
                headers.set('maxResults', opts.maxResults.toString());
            }
        }
        const response = await fetch('https://api.relysia.com/v2/balance', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (opts !== undefined) {
            if (body.data.msg === `Error while syncing with walletId: ${opts.walletId}`) {
                throw new Error('Non-existant wallet');
            }
            if (body.data.msg === 'Called reply with an invalid status code: 5107200') {
                throw new Error('Invalid nextPageToken');
            }
            if (body.data.msg === `we are not supporting ${opts.currency.toUpperCase()} as a currency`) {
                throw new Error('Invalid Currency');
            }
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            return this.balanceRepeat(opts);
        }
        return body.data;
    }
    /**
     * @private
     * @param {BalanceOpts} [opts]
     * @returns {Promise<RelysiaBalance>}
     */
    async balanceRepeat(opts) {
        const headers = this.getHeaders;
        if (opts !== undefined) {
            if (opts.nextPageToken !== undefined) {
                headers.set('nextPageToken', opts.nextPageToken);
            }
            if (opts.tokenId !== undefined) {
                headers.set('tokenId', opts.tokenId);
            }
            if (opts.symbol !== undefined) {
                headers.set('symbol', opts.symbol);
            }
            if (opts.walletId !== undefined) {
                headers.set('walletId', opts.walletId);
            }
            if (opts.type !== undefined) {
                headers.set('type', opts.type);
            }
            if (opts.currency !== undefined) {
                headers.set('currency', opts.currency);
            }
            if (opts.maxResults !== undefined) {
                headers.set('maxResults', opts.maxResults.toString());
            }
        }
        const response = await fetch('https://api.relysia.com/v2/balance', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (opts !== undefined) {
            if (body.data.msg === `Error while syncing with walletId: ${opts.walletId}`) {
                throw new Error('Non-existant wallet');
            }
            if (body.data.msg === 'Called reply with an invalid status code: 5107200') {
                throw new Error('Invalid nextPageToken');
            }
            if (body.data.msg === `we are not supporting ${opts.currency.toUpperCase()} as a currency`) {
                throw new Error('Invalid Currency');
            }
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return this.balanceRepeat(opts);
            }
            throw new Error('Reached Max Attempts');
        }
        return body.data;
    }
    /**
     * Get wallet history
     * @public
     * @param {HistoryOpts} [opts] Optional options to pass
     * @returns {Promise<RelysiaHistory>}
     */
    async history(opts) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const headers = this.getHeaders;
        if (opts !== undefined) {
            if (opts.limit !== undefined) {
                headers.set('limit', opts.limit);
            }
            if (opts.nextPageToken !== undefined) {
                headers.set('nextPageToken', opts.nextPageToken);
            }
            if (opts.protocol !== undefined) {
                headers.set('protocol', opts.protocol);
            }
            if (opts.tokenId !== undefined) {
                headers.set('tokenId', opts.tokenId);
            }
            if (opts.type !== undefined) {
                headers.set('type', opts.type);
            }
            if (opts.walletID !== undefined) {
                headers.set('walletID', opts.walletID);
            }
        }
        const response = await fetch('https://api.relysia.com/v2/history', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (opts !== undefined) {
            if (body.data.msg === `Error while syncing with walletId: ${opts.walletID}`) {
                throw new Error('Non-existant wallet');
            }
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            return this.historyRepeat(opts);
        }
        return body.data;
    }
    /**
     * @private
     * @param {HistoryOpts} [opts]
     * @returns {Promise<RelysiaHistory>}
     */
    async historyRepeat(opts) {
        const headers = this.getHeaders;
        if (opts !== undefined) {
            if (opts.limit !== undefined) {
                headers.set('limit', opts.limit);
            }
            if (opts.nextPageToken !== undefined) {
                headers.set('nextPageToken', opts.nextPageToken);
            }
            if (opts.protocol !== undefined) {
                headers.set('protocol', opts.protocol);
            }
            if (opts.tokenId !== undefined) {
                headers.set('tokenId', opts.tokenId);
            }
            if (opts.type !== undefined) {
                headers.set('type', opts.type);
            }
            if (opts.walletID !== undefined) {
                headers.set('walletID', opts.walletID);
            }
        }
        const response = await fetch('https://api.relysia.com/v2/history', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (opts !== undefined) {
            if (body.data.msg === `Error while syncing with walletId: ${opts.walletID}`) {
                throw new Error('Non-existant wallet');
            }
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return this.historyRepeat(opts);
            }
            throw new Error('Reached Max Attempts');
        }
        return body.data;
    }
    /**
     * Transfer all assets from a specific private key
     * @public
     * @param {string} privateKey The private key you wish to sweep from
     * @param {string} [walletID]
     * @returns {Promise<RelysiaSweep | 'Reached Max Attempts' | 'Non-existant wallet' | 'Not a valid private key'>}
     */
    async sweep(privateKey, walletID) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const headers = this.postHeaders;
        if (walletID !== undefined) {
            headers.set('walletID', walletID);
        }
        const body = JSON.stringify({ privateKey });
        const response = await fetch('https://api.relysia.com/v1/sweep', {
            method: 'POST',
            headers,
            body,
        });
        const res = await response.json();
        if (res.data.msg === `Error while syncing with walletId: ${walletID}`) {
            throw new Error('Non-existant wallet');
        }
        if (res.data.msg === 'Not a valid private key value !') {
            throw new Error('Not a valid private key');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            return this.sweepRepeat(privateKey, walletID);
        }
        return res.data;
    }
    /**
     * @private
     * @param {string} privateKey
     * @param {string} [walletID]
     * @returns {Promise<RelysiaSweep>}
     */
    async sweepRepeat(privateKey, walletID) {
        const headers = this.postHeaders;
        if (walletID !== undefined) {
            headers.set('walletID', walletID);
        }
        const body = JSON.stringify({ privateKey });
        const response = await fetch('https://api.relysia.com/v1/sweep', {
            method: 'POST',
            headers,
            body,
        });
        const res = await response.json();
        if (res.data.msg === `Error while syncing with walletId: ${walletID}`) {
            throw new Error('Non-existant wallet');
        }
        if (res.data.msg === 'Not a valid private key value !') {
            throw new Error('Not a valid private key');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return this.sweepRepeat(privateKey, walletID);
            }
            throw new Error('Reached Max Attempts');
        }
        return res.data;
    }
    /**
     * Create a raw transaction
     * @public
     * @param {RawTxOpts} opts Function Options
     * @returns {Promise<RelysiaRawTx>}
     */
    async rawTx(opts) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const headers = this.postHeaders;
        if (opts.walletID !== undefined) {
            headers.set('walletID', opts.walletID);
        }
        const body = JSON.stringify({ dataArray: opts.transfers });
        const response = await fetch('https://api.relysia.com/v1/rawtx', {
            method: 'POST',
            headers,
            body,
        });
        const res = await response.json();
        if (res.data.msg === `Error while syncing with walletId: ${opts.walletID}`) {
            throw new Error('Non-existant wallet');
        }
        if (res.data.msg === 'Insufficient Balance') {
            throw new Error('Insufficient Balance');
        }
        if (res.data.msg.startsWith('Insufficient funds for tokenId : ')) {
            throw new Error('Insufficient Balance');
        }
        if (res.statusCode !== 200) {
            this.retriesLeft--;
            return this.rawTxRepeat(opts);
        }
        return res.data;
    }
    /**
     * @private
     * @param {RawTxOpts} opts
     * @returns {Promise<RelysiaRawTx>}
     */
    async rawTxRepeat(opts) {
        const headers = this.postHeaders;
        if (opts.walletID !== undefined) {
            headers.set('walletID', opts.walletID);
        }
        const body = JSON.stringify({ dataArray: opts.transfers });
        const response = await fetch('https://api.relysia.com/v1/rawtx', {
            method: 'POST',
            headers,
            body,
        });
        const res = await response.json();
        if (res.data.msg === `Error while syncing with walletId: ${opts.walletID}`) {
            throw new Error('Non-existant wallet');
        }
        if (res.data.msg === 'Insufficient Balance') {
            throw new Error('Insufficient Balance');
        }
        if (res.data.msg.startsWith('Insufficient funds for tokenId : ')) {
            throw new Error('Insufficient Balance');
        }
        if (res.statusCode !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return this.rawTxRepeat(opts);
            }
            throw new Error('Reached Max Attempts');
        }
        return res.data;
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
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const headers = this.postHeaders;
        if (walletID !== undefined) {
            headers.set('walletID', walletID);
        }
        const body = JSON.stringify({
            dataArray: [
                {
                    asm,
                    amount,
                }
            ]
        });
        const response = await fetch('https://api.relysia.com/v1/asm', {
            method: 'POST',
            headers,
            body,
        });
        const res = await response.json();
        if (res.data.msg === `Error while syncing with walletId: ${walletID}`) {
            throw new Error('Non-existant wallet');
        }
        if (res.data.msg === 'Insufficient Balance') {
            throw new Error('Insufficient Balance');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            return this.asmRepeat(asm, amount, walletID);
        }
        return res.data;
    }
    /**
     * @private
     * @param {string} asm
     * @param {number} amount
     * @param {string} [walletID]
     * @returns {Promise<RelysiaAsm>}
     */
    async asmRepeat(asm, amount, walletID) {
        const headers = this.postHeaders;
        if (walletID !== undefined) {
            headers.set('walletID', walletID);
        }
        const body = JSON.stringify({
            dataArray: [
                {
                    asm,
                    amount,
                }
            ]
        });
        const response = await fetch('https://api.relysia.com/v1/asm', {
            method: 'POST',
            headers,
            body,
        });
        const res = await response.json();
        if (res.data.msg === `Error while syncing with walletId: ${walletID}`) {
            throw new Error('Non-existant wallet');
        }
        if (res.data.msg === 'Insufficient Balance') {
            throw new Error('Insufficient Balance');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return this.asmRepeat(asm, amount, walletID);
            }
            throw new Error('Reached Max Attempts');
        }
        return res.data;
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
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const headers = this.postHeaders;
        let body;
        if (opts !== undefined) {
            if (opts.walletID !== undefined) {
                headers.set('walletID', opts.walletID);
            }
            body = JSON.stringify({
                dataArray: [
                    {
                        amount,
                        tokenId,
                        sn: opts.sn,
                    }
                ]
            });
        }
        else {
            body = JSON.stringify({
                dataArray: [
                    {
                        amount,
                        tokenId,
                    }
                ]
            });
        }
        const response = await fetch('https://api.relysia.com/v1/redeem', {
            method: 'POST',
            headers,
            body,
        });
        const res = await response.json();
        if (res.data.msg === `Error while syncing with walletId: ${opts.walletID}`) {
            throw new Error('Non-existant wallet');
        }
        if (res.data.msg === 'Insufficient Balance') {
            throw new Error('Insufficient Balance');
        }
        if (res.data.msg.startsWith('Insufficient funds for tokenId : ')) {
            throw new Error('Insufficient Balance');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            return this.redeemTokenRepeat(tokenId, amount, opts);
        }
        return res.data;
    }
    /**
     * @private
     * @param {string} tokenId
     * @param {number} amount
     * @param {RedeemOpts} [opts]
     * @returns {Promise<RelysiaRedeem>}
     */
    async redeemTokenRepeat(tokenId, amount, opts) {
        const headers = this.postHeaders;
        let body;
        if (opts !== undefined) {
            if (opts.walletID !== undefined) {
                headers.set('walletID', opts.walletID);
            }
            body = JSON.stringify({
                dataArray: [
                    {
                        amount,
                        tokenId,
                        sn: opts.sn,
                    }
                ]
            });
        }
        else {
            body = JSON.stringify({
                dataArray: [
                    {
                        amount,
                        tokenId,
                    }
                ]
            });
        }
        const response = await fetch('https://api.relysia.com/v1/redeem', {
            method: 'POST',
            headers,
            body,
        });
        const res = await response.json();
        if (res.data.msg === `Error while syncing with walletId: ${opts.walletID}`) {
            throw new Error('Non-existant wallet');
        }
        if (res.data.msg === 'Insufficient Balance') {
            throw new Error('Insufficient Balance');
        }
        if (res.data.msg.startsWith('Insufficient funds for tokenId : ')) {
            throw new Error('Insufficient Balance');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return this.redeemTokenRepeat(tokenId, amount, opts);
            }
            throw new Error('Reached Max Attempts');
        }
        return res.data;
    }
    /**
     * Create an atomic swap offer
     * @public
     * @param {AtomicSwapOfferOpts[]} opts Function options
     * @param {string} walletId The wallet you want to use
     * @returns {Promise<RelysiaAtomicSwapOffer>}
     */
    async atomicSwapOffer(opts, walletId) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const headers = this.postHeaders;
        if (opts.length === 0) {
            throw new Error('No options provided');
        }
        for (var i = 0; i < opts.length; i++) {
            if (opts[i].tokenId === undefined && opts[i].wantedTokenId === undefined)
                throw new Error('Cannot swap BSV for BSV');
            if ((opts[i].sn !== undefined && opts[i].tokenId === undefined) || (opts[i].wantedSn !== undefined && opts[i].wantedTokenId === undefined))
                throw new Error('Cannot pass serial number without passing token id');
            if (opts[i].amount === 0 || opts[i].wantedAmount === 0)
                throw new Error('Cannot set amount to 0');
        }
        if (walletId !== undefined) {
            headers.set('walletID', walletId);
        }
        let body = JSON.stringify({ dataArray: opts });
        const response = await fetch('https://api.relysia.com/v1/offer', {
            method: 'POST',
            headers,
            body,
        });
        const res = await response.json();
        if (res.data.msg === `Error while syncing with walletId: ${walletId}`) {
            throw new Error('Non-existant wallet');
        }
        if (res.data.msg === 'Insufficient Balance') {
            throw new Error('Insufficient Balance');
        }
        if (res.data.msg.startsWith('Insufficient funds for tokenId : ')) {
            throw new Error('Insufficient Balance');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            return this.atomicSwapOfferRepeat(opts, walletId);
        }
        return res.data;
    }
    /**
     * @private
     * @param {AtomicSwapOfferOpts[]} opts
     * @param {string} [walletId]
     * @returns {Promise<RelysiaAtomicSwapOffer>}
     */
    async atomicSwapOfferRepeat(opts, walletId) {
        const headers = this.postHeaders;
        if (opts.length === 0) {
            throw new Error('No options provided');
        }
        for (var i = 0; i < opts.length; i++) {
            if (opts[i].tokenId === undefined && opts[i].wantedTokenId === undefined)
                throw new Error('Cannot swap BSV for BSV');
            if ((opts[i].sn !== undefined && opts[i].tokenId === undefined) || (opts[i].wantedSn !== undefined && opts[i].wantedTokenId === undefined))
                throw new Error('Cannot pass serial number without passing token id');
            if (opts[i].amount === 0 || opts[i].wantedAmount === 0)
                throw new Error('Cannot set amount to 0');
        }
        if (walletId !== undefined) {
            headers.set('walletID', walletId);
        }
        let body;
        body = JSON.stringify({ dataArray: opts });
        const response = await fetch('https://api.relysia.com/v1/offer', {
            method: 'POST',
            headers,
            body,
        });
        const res = await response.json();
        if (res.data.msg === `Error while syncing with walletId: ${walletId}`) {
            throw new Error('Non-existant wallet');
        }
        if (res.data.msg === 'Insufficient Balance') {
            throw new Error('Insufficient Balance');
        }
        if (res.data.msg.startsWith('Insufficient funds for tokenId : ')) {
            throw new Error('Insufficient Balance');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return this.atomicSwapOfferRepeat(opts, walletId);
            }
            throw new Error('Reached Max Attempts');
        }
        return res.data;
    }
    /**
     * Accept an atomic swap
     * @public
     * @param {AtomicSwapAcceptOpts} opts Function Options
     * @param {string} [walletId] The wallet you want to use
     * @returns {Promise<RelysiaAtomicSwapAccept>}
     */
    async atomicSwapAccept(opts, walletId) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const headers = this.postHeaders;
        if (opts.length === 0) {
            throw new Error('No options provided');
        }
        if (walletId !== undefined) {
            headers.set('walletID', walletId);
        }
        let body = JSON.stringify({ dataArray: opts });
        const response = await fetch('https://api.relysia.com/v1/swap', {
            method: 'POST',
            headers,
            body,
        });
        const res = await response.json();
        if (res.data.msg === `Error while syncing with walletId: ${walletId}`) {
            throw new Error('Non-existant wallet');
        }
        if (res.data.msg === 'Insufficient Balance') {
            throw new Error('Insufficient Balance');
        }
        if (res.data.msg.startsWith('Insufficient funds for tokenId : ')) {
            throw new Error('Insufficient Balance');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            return this.atomicSwapAcceptRepeat(opts, walletId);
        }
        return res.data;
    }
    /**
     * @private
     * @param {AtomicSwapAcceptOpts} opts
     * @param {string} [walletId]
     * @returns {Promise<RelysiaAtomicSwapAccept>}
     */
    async atomicSwapAcceptRepeat(opts, walletId) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const headers = this.postHeaders;
        if (opts.length === 0) {
            throw new Error('No options provided');
        }
        if (walletId !== undefined) {
            headers.set('walletID', walletId);
        }
        let body = JSON.stringify({ dataArray: opts });
        const response = await fetch('https://api.relysia.com/v1/swap', {
            method: 'POST',
            headers,
            body,
        });
        const res = await response.json();
        if (res.data.msg === `Error while syncing with walletId: ${walletId}`) {
            throw new Error('Non-existant wallet');
        }
        if (res.data.msg === 'Insufficient Balance') {
            throw new Error('Insufficient Balance');
        }
        if (res.data.msg.startsWith('Insufficient funds for tokenId : ')) {
            throw new Error('Insufficient Balance');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return this.atomicSwapAccept(opts, walletId);
            }
            throw new Error('Reached Max Attempts');
        }
        return res.data;
    }
    /**
     * Allows you to inspect an atomic swap to check the validity of it
     * @public
     * @param {AtomicSwapAcceptOpts} opts The function options
     * @param {string} [walletId] The wallet you wish to use
     * @returns {Promise<any>}
     */
    async inspectAtomicSwap(opts, walletId) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }
        const headers = this.postHeaders;
        if (opts.length === 0) {
            throw new Error('No options provided');
        }
        let body = JSON.stringify({ dataArray: opts });
        const response = await fetch('https://api.relysia.com/v1/inspect', {
            method: 'POST',
            headers,
            body,
        });
        const res = await response.json();
        if (res.data.msg === 'Called reply with an invalid status code: ERR_OUT_OF_RANGE') {
            throw new Error('Invalid Atomic Swap Offer');
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            return this.inspectAtomicSwapRepeat(opts, walletId);
        }
        return res.data;
    }
    /**
     * @private
     * @param {AtomicSwapAcceptOpts} opts
     * @param {string} [walletId]
     * @returns {any}
     */
    async inspectAtomicSwapRepeat(opts, walletId) {
        const headers = this.postHeaders;
        if (opts.length === 0) {
            throw new Error('No options provided');
        }
        let body = JSON.stringify({ dataArray: opts });
        const response = await fetch('https://api.relysia.com/v1/inspect', {
            method: 'POST',
            headers,
            body,
        });
        const res = await response.json();
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return this.inspectAtomicSwapRepeat(opts, walletId);
            }
            throw new Error('Reached Max Attempts');
        }
        return res.data;
    }
}
exports.BetterRelysiaSDK = BetterRelysiaSDK;
/**
    * Authenticate with the Relysia API. Does not support OAuth.
 * @param {string} email Email address of the Relysia account
 * @param {string} password Password of the Relysia account
 * @param {number} [retries=20] Number of retries that requests should do
 * @returns {Promise<BetterRelysiaSDK>}
 */
async function authenticate(email, password, retries = 20) {
    const response = await fetch('https://api.relysia.com/v1/auth', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: postHeaders,
    });
    let toReturn = new BetterRelysiaSDK();
    toReturn.authTimestamp = Date.now();
    const body = await response.json();
    if (body.data.msg === 'INVALID_PASSWORD') {
        throw new Error('Incorrect Password');
    }
    if (body.data.msg === 'EMAIL_NOT_FOUND') {
        throw new Error('Account doesn\'t exist');
    }
    if (body.data.msg === "body/email must match format \"email\"") {
        throw new Error('Account doesn\'t exist');
    }
    toReturn.email = email;
    toReturn.password = password;
    toReturn.retries = retries;
    if (response.status !== 200) {
        return await authenticateAfterFail(email, password, retries, retries - 1);
    }
    toReturn.authToken = body.data.token;
    return toReturn;
}
/**
 * @param {string} email
 * @param {string} password
 * @param {number} retries
 * @param {number} retriesLeft
 * @returns {Promise<BetterRelysiaSDK>}
 */
async function authenticateAfterFail(email, password, retries, retriesLeft) {
    const response = await fetch('https://api.relysia.com/v1/auth', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: postHeaders,
    });
    let toReturn = new BetterRelysiaSDK();
    toReturn.authTimestamp = Date.now();
    const body = await response.json();
    if (body.data.msg === 'INVALID_PASSWORD') {
        throw new Error('Incorrect Password');
    }
    if (body.data.msg === 'EMAIL_NOT_FOUND') {
        throw new Error('Account doesn\'t exist');
    }
    if (body.data.msg === "body/email must match format \"email\"") {
        throw new Error('Account doesn\'t exist');
    }
    toReturn.email = email;
    toReturn.password = password;
    toReturn.retries = retries;
    if (response.status !== 200) {
        if (retriesLeft > 0) {
            return await authenticateAfterFail(email, password, retries, retriesLeft - 1);
        }
        else {
            throw new Error('Reached Max Attempts');
        }
    }
    toReturn.authToken = body.data.token;
    this.getHeaders.set('authToken', this.authToken);
    this.postHeaders.set('authToken', this.authToken);
    return toReturn;
}
const getHeaders = new Headers({ accept: 'application/json' });
const postHeaders = new Headers({ accept: 'application/json', 'Content-Type': 'application/json', });
