"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.BetterRelysiaSDK = void 0;
class BetterRelysiaSDK {
    authToken;
    authTimestamp;
    email;
    password;
    retries;
    retriesLeft;
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
            headers: new Headers({ accept: 'application/json', 'Content-Type': 'application/json', }),
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
    }
    /**
     * Gets the user profile from Relysia.
     * @public
     * @returns {Promise<RelysiaUserProfileData | 'Reached Max Attempts'>}
     */
    async getUserProfile() {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            return 'Reached Max Attempts';
        }
        const response = await fetch('https://api.relysia.com/v1/user', {
            method: 'GET',
            headers: new Headers({ accept: 'application/json', authToken: this.authToken }),
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
     * @returns {Promise<RelysiaUserProfileData | 'Reached Max Attempts'>}
     */
    async getUserProfileRepeat() {
        const response = await fetch('https://api.relysia.com/v1/user', {
            method: 'GET',
            headers: new Headers({ accept: 'application/json', authToken: this.authToken }),
        });
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return await this.getUserProfileRepeat();
            }
            return 'Reached Max Attempts';
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
     * @returns {Promise<"Reached Max Attempts" | "Invalid Mnemonic!" | "Paymail in incorrect format!" | "Invalid wallet type!" | "Not a URL!" | RelysiaCreateWallet>}
     */
    async createWallet(walletTitle, opt) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            return 'Reached Max Attempts';
        }
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
            walletTitle,
        });
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
            return 'Invalid Mnemonic!';
        }
        else if (body.data.msg === "please write correct paymail, 'example@relysia.com'") {
            return 'Paymail in incorrect format!';
        }
        else if (body.data.msg === 'we support only "STANDARD or ESCROW" wallet type !') {
            return 'Invalid wallet type!';
        }
        else if (body.data.msg === 'headers/walletlogo must match format "uri"') {
            return 'Not a URL!';
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
     * @returns {Promise<"Reached Max Attempts" | "Invalid Mnemonic!" | "Paymail in incorrect format!" | "Invalid wallet type!" | "Not a URL!" | RelysiaCreateWallet>}
     */
    async createWalletRepeat(walletTitle, opt) {
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
            walletTitle,
        });
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
            return 'Invalid Mnemonic!';
        }
        else if (body.data.msg === "please write correct paymail, 'example@relysia.com'") {
            return 'Paymail in incorrect format!';
        }
        else if (body.data.msg === 'we support only "STANDARD or ESCROW" wallet type !') {
            return 'Invalid wallet type!';
        }
        else if (body.data.msg === 'headers/walletlogo must match format "uri"') {
            return 'Not a URL!';
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return await this.createWalletRepeat(walletTitle, opt);
            }
            return 'Reached Max Attempts';
        }
        return body.data;
    }
    /**
     * Get an address and the paymail for a specified wallet.
     * @public
     * @param {string} [walletId] The Wallet ID that you wish to get the address for. Defaults to default wallet if not specified
     * @returns {Promise<RelysiaGetAddress | 'Reached Max Attempts' | 'Non-existant wallet'>}
     */
    async getAddress(walletId) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            return 'Reached Max Attempts';
        }
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
        if (walletId !== undefined) {
            headers.set('walletId', walletId);
        }
        const response = await fetch('https://api.relysia.com/v1/address', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === `Error while syncing with walletId: ${walletId}`) {
            return 'Non-existant wallet';
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
     * @returns {Promise<RelysiaGetAddress | 'Reached Max Attempts' | 'Non-existant wallet'>}
     */
    async getAddressRepeat(walletId) {
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
        if (walletId !== undefined) {
            headers.set('walletId', walletId);
        }
        const response = await fetch('https://api.relysia.com/v1/address', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === `Error while syncing with walletId: ${walletId}`) {
            return 'Non-existant wallet';
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retries > 0) {
                return await this.getAddressRepeat(walletId);
            }
            return 'Reached Max Attempts';
        }
        return body.data;
    }
    /**
     * Get all addresses related to your wallet.
     * @public
     * @param {string} [walletId] Wallet ID of the wallet you want to use. Leave blank to use default wallet
     * @returns {Promise<RelysiaGetAllAddress | 'Reached Max Attempts' | 'Non-existant wallet'>}
     */
    async getAllAddressess(walletId) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            return 'Reached Max Attempts';
        }
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
        if (walletId !== undefined) {
            headers.set('walletId', walletId);
        }
        const response = await fetch('https://api.relysia.com/v1/allAddresses', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === `Error while syncing with walletId: ${walletId}`) {
            return 'Non-existant wallet';
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
     * @returns {Promise<RelysiaGetAllAddress | 'Reached Max Attempts' | 'Non-existant wallet'>}
     */
    async getAllAddressessRepeat(walletId) {
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
        if (walletId !== undefined) {
            headers.set('walletId', walletId);
        }
        const response = await fetch('https://api.relysia.com/v1/allAddresses', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === `Error while syncing with walletId: ${walletId}`) {
            return 'Non-existant wallet';
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return await this.getAllAddressessRepeat(walletId);
            }
            return 'Reached Max Attempts';
        }
        return body.data;
    }
    /**
     * Gets the leaderboard of those who hold a particular STAS token.
     * @public
     * @param {string} tokenId The token id of the token you wish to query.
     * @param {number} [nextPageToken] The next page token given by a previous response.
     * @returns {Promise<RelysiaLeaderboard | 'Reached Max Attempts' | 'Invalid Token ID!' | 'No entries in leaderboard'>}
     */
    async leaderboard(tokenId, nextPageToken) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            return 'Reached Max Attempts';
        }
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
            tokenId,
        });
        if (nextPageToken !== undefined) {
            headers.set('nextPageToken', nextPageToken.toString());
        }
        const response = await fetch('https://api.relysia.com/v1/leaderboard', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === 'invalid tokenId or sn !') {
            return 'Invalid Token ID!';
        }
        if (body.data.leaderboard.length === 0) {
            return 'No entries in leaderboard';
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
     * @returns {Promise<RelysiaLeaderboard | 'Reached Max Attempts' | 'Invalid Token ID!' | 'No entries in leaderboard'>}
     */
    async leaderboardRepeat(tokenId, nextPageToken) {
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
            tokenId,
        });
        if (nextPageToken !== undefined) {
            headers.set('nextPageToken', nextPageToken.toString());
        }
        const response = await fetch('https://api.relysia.com/v1/leaderboard', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === 'invalid tokenId or sn !') {
            return 'Invalid Token ID!';
        }
        if (body.data.leaderboard.length === 0) {
            return 'No entries in leaderboard';
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return await this.leaderboardRepeat(tokenId, nextPageToken);
            }
            return 'Reached Max Attempts';
        }
        return body.data;
    }
    /**
     * Gets all wallets in the Relysia account.
     * @public
     * @returns {Promise<RelysiaWallets | 'Reached Max Attempts'>}
     */
    async wallets() {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            return 'Reached Max Attempts';
        }
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
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
     * @returns {Promise<RelysiaWallets | 'Reached Max Attempts'>}
     */
    async walletsRepeat() {
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
        const response = await fetch('https://api.relysia.com/v1/wallets', {
            method: 'GET',
            headers,
        });
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return await this.walletsRepeat();
            }
            return 'Reached Max Attempts';
        }
        const body = await response.json();
        return body.data;
    }
    /** Gets the mnemonic of a wallet
     * @public
     * @param {string} [walletId] Wallet ID of the wallet you want to use. Leave blank to use default wallet
     * @returns {Promise<RelysiaMnemonic | 'Reached Max Attempts' | 'Non-existant wallet'>}
     */
    async mnemonic(walletId) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            return 'Reached Max Attempts';
        }
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
        if (walletId !== undefined) {
            headers.set('walletId', walletId);
        }
        const response = await fetch('https://api.relysia.com/v1/mnemonic', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === `Error while syncing with walletId: ${walletId}`) {
            return 'Non-existant wallet';
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
     * @returns {Promise<RelysiaMnemonic | 'Reached Max Attempts' | 'Non-existant wallet'>}
     */
    async mnemonicRepeat(walletId) {
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
        if (walletId !== undefined) {
            headers.set('walletId', walletId);
        }
        const response = await fetch('https://api.relysia.com/v1/mnemonic', {
            method: 'GET',
            headers,
        });
        const body = await response.json();
        if (body.data.msg === `Error while syncing with walletId: ${walletId}`) {
            return 'Non-existant wallet';
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return await this.mnemonicRepeat(walletId);
            }
            return 'Reached Max Attempts';
        }
        return body.data;
    }
    /**
     * Get the balance of the specified wallet
     * @public
     * @param {BalanceOpts} [opts] Optional options to pass to the endpoint
     * @returns {Promise<RelysiaBalance | 'Reached Max Attempts' | 'Non-existant wallet' | 'Invalid nextPageToken' | 'Invalid Currency'>}
     */
    async balance(opts) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            return 'Reached Max Attempts';
        }
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
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
                return 'Non-existant wallet';
            }
            if (body.data.msg === 'Called reply with an invalid status code: 5107200') {
                return 'Invalid nextPageToken';
            }
            if (body.data.msg === `we are not supporting ${opts.currency.toUpperCase()} as a currency`) {
                return 'Invalid Currency';
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
     * @returns {Promise<RelysiaBalance | 'Reached Max Attempts' | 'Non-existant wallet' | 'Invalid nextPageToken' | 'Invalid Currency'>}
     */
    async balanceRepeat(opts) {
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
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
                return 'Non-existant wallet';
            }
            if (body.data.msg === 'Called reply with an invalid status code: 5107200') {
                return 'Invalid nextPageToken';
            }
            if (body.data.msg === `we are not supporting ${opts.currency.toUpperCase()} as a currency`) {
                return 'Invalid Currency';
            }
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return this.balanceRepeat(opts);
            }
            return 'Reached Max Attempts';
        }
        return body.data;
    }
    /**
     * Get wallet history
     * @public
     * @param {HistoryOpts} [opts] Optional options to pass
     * @returns {Promise<RelysiaHistory | 'Reached Max Attempts' | 'Non-existant wallet'>}
     */
    async history(opts) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            return 'Reached Max Attempts';
        }
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
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
                return 'Non-existant wallet';
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
     * @returns {Promise<RelysiaHistory | 'Reached Max Attempts' | 'Non-existant wallet'>}
     */
    async historyRepeat(opts) {
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
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
                return 'Non-existant wallet';
            }
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return this.historyRepeat(opts);
            }
            return 'Reached Max Attempts';
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
            return 'Reached Max Attempts';
        }
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
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
            return 'Non-existant wallet';
        }
        if (res.data.msg === 'Not a valid private key value !') {
            return 'Not a valid private key';
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
     * @returns {Promise<RelysiaSweep | 'Reached Max Attempts' | 'Non-existant wallet' | 'Not a valid private key'>}
     */
    async sweepRepeat(privateKey, walletID) {
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
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
            return 'Non-existant wallet';
        }
        if (res.data.msg === 'Not a valid private key value !') {
            return 'Not a valid private key';
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return this.sweepRepeat(privateKey, walletID);
            }
        }
        return res.data;
    }
    /**
     * Create a raw transaction
     * @public
     * @param {RawTxOpts} opts Function Options
     * @returns {Promise<RelysiaRawTx | 'Reached Max Attempts' | 'Non-existant wallet' | 'Insufficient Balance'>}
     */
    async rawTx(opts) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            return 'Reached Max Attempts';
        }
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
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
            return 'Non-existant wallet';
        }
        if (res.data.msg === 'Insufficient Balance') {
            return 'Insufficient Balance';
        }
        if (res.data.msg.startsWith('Insufficient funds for tokenId : ')) {
            return 'Insufficient Balance';
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
     * @returns {Promise<RelysiaRawTx | 'Reached Max Attempts' | 'Non-existant wallet' | 'Insufficient Balance'>}
     */
    async rawTxRepeat(opts) {
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
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
            return 'Non-existant wallet';
        }
        if (res.data.msg === 'Insufficient Balance') {
            return 'Insufficient Balance';
        }
        if (res.data.msg.startsWith('Insufficient funds for tokenId : ')) {
            return 'Insufficient Balance';
        }
        if (res.statusCode !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return this.rawTxRepeat(opts);
            }
            return 'Reached Max Attempts';
        }
        return res.data;
    }
    /**
     * Make a transaction with a custom script. Relatively limited and should be avoided where possible
     * @public
     * @param {string} asm The custom bitcoin script to be added as an output
     * @param {number} amount The amount of BSV to lock in the script
     * @param {string} [walletID] The wallet you want to use
     * @returns {Promise<RelysiaAsm | 'Reached Max Attempts' | 'Non-existant wallet' | 'Insufficient Balance'>}
     */
    async asm(asm, amount, walletID) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            return 'Reached Max Attempts';
        }
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
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
            return 'Non-existant wallet';
        }
        if (res.data.msg === 'Insufficient Balance') {
            return 'Insufficient Balance';
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
     * @returns {Promise<RelysiaAsm | 'Reached Max Attempts' | 'Non-existant wallet' | 'Insufficient Balance'>}
     */
    async asmRepeat(asm, amount, walletID) {
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
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
            return 'Non-existant wallet';
        }
        if (res.data.msg === 'Insufficient Balance') {
            return 'Insufficient Balance';
        }
        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return this.asmRepeat(asm, amount, walletID);
            }
            return 'Reached Max Attempts';
        }
        return res.data;
    }
    /**
     * Dissolve a token for satoshis
     * @public
     * @param {string} tokenId The token you wish to redeem
     * @param {number} amount How much you wish to redeem
     * @param {RedeemOpts} [opts] Additional options
     * @returns {Promise<RelysiaRedeem | 'Reached Max Attempts' | 'Non-existant wallet' | 'Insufficient Balance'>}
     */
    async redeemToken(tokenId, amount, opts) {
        this.retriesLeft = this.retries;
        const verifyCheck = await this.checkAuth();
        if (verifyCheck === false) {
            return 'Reached Max Attempts';
        }
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
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
            return 'Non-existant wallet';
        }
        if (res.data.msg === 'Insufficient Balance') {
            return 'Insufficient Balance';
        }
        if (res.data.msg.startsWith('Insufficient funds for tokenId : ')) {
            return 'Insufficient Balance';
        }
        if (response.status !== undefined) {
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
     * @returns {Promise<RelysiaRedeem | 'Reached Max Attempts' | 'Non-existant wallet' | 'Insufficient Balance'>}
     */
    async redeemTokenRepeat(tokenId, amount, opts) {
        const headers = new Headers({
            accept: 'application/json',
            authToken: this.authToken,
        });
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
            return 'Non-existant wallet';
        }
        if (res.data.msg === 'Insufficient Balance') {
            return 'Insufficient Balance';
        }
        if (res.data.msg.startsWith('Insufficient funds for tokenId : ')) {
            return 'Insufficient Balance';
        }
        if (response.status !== undefined) {
            this.retriesLeft--;
            if (this.retriesLeft > 0) {
                return this.redeemTokenRepeat(tokenId, amount, opts);
            }
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
 * @returns {Promise<'Incorrect Password' | BetterRelysiaSDK | 'Account doesn\'t exist'>}
 */
async function authenticate(email, password, retries = 20) {
    const response = await fetch('https://api.relysia.com/v1/auth', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: new Headers({ accept: 'application/json', 'Content-Type': 'application/json', }),
    });
    let toReturn = new BetterRelysiaSDK();
    toReturn.authTimestamp = Date.now();
    const body = await response.json();
    if (body.data.msg === 'INVALID_PASSWORD') {
        return 'Incorrect Password';
    }
    if (body.data.msg === 'EMAIL_NOT_FOUND') {
        return 'Account doesn\'t exist';
    }
    if (body.data.msg === "body/email must match format \"email\"") {
        return 'Account doesn\'t exist';
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
exports.authenticate = authenticate;
/**
 * @param {string} email
 * @param {string} password
 * @param {number} retries
 * @param {number} retriesLeft
 * @returns {Promise<'Incorrect Password' | BetterRelysiaSDK | 'Account doesn\'t exist'>}
 */
async function authenticateAfterFail(email, password, retries, retriesLeft) {
    const response = await fetch('https://api.relysia.com/v1/auth', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: new Headers({ accept: 'application/json', 'Content-Type': 'application/json', }),
    });
    let toReturn = new BetterRelysiaSDK();
    toReturn.authTimestamp = Date.now();
    const body = await response.json();
    if (body.data.msg === 'INVALID_PASSWORD') {
        return 'Incorrect Password';
    }
    if (body.data.msg === 'EMAIL_NOT_FOUND') {
        return 'Account doesn\'t exist';
    }
    if (body.data.msg === "body/email must match format \"email\"") {
        return 'Account doesn\'t exist';
    }
    toReturn.email = email;
    toReturn.password = password;
    toReturn.retries = retries;
    if (response.status !== 200) {
        if (retriesLeft > 0) {
            return await authenticateAfterFail(email, password, retries, retriesLeft - 1);
        }
        else {
            return undefined;
        }
    }
    toReturn.authToken = body.data.token;
    return toReturn;
}
