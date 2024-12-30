import { BetterRelysiaSDK } from "../object";
import { BalanceOpts, CreateWalletOpt, HistoryOpts, RelysiaBalance, RelysiaBasic, RelysiaCreateWallet, RelysiaGetAddress, RelysiaGetAllAddress, RelysiaHistory, RelysiaLeaderboard, RelysiaMnemonic, RelysiaWallets } from "../types";

export async function createWallet(this: BetterRelysiaSDK, walletTitle: string, opt?: CreateWalletOpt) {
    this.retriesLeft = this.retries;

    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const headers: Headers = this.getHeaders
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

    const response: Response = await fetch('https://api.relysia.com/v1/createWallet', {
        method: 'GET',
        headers,
    });

    const body: RelysiaBasic<RelysiaCreateWallet> = await response.json();

    if (body.data.msg === 'invalid mnemonic phrase') {
        throw new Error('Invalid Mnemonic');
    } else if (body.data.msg === "please write correct paymail, 'example@relysia.com'") {
        throw new Error('Paymail in incorrect format');
    } else if (body.data.msg === 'we support only "STANDARD or ESCROW" wallet type !') {
        throw new Error('Invalid wallet type');
    } else if (body.data.msg === 'headers/walletlogo must match format "uri"') {
        throw new Error('Not a URL');
    }

    if (response.status !== 200) {
        this.retriesLeft--;
        return createWalletRepeat.call(this, walletTitle, opt);
    }

    return body.data;
}

