"use strict";
/** @import { BetterRelysiaSDK } from '../object' */
/** @import { RelysiaSweep, RelysiaBasic, RawTxOpts, RelysiaRawTx, RelysiaAsm, AtomicSwapOfferOpts, RelysiaAtomicSwapOffer, AtomicSwapAcceptOpts, RelysiaAtomicSwapAccept, RelysiaAtomicSwapInspect, AtomicSwapWithIDOpts, RelysiaAtomicSwapWithID, RelysiaAcceptAtomicSwapWithID, RelysiaAtomicSwapDetails, PayInvoiceOpts } from '../types' */
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawTx = rawTx;
exports.sweep = sweep;
exports.atomicSwapOffer = atomicSwapOffer;
exports.atomicSwapAccept = atomicSwapAccept;
exports.asm = asm;
exports.atomicSwapWithId = atomicSwapWithId;
exports.acceptAtomicSwapWithId = acceptAtomicSwapWithId;
exports.payInvoice = payInvoice;
exports.inspectAtomicSwap = inspectAtomicSwap;
/**
 * @param {BetterRelysiaSDK} this
 * @param {RawTxOpts} opts
 * @returns {Promise<RelysiaRawTx>}
 */
async function rawTx(opts) {
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
        return rawTxRepeat.call(this, opts);
    }
    return res.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {RawTxOpts} opts
 * @returns {Promise<RelysiaRawTx>}
 */
async function rawTxRepeat(opts) {
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
            return rawTxRepeat.call(this, opts);
        }
        throw new Error('Reached Max Attempts');
    }
    return res.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} privateKey
 * @param {string} [walletID]
 * @returns {Promise<RelysiaSweep>}
 */
async function sweep(privateKey, walletID) {
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
        return sweepRepeat.call(this, privateKey, walletID);
    }
    return res.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} privateKey
 * @param {string} [walletID]
 * @returns {Promise<RelysiaSweep>}
 */
async function sweepRepeat(privateKey, walletID) {
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
            return sweepRepeat.call(this, privateKey, walletID);
        }
        throw new Error('Reached Max Attempts');
    }
    return res.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {AtomicSwapOfferOpts[]} opts
 * @param {string} walletId
 * @returns {Promise<RelysiaAtomicSwapOffer>}
 */
async function atomicSwapOffer(opts, walletId) {
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
        return atomicSwapOfferRepeat.call(this, opts, walletId);
    }
    return res.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {AtomicSwapOfferOpts[]} opts
 * @param {string} [walletId]
 * @returns {Promise<RelysiaAtomicSwapOffer>}
 */
async function atomicSwapOfferRepeat(opts, walletId) {
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
            return atomicSwapOfferRepeat.call(this, opts, walletId);
        }
        throw new Error('Reached Max Attempts');
    }
    return res.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {AtomicSwapAcceptOpts} opts
 * @param {string} [walletId]
 * @returns {Promise<RelysiaAtomicSwapAccept>}
 */
async function atomicSwapAccept(opts, walletId) {
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
        return atomicSwapAcceptRepeat.call(this, opts, walletId);
    }
    return res.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {AtomicSwapAcceptOpts} opts
 * @param {string} [walletId]
 * @returns {Promise<RelysiaAtomicSwapAccept>}
 */
async function atomicSwapAcceptRepeat(opts, walletId) {
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
            return atomicSwapAccept.call(this, opts, walletId);
        }
        throw new Error('Reached Max Attempts');
    }
    return res.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} asm
 * @param {number} amount
 * @param {string} [walletID]
 * @returns {Promise<RelysiaAsm>}
 */
async function asm(asm, amount, walletID) {
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
        return asmRepeat.call(this, asm, amount, walletID);
    }
    return res.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {string} asm
 * @param {number} amount
 * @param {string} [walletID]
 * @returns {Promise<RelysiaAsm>}
 */
async function asmRepeat(asm, amount, walletID) {
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
            return asmRepeat.call(this, asm, amount, walletID);
        }
        throw new Error('Reached Max Attempts');
    }
    return res.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {AtomicSwapWithIDOpts[]} opts
 * @param {string} [walletID]
 * @returns {Promise<RelysiaAtomicSwapWithID>}
 */
