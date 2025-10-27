import { BetterRelysiaSDK } from "../object";
import { RelysiaSweep, RelysiaBasic, RawTxOpts, RelysiaRawTx, RelysiaAsm, AtomicSwapOfferOpts, RelysiaAtomicSwapOffer, AtomicSwapAcceptOpts, RelysiaAtomicSwapAccept, RelysiaAtomicSwapInspect, AtomicSwapWithIDOpts, RelysiaAtomicSwapWithID } from "../types";

export async function rawTx(this: BetterRelysiaSDK, opts: RawTxOpts): Promise<RelysiaRawTx> {
    this.retriesLeft = this.retries;

    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const headers: Headers = this.postHeaders;

    if (opts.walletID !== undefined) {
        headers.set('walletID', opts.walletID);
    }

    const body: BodyInit = JSON.stringify({ dataArray: opts.transfers });
    const response: Response = await fetch('https://api.relysia.com/v1/rawtx', {
        method: 'POST',
        headers,
        body,
    });

    const res: RelysiaBasic<RelysiaRawTx> = await response.json();

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

async function rawTxRepeat(this: BetterRelysiaSDK, opts: RawTxOpts): Promise<RelysiaRawTx> {
    const headers: Headers = this.postHeaders;

    if (opts.walletID !== undefined) {
        headers.set('walletID', opts.walletID);
    }

    const body: BodyInit = JSON.stringify({ dataArray: opts.transfers });
    const response: Response = await fetch('https://api.relysia.com/v1/rawtx', {
        method: 'POST',
        headers,
        body,
    });

    const res: RelysiaBasic<RelysiaRawTx> = await response.json();

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

export async function sweep(this: BetterRelysiaSDK, privateKey: string, walletID?: string): Promise<RelysiaSweep> {
    this.retriesLeft = this.retries;

    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const headers: Headers = this.postHeaders;

    if (walletID !== undefined) {
        headers.set('walletID', walletID);
    }

    const body: BodyInit = JSON.stringify({ privateKey });

    const response: Response = await fetch('https://api.relysia.com/v1/sweep', {
        method: 'POST',
        headers,
        body,
    });

    const res: RelysiaBasic<RelysiaSweep> = await response.json();

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

async function sweepRepeat(this: BetterRelysiaSDK, privateKey: string, walletID?: string): Promise<RelysiaSweep> {
    const headers: Headers = this.postHeaders;

    if (walletID !== undefined) {
        headers.set('walletID', walletID);
    }

    const body: BodyInit = JSON.stringify({ privateKey });

    const response: Response = await fetch('https://api.relysia.com/v1/sweep', {
        method: 'POST',
        headers,
        body,
    });

    const res: RelysiaBasic<RelysiaSweep> = await response.json();

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

export async function atomicSwapOffer(this: BetterRelysiaSDK, opts: AtomicSwapOfferOpts[], walletId: string): Promise<RelysiaAtomicSwapOffer> {
    this.retriesLeft = this.retries;

    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const headers: Headers = this.postHeaders;

    if (opts.length === 0) {
        throw new Error('No options provided');
    }

    for (var i = 0; i < opts.length; i++) {
        if (opts[i].tokenId === undefined && opts[i].wantedTokenId === undefined) throw new Error('Cannot swap BSV for BSV');
        if ((opts[i].sn !== undefined && opts[i].tokenId === undefined) || (opts[i].wantedSn !== undefined && opts[i].wantedTokenId === undefined)) throw new Error('Cannot pass serial number without passing token id');
        if (opts[i].amount === 0 || opts[i].wantedAmount === 0) throw new Error('Cannot set amount to 0');
    }

    if (walletId !== undefined) {
        headers.set('walletID', walletId);
    }

    let body: BodyInit = JSON.stringify({ dataArray: opts });

    const response: Response = await fetch('https://api.relysia.com/v1/offer', {
        method: 'POST',
        headers,
        body,
    });

    const res: RelysiaBasic<RelysiaAtomicSwapOffer> = await response.json();

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

async function atomicSwapOfferRepeat(this: BetterRelysiaSDK, opts: AtomicSwapOfferOpts[], walletId?: string): Promise<RelysiaAtomicSwapOffer> {
    const headers: Headers = this.postHeaders;

    if (opts.length === 0) {
        throw new Error('No options provided');
    }

    for (var i = 0; i < opts.length; i++) {
        if (opts[i].tokenId === undefined && opts[i].wantedTokenId === undefined) throw new Error('Cannot swap BSV for BSV');
        if ((opts[i].sn !== undefined && opts[i].tokenId === undefined) || (opts[i].wantedSn !== undefined && opts[i].wantedTokenId === undefined)) throw new Error('Cannot pass serial number without passing token id');
        if (opts[i].amount === 0 || opts[i].wantedAmount === 0) throw new Error('Cannot set amount to 0');
    }

    if (walletId !== undefined) {
        headers.set('walletID', walletId);
    }

    let body: BodyInit;

    body = JSON.stringify({ dataArray: opts });

    const response: Response = await fetch('https://api.relysia.com/v1/offer', {
        method: 'POST',
        headers,
        body,
    });

    const res: RelysiaBasic<RelysiaAtomicSwapOffer> = await response.json();

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

export async function atomicSwapAccept(this: BetterRelysiaSDK, opts: AtomicSwapAcceptOpts, walletId?: string): Promise<RelysiaAtomicSwapAccept> {
    this.retriesLeft = this.retries;

    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const headers: Headers = this.postHeaders;

    if (opts.length === 0) {
        throw new Error('No options provided');
    }

    if (walletId !== undefined) {
        headers.set('walletID', walletId);
    }

    let body: BodyInit = JSON.stringify({ dataArray: opts });

    const response: Response = await fetch('https://api.relysia.com/v1/swap', {
        method: 'POST',
        headers,
        body,
    });

    const res: RelysiaBasic<RelysiaAtomicSwapAccept> = await response.json();

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

async function atomicSwapAcceptRepeat(this: BetterRelysiaSDK, opts: AtomicSwapAcceptOpts, walletId?: string): Promise<RelysiaAtomicSwapAccept> {
    this.retriesLeft = this.retries;

    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const headers: Headers = this.postHeaders;

    if (opts.length === 0) {
        throw new Error('No options provided');
    }

    if (walletId !== undefined) {
        headers.set('walletID', walletId);
    }

    let body: BodyInit = JSON.stringify({ dataArray: opts });

    const response: Response = await fetch('https://api.relysia.com/v1/swap', {
        method: 'POST',
        headers,
        body,
    });

    const res: RelysiaBasic<RelysiaAtomicSwapAccept> = await response.json();

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

export async function asm(this: BetterRelysiaSDK, asm: string, amount: number, walletID?: string): Promise<RelysiaAsm> {
    this.retriesLeft = this.retries;

    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const headers: Headers = this.postHeaders;

    if (walletID !== undefined) {
        headers.set('walletID', walletID);
    }

    const body: BodyInit = JSON.stringify({
        dataArray: [
            {
                asm,
                amount,
            }
        ]
    });

    const response: Response = await fetch('https://api.relysia.com/v1/asm', {
        method: 'POST',
        headers,
        body,
    });

    const res: RelysiaBasic<RelysiaAsm> = await response.json();

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

async function asmRepeat(this: BetterRelysiaSDK, asm: string, amount: number, walletID?: string): Promise<RelysiaAsm> {
    const headers: Headers = this.postHeaders;

    if (walletID !== undefined) {
        headers.set('walletID', walletID);
    }

    const body: BodyInit = JSON.stringify({
        dataArray: [
            {
                asm,
                amount,
            }
        ]
    });

    const response: Response = await fetch('https://api.relysia.com/v1/asm', {
        method: 'POST',
        headers,
        body,
    });

    const res: RelysiaBasic<RelysiaAsm> = await response.json();

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

export async function atomicSwapWithId(this: BetterRelysiaSDK, opts: AtomicSwapWithIDOpts[], walletID?: string): Promise<RelysiaAtomicSwapWithID> {
    this.retriesLeft = this.retries;

    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const headers: Headers = this.postHeaders;

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

    const body: BodyInit = JSON.stringify({
        dataArray: opts
    });

    const response: Response = await fetch('https://api.relysia.com/v1/exchangeOffer', {
        method: 'POST',
        headers,
        body,
    });

    const res: RelysiaBasic<RelysiaAtomicSwapWithID> = await response.json();

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

async function atomicSwapWithIdRepeat(this: BetterRelysiaSDK, opts: AtomicSwapWithIDOpts[], walletID?: string): Promise<RelysiaAtomicSwapWithID> {
    const headers: Headers = this.postHeaders;

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

    const body: BodyInit = JSON.stringify({
        dataArray: opts
    });

    const response: Response = await fetch('https://api.relysia.com/v1/exchangeOffer', {
        method: 'POST',
        headers,
        body,
    });

    const res: RelysiaBasic<RelysiaAtomicSwapWithID> = await response.json();

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

export async function inspectAtomicSwap(this: BetterRelysiaSDK, opts: AtomicSwapAcceptOpts, walletId?: string) {
    this.retriesLeft = this.retries;

    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const headers: Headers = this.postHeaders;

    if (opts.length === 0) {
        throw new Error('No options provided');
    }

    let body: BodyInit = JSON.stringify({ dataArray: opts });

    const response: Response = await fetch('https://api.relysia.com/v1/inspect', {
        method: 'POST',
        headers,
        body,
    });

    const res: RelysiaBasic<RelysiaAtomicSwapInspect> = await response.json();

    if (res.data.msg === 'Called reply with an invalid status code: ERR_OUT_OF_RANGE') {
        throw new Error('Invalid Atomic Swap Offer');
    }

    if (response.status !== 200) {
        this.retriesLeft--;
        return inspectAtomicSwapRepeat.call(this, opts, walletId);
    }

    return res.data;
}

async function inspectAtomicSwapRepeat(this: BetterRelysiaSDK, opts: AtomicSwapAcceptOpts, walletId?: string) {
    const headers: Headers = this.postHeaders;

    if (opts.length === 0) {
        throw new Error('No options provided');
    }

    let body: BodyInit = JSON.stringify({ dataArray: opts });

    const response: Response = await fetch('https://api.relysia.com/v1/inspect', {
        method: 'POST',
        headers,
        body,
    });

    const res: RelysiaBasic<RelysiaAtomicSwapInspect> = await response.json();

    if (response.status !== 200) {
        this.retriesLeft--;
        if (this.retriesLeft > 0) {
            return inspectAtomicSwapRepeat.call(this, opts, walletId);
        }

        throw new Error('Reached Max Attempts');
    }

    return res.data;
}