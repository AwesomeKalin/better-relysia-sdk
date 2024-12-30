"use strict";
/** @import { BetterRelysiaSDK } from '../object' */
/** @import { BalanceOpts, CreateWalletOpt, HistoryOpts, RelysiaBalance, RelysiaBasic, RelysiaCreateWallet, RelysiaGetAddress, RelysiaGetAllAddress, RelysiaHistory, RelysiaLeaderboard, RelysiaMnemonic, RelysiaWallets } from '../types' */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWallet = createWallet;
exports.getAddress = getAddress;
exports.getAllAddressess = getAllAddressess;
exports.leaderboard = leaderboard;
exports.wallets = wallets;
exports.mnemonic = mnemonic;
exports.balance = balance;
exports.history = history;
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} walletTitle
 * @param {CreateWalletOpt} [opt]
 * @returns {Promise<any>}
 */
async function createWallet(walletTitle, opt) {
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
        return createWalletRepeat.call(this, walletTitle, opt);
    }
    return body.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} walletTitle
 * @param {CreateWalletOpt} [opt]
 * @returns {Promise<any>}
 */
async function createWalletRepeat(walletTitle, opt) {
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
            return createWalletRepeat.call(this, walletTitle, opt);
        }
        throw new Error('Reached Max Attempts');
    }
    return body.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} [walletId]
 * @returns {Promise<RelysiaGetAddress>}
 */
async function getAddress(walletId) {
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
        return getAddressRepeat.call(this, walletId);
    }
    return body.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} [walletId]
 * @returns {Promise<RelysiaGetAddress>}
 */
async function getAddressRepeat(walletId) {
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
            return getAddressRepeat.call(this, walletId);
        }
        throw new Error('Reached Max Attempts');
    }
    return body.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} [walletId]
 * @returns {Promise<RelysiaGetAllAddress>}
 */
async function getAllAddressess(walletId) {
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
        return getAllAddressessRepeat.call(this, walletId);
    }
    return body.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} [walletId]
 * @returns {Promise<RelysiaGetAllAddress>}
 */
async function getAllAddressessRepeat(walletId) {
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
            return getAllAddressessRepeat.call(this, walletId);
        }
        throw new Error('Reached Max Attempts');
    }
    return body.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} tokenId
 * @param {number} [nextPageToken]
 * @returns {Promise<RelysiaLeaderboard>}
 */
async function leaderboard(tokenId, nextPageToken) {
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
        return leaderboardRepeat.call(this, tokenId, nextPageToken);
    }
    return body.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} tokenId
 * @param {number} [nextPageToken]
 * @returns {Promise<RelysiaLeaderboard>}
 */
async function leaderboardRepeat(tokenId, nextPageToken) {
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
            return leaderboardRepeat.call(this, tokenId, nextPageToken);
        }
        throw new Error('Reached Max Attempts');
    }
    return body.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @returns {Promise<RelysiaWallets>}
 */
async function wallets() {
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
        return walletsRepeat.call(this);
    }
    const body = await response.json();
    return body.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @returns {Promise<RelysiaWallets>}
 */
async function walletsRepeat() {
    const headers = this.getHeaders;
    const response = await fetch('https://api.relysia.com/v1/wallets', {
        method: 'GET',
        headers,
    });
    if (response.status !== 200) {
        this.retriesLeft--;
        if (this.retriesLeft > 0) {
            return walletsRepeat.call(this);
        }
        throw new Error('Reached Max Attempts');
    }
    const body = await response.json();
    return body.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} [walletId]
 * @returns {Promise<RelysiaMnemonic>}
 */
async function mnemonic(walletId) {
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
        return mnemonicRepeat.call(this, walletId);
    }
    return body.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} [walletId]
 * @returns {Promise<RelysiaMnemonic>}
 */
async function mnemonicRepeat(walletId) {
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
            return mnemonicRepeat.call(this, walletId);
        }
        throw new Error('Reached Max Attempts');
    }
    return body.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {BalanceOpts} [opts]
 * @returns {Promise<RelysiaBalance>}
 */
async function balance(opts) {
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
        return balanceRepeat.call(this, opts);
    }
    return body.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {BalanceOpts} [opts]
 * @returns {Promise<RelysiaBalance>}
 */
async function balanceRepeat(opts) {
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
            return balanceRepeat.call(this, opts);
        }
        throw new Error('Reached Max Attempts');
    }
    return body.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {HistoryOpts} [opts]
 * @returns {Promise<RelysiaHistory>}
 */
async function history(opts) {
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
        return historyRepeat.call(this, opts);
    }
    return body.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {HistoryOpts} [opts]
 * @returns {Promise<RelysiaHistory>}
 */
async function historyRepeat(opts) {
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
            return historyRepeat.call(this, opts);
        }
        throw new Error('Reached Max Attempts');
    }
    return body.data;
}