async function atomicSwapWithId(opts, walletID) {
    this.retriesLeft = this.retries;
    const verifyCheck = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }
    const headers = this.postHeaders;
    if (walletID !== undefined) {
        headers.set('walletID', walletID);
    }
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].payment.length > 2) {
            throw new Error('Provided more than 2 additional payments');
        }
        if (opts[i].payment !== undefined && (opts[i].payment[0].tokenId !== undefined || opts[i].payment[1].tokenId !== undefined)) {
            throw new Error('Additional payments can only be made with BSV');
        }
    }
    const body = JSON.stringify({
        dataArray: opts
    });
    const response = await fetch('https://api.relysia.com/v1/exchangeOffer', {
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
    if (res.data.msg.startsWith('Insufficient funds for tokenId : ')) {
        throw new Error('Insufficient Balance');
    }
    if (res.data.msg.startsWith('NFT does not exist with ')) {
        throw new Error('Token does not exist');
    }
    if (response.status !== 200) {
        this.retriesLeft--;
        return atomicSwapWithIdRepeat.call(this, opts, walletID);
    }
    return res.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {AtomicSwapWithIDOpts[]} opts
 * @param {string} [walletID]
 * @returns {Promise<RelysiaAtomicSwapWithID>}
 */
async function atomicSwapWithIdRepeat(opts, walletID) {
    const headers = this.postHeaders;
    if (walletID !== undefined) {
        headers.set('walletID', walletID);
    }
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].payment.length > 2) {
            throw new Error('Provided more than 2 additional payments');
        }
        if (opts[i].payment !== undefined && (opts[i].payment[0].tokenId !== undefined || opts[i].payment[1].tokenId !== undefined)) {
            throw new Error('Additional payments can only be made with BSV');
        }
    }
    const body = JSON.stringify({
        dataArray: opts
    });
    const response = await fetch('https://api.relysia.com/v1/exchangeOffer', {
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
    if (res.data.msg.startsWith('Insufficient funds for tokenId : ')) {
        throw new Error('Insufficient Balance');
    }
    if (res.data.msg.startsWith('NFT does not exist with ')) {
        throw new Error('Token does not exist');
    }
    if (response.status !== 200) {
        this.retriesLeft--;
        if (this.retriesLeft > 0) {
            return atomicSwapWithIdRepeat.call(this, opts, walletID);
        }
        throw new Error('Reached Max Attempts');
    }
    return res.data;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {string[]} ids
 * @param {string} [walletID]
 * @returns {Promise<string[]>}
 */
async function acceptAtomicSwapWithId(ids, walletID) {
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
        dataArray: ids.map(swapId => ({ swapId }))
    });
    const response = await fetch('https://api.relysia.com/v1/exchangeSwap', {
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
    if (res.data.msg.startsWith('Insufficient funds for tokenId : ')) {
        throw new Error('Insufficient Balance');
    }
    if (response.status !== 200) {
        this.retriesLeft--;
        return acceptAtomicSwapWithIdRepeat.call(this, ids, walletID);
    }
    return res.data.txIds;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {string[]} ids
 * @param {string} [walletID]
 * @returns {Promise<string[]>}
 */
async function acceptAtomicSwapWithIdRepeat(ids, walletID) {
    const headers = this.postHeaders;
    if (walletID !== undefined) {
        headers.set('walletID', walletID);
    }
    const body = JSON.stringify({
        dataArray: ids.map(swapId => ({ swapId }))
    });
    const response = await fetch('https://api.relysia.com/v1/exchangeSwap', {
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
    if (res.data.msg.startsWith('Insufficient funds for tokenId : ')) {
        throw new Error('Insufficient Balance');
    }
    if (response.status !== 200) {
        this.retriesLeft--;
        if (this.retriesLeft > 0) {
            return acceptAtomicSwapWithIdRepeat.call(this, ids, walletID);
        }
        throw new Error('Reached Max Attempts');
    }
    return res.data.txIds;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {PayInvoiceOpts} opts
 * @param {string} [walletID]
 * @returns {Promise<string>}
 */
async function payInvoice(opts, walletID) {
    this.retriesLeft = this.retries;
    const verifyCheck = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }
    const headers = this.postHeaders;
    if (walletID !== undefined) {
        headers.set('walletID', walletID);
    }
    const body = JSON.stringify(opts);
    const response = await fetch('https://api.relysia.com/v1/pay', {
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
        return payInvoiceRepeat.call(this, opts, walletID);
    }
    return res.data.txid;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {PayInvoiceOpts} opts
 * @param {string} [walletID]
 * @returns {Promise<string>}
 */
async function payInvoiceRepeat(opts, walletID) {
    this.retriesLeft = this.retries;
    const verifyCheck = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }
    const headers = this.postHeaders;
    if (walletID !== undefined) {
        headers.set('walletID', walletID);
    }
    const body = JSON.stringify(opts);
    const response = await fetch('https://api.relysia.com/v1/pay', {
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
            return payInvoiceRepeat.call(this, opts, walletID);
        }
        throw new Error('Reached Max Attempts');
    }
    return res.data.txid;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {AtomicSwapAcceptOpts} opts
 * @param {string} [walletId]
 * @returns {Promise<RelysiaAtomicSwapDetails[]>}
 */
async function inspectAtomicSwap(opts, walletId) {
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
    const response = await fetch('https://api.relysia.com/v2/inspect', {
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
        return inspectAtomicSwapRepeat.call(this, opts, walletId);
    }
    return res.data.offerDetails;
}
/**
 * @param {BetterRelysiaSDK} this
 * @param {AtomicSwapAcceptOpts} opts
 * @param {string} [walletId]
 * @returns {Promise<RelysiaAtomicSwapDetails[]>}
 */
async function inspectAtomicSwapRepeat(opts, walletId) {
    const headers = this.postHeaders;
    if (opts.length === 0) {
        throw new Error('No options provided');
    }
    let body = JSON.stringify({ dataArray: opts });
    const response = await fetch('https://api.relysia.com/v2/inspect', {
        method: 'POST',
        headers,
        body,
    });
    const res = await response.json();
    if (response.status !== 200) {
        this.retriesLeft--;
        if (this.retriesLeft > 0) {
            return inspectAtomicSwapRepeat.call(this, opts, walletId);
        }
        throw new Error('Reached Max Attempts');
    }
    return res.data.offerDetails;
}