async function createWalletRepeat(this: BetterRelysiaSDK, walletTitle: string, opt?: CreateWalletOpt) {
    const headers: Headers = this.getHeaders
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

    const response: Response = await fetch('https://api.relysia.com/v1/createWallet', {
        method: 'GET',
        headers,
    });

    const body: RelysiaBasic<RelysiaCreateWallet> = await response.json();

    if (body.data.msg === 'invalid mnemonic phrase') {
        throw new Error('Invalid Mnemonic');
    } else if (body.data.msg === "please write correct paymail, 'example@relysia.com'") {
        throw new Error('Paymail in incorrect format');
    } else if (body.data.msg === 'we support only "STANDARD or ESCROW" wallet type !') {
        throw new Error('Invalid wallet type');
    } else if (body.data.msg === 'headers/walletlogo must match format "uri"') {
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

export async function getAddress(this: BetterRelysiaSDK, walletId?: string): Promise<RelysiaGetAddress> {
    this.retriesLeft = this.retries;

    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const headers: Headers = this.getHeaders;

    if (walletId !== undefined) {
        headers.set('walletId', walletId);
    }

    const response: Response = await fetch('https://api.relysia.com/v1/address', {
        method: 'GET',
        headers,
    });

    const body: RelysiaBasic<RelysiaGetAddress> = await response.json();

    if (body.data.msg === `Error while syncing with walletId: ${walletId}`) {
        throw new Error('Non-existant wallet');
    }

    if (response.status !== 200) {
        this.retriesLeft--;
        return getAddressRepeat.call(this, walletId);
    }

    return body.data;
}

async function getAddressRepeat(this: BetterRelysiaSDK, walletId?: string): Promise<RelysiaGetAddress> {
    const headers: Headers = this.getHeaders;

    if (walletId !== undefined) {
        headers.set('walletId', walletId);
    }

    const response: Response = await fetch('https://api.relysia.com/v1/address', {
        method: 'GET',
        headers,
    });

    const body: RelysiaBasic<RelysiaGetAddress> = await response.json();

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

export async function getAllAddressess(this: BetterRelysiaSDK, walletId?: string): Promise<RelysiaGetAllAddress> {
    this.retriesLeft = this.retries;

    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const headers: Headers = this.getHeaders;

    if (walletId !== undefined) {
        headers.set('walletId', walletId);
    }

    const response: Response = await fetch('https://api.relysia.com/v1/allAddresses', {
        method: 'GET',
        headers,
    });

    const body: RelysiaBasic<RelysiaGetAllAddress> = await response.json();

    if (body.data.msg === `Error while syncing with walletId: ${walletId}`) {
        throw new Error('Non-existant wallet');
    }

    if (response.status !== 200) {
        this.retriesLeft--;
        return getAllAddressessRepeat.call(this, walletId);
    }

    return body.data;
}

async function getAllAddressessRepeat(this: BetterRelysiaSDK, walletId?: string): Promise<RelysiaGetAllAddress> {
    const headers: Headers = this.getHeaders;

    if (walletId !== undefined) {
        headers.set('walletId', walletId);
    }

    const response: Response = await fetch('https://api.relysia.com/v1/allAddresses', {
        method: 'GET',
        headers,
    });

    const body: RelysiaBasic<RelysiaGetAllAddress> = await response.json();

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

export async function leaderboard(this: BetterRelysiaSDK, tokenId: string, nextPageToken?: number): Promise<RelysiaLeaderboard> {
    this.retriesLeft = this.retries;

    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const headers: Headers = this.getHeaders;
    headers.set('tokenId', tokenId);

    if (nextPageToken !== undefined) {
        headers.set('nextPageToken', nextPageToken.toString());
    }

    const response: Response = await fetch('https://api.relysia.com/v1/leaderboard', {
        method: 'GET',
        headers,
    });

    const body: RelysiaBasic<RelysiaLeaderboard> = await response.json();

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

async function leaderboardRepeat(this: BetterRelysiaSDK, tokenId: string, nextPageToken?: number): Promise<RelysiaLeaderboard> {
    const headers: Headers = this.getHeaders;
    headers.set('tokenId', tokenId);

    if (nextPageToken !== undefined) {
        headers.set('nextPageToken', nextPageToken.toString());
    }

    const response: Response = await fetch('https://api.relysia.com/v1/leaderboard', {
        method: 'GET',
        headers,
    });

    const body: RelysiaBasic<RelysiaLeaderboard> = await response.json();

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

export async function wallets(this: BetterRelysiaSDK): Promise<RelysiaWallets> {
    this.retriesLeft = this.retries;

    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const headers: Headers = this.getHeaders;

    const response: Response = await fetch('https://api.relysia.com/v1/wallets', {
        method: 'GET',
        headers,
    });

    if (response.status !== 200) {
        this.retriesLeft--
        return walletsRepeat.call(this);
    }

    const body: RelysiaBasic<RelysiaWallets> = await response.json();

    return body.data;
}

async function walletsRepeat(this: BetterRelysiaSDK): Promise<RelysiaWallets> {
    const headers: Headers = this.getHeaders;

    const response: Response = await fetch('https://api.relysia.com/v1/wallets', {
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

    const body: RelysiaBasic<RelysiaWallets> = await response.json();

    return body.data;
}

export async function mnemonic(this: BetterRelysiaSDK, walletId?: string): Promise<RelysiaMnemonic> {
    this.retriesLeft = this.retries;

    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const headers: Headers = this.getHeaders;

    if (walletId !== undefined) {
        headers.set('walletId', walletId);
    }

    const response: Response = await fetch('https://api.relysia.com/v1/mnemonic', {
        method: 'GET',
        headers,
    });

    const body: RelysiaBasic<RelysiaMnemonic> = await response.json();

    if (body.data.msg === `Error while syncing with walletId: ${walletId}`) {
        throw new Error('Non-existant wallet');
    }

    if (response.status !== 200) {
        this.retriesLeft--;
        return mnemonicRepeat.call(this, walletId);
    }

    return body.data;
}

async function mnemonicRepeat(this: BetterRelysiaSDK, walletId?: string): Promise<RelysiaMnemonic> {
    const headers: Headers = this.getHeaders;

    if (walletId !== undefined) {
        headers.set('walletId', walletId);
    }

    const response: Response = await fetch('https://api.relysia.com/v1/mnemonic', {
        method: 'GET',
        headers,
    });

    const body: RelysiaBasic<RelysiaMnemonic> = await response.json();

    if (body.data.msg === `Error while syncing with walletId: ${walletId}`) {
        throw new Error('Non-existant wallet');
    }

    if (response.status !== 200) {
        this.retriesLeft--
        if (this.retriesLeft > 0) {
            return mnemonicRepeat.call(this, walletId);
        }

        throw new Error('Reached Max Attempts');
    }

    return body.data;
}

export async function balance(this: BetterRelysiaSDK, opts?: BalanceOpts): Promise<RelysiaBalance> {
    this.retriesLeft = this.retries;

    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const headers: Headers = this.getHeaders;

    if (opts !== undefined) {
        if (opts.nextPageToken !== undefined) {
            headers.set('nextPageToken', opts.nextPageToken)
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

    const response: Response = await fetch('https://api.relysia.com/v2/balance', {
        method: 'GET',
        headers,
    });

    const body: RelysiaBasic<RelysiaBalance> = await response.json();

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

async function balanceRepeat(this: BetterRelysiaSDK, opts?: BalanceOpts): Promise<RelysiaBalance> {
    const headers: Headers = this.getHeaders;

    if (opts !== undefined) {
        if (opts.nextPageToken !== undefined) {
            headers.set('nextPageToken', opts.nextPageToken)
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

    const response: Response = await fetch('https://api.relysia.com/v2/balance', {
        method: 'GET',
        headers,
    });

    const body: RelysiaBasic<RelysiaBalance> = await response.json();

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

export async function history(this: BetterRelysiaSDK, opts?: HistoryOpts): Promise<RelysiaHistory> {
    this.retriesLeft = this.retries;

    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const headers: Headers = this.getHeaders;

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

    const response: Response = await fetch('https://api.relysia.com/v2/history', {
        method: 'GET',
        headers,
    });

    const body: RelysiaBasic<RelysiaHistory> = await response.json();

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

async function historyRepeat(this: BetterRelysiaSDK, opts?: HistoryOpts): Promise<RelysiaHistory> {
    const headers: Headers = this.getHeaders;

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

    const response: Response = await fetch('https://api.relysia.com/v2/history', {
        method: 'GET',
        headers,
    });

    const body: RelysiaBasic<RelysiaHistory> = await response.json();

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