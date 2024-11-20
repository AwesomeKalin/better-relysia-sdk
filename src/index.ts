import { AtomicSwapAcceptOpts, AtomicSwapOfferOpts, BalanceOpts, CreateWalletOpt, HistoryOpts, RawTxOpts, RedeemOpts, RelysiaAsm, RelysiaAtomicSwapAccept, RelysiaAtomicSwapOffer, RelysiaAuth, RelysiaBalance, RelysiaBasic, RelysiaCreateWallet, RelysiaGetAddress, RelysiaGetAllAddress, RelysiaHistory, RelysiaLeaderboard, RelysiaMnemonic, RelysiaRawTx, RelysiaRedeem, RelysiaSweep, RelysiaUserDetailsUnproccessed, RelysiaUserProfileData, RelysiaWallets, TransferSchema } from "./types";

export class BetterRelysiaSDK {
    authToken: string;
    authTimestamp: number;
    email: string;
    password: string;
    retries: number;
    retriesLeft: number;
    getHeaders = new Headers({ accept: 'application/json' });
    postHeaders: Headers = new Headers({ accept: 'application/json', 'Content-Type': 'application/json', });

    private async checkAuth(): Promise<void | false> {
        if (this.authTimestamp <= Date.now() - 600000) {
            return;
        }

        const response: Response = await fetch('https://api.relysia.com/v1/auth', {
            method: 'POST',
            body: JSON.stringify({
                email: this.email,
                password: this.password,
            }),
            headers: this.postHeaders,
        });

        this.authTimestamp = Date.now();

        const body: RelysiaAuth = await response.json();

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
     */
    public async getUserProfile(): Promise<RelysiaUserProfileData> {
        this.retriesLeft = this.retries;
        const verifyCheck: void | false = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }

        const response: Response = await fetch('https://api.relysia.com/v1/user', {
            method: 'GET',
            headers: this.getHeaders,
        });

        if (response.status !== 200) {
            this.retriesLeft--;
            return await this.getUserProfileRepeat();
        }

        let body: RelysiaBasic<RelysiaUserProfileData> = await response.json();
        //@ts-expect-error
        const unprocessedDetails: RelysiaUserDetailsUnproccessed = body.data.userDetails;
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

    private async getUserProfileRepeat(): Promise<RelysiaUserProfileData> {
        const response: Response = await fetch('https://api.relysia.com/v1/user', {
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

        let body: RelysiaBasic<RelysiaUserProfileData> = await response.json();
        //@ts-expect-error
        const unprocessedDetails: RelysiaUserDetailsUnproccessed = body.data.userDetails;
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
     * @param walletTitle The title of the wallet.
     */
    public async createWallet(walletTitle: string, opt?: CreateWalletOpt): Promise<RelysiaCreateWallet> {
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
            return await this.createWalletRepeat(walletTitle, opt);
        }

        return body.data;
    }

    private async createWalletRepeat(walletTitle: string, opt?: CreateWalletOpt): Promise<RelysiaCreateWallet> {
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
                return await this.createWalletRepeat(walletTitle, opt);
            }

            throw new Error('Reached Max Attempts');
        }

        return body.data;
    }

    /**
     * Get an address and the paymail for a specified wallet.
     * @param walletId The Wallet ID that you wish to get the address for. Defaults to default wallet if not specified
     */
    public async getAddress(walletId?: string): Promise<RelysiaGetAddress> {
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
            return await this.getAddressRepeat(walletId);
        }

        return body.data;
    }

    private async getAddressRepeat(walletId?: string): Promise<RelysiaGetAddress> {
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
                return await this.getAddressRepeat(walletId);
            }

            throw new Error('Reached Max Attempts');
        }

        return body.data;
    }

    /**
     * Get all addresses related to your wallet.
     * @param walletId Wallet ID of the wallet you want to use. Leave blank to use default wallet
     */
    public async getAllAddressess(walletId?: string): Promise<RelysiaGetAllAddress> {
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
            return await this.getAllAddressessRepeat(walletId);
        }

        return body.data;
    }

    private async getAllAddressessRepeat(walletId?: string): Promise<RelysiaGetAllAddress> {
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
                return await this.getAllAddressessRepeat(walletId);
            }

            throw new Error('Reached Max Attempts');
        }

        return body.data;
    }

    /**
     * Gets the leaderboard of those who hold a particular STAS token.
     * @param tokenId The token id of the token you wish to query.
     * @param nextPageToken The next page token given by a previous response.
     */
    public async leaderboard(tokenId: string, nextPageToken?: number): Promise<RelysiaLeaderboard> {
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
            return await this.leaderboardRepeat(tokenId, nextPageToken);
        }

        return body.data;
    }

    private async leaderboardRepeat(tokenId: string, nextPageToken?: number): Promise<RelysiaLeaderboard> {
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
                return await this.leaderboardRepeat(tokenId, nextPageToken);
            }

            throw new Error('Reached Max Attempts');
        }

        return body.data;
    }

    /**
     * Gets all wallets in the Relysia account.
     */
    public async wallets(): Promise<RelysiaWallets> {
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
            return this.walletsRepeat();
        }

        const body: RelysiaBasic<RelysiaWallets> = await response.json();

        return body.data;
    }

    private async walletsRepeat(): Promise<RelysiaWallets> {
        const headers: Headers = this.getHeaders;

        const response: Response = await fetch('https://api.relysia.com/v1/wallets', {
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

        const body: RelysiaBasic<RelysiaWallets> = await response.json();

        return body.data;
    }

    /** Gets the mnemonic of a wallet
     * @param walletId Wallet ID of the wallet you want to use. Leave blank to use default wallet
     */
    public async mnemonic(walletId?: string): Promise<RelysiaMnemonic> {
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
            return await this.mnemonicRepeat(walletId);
        }

        return body.data;
    }

    private async mnemonicRepeat(walletId?: string): Promise<RelysiaMnemonic> {
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
                return await this.mnemonicRepeat(walletId);
            }

            throw new Error('Reached Max Attempts');
        }

        return body.data;
    }

    /**
     * Get the balance of the specified wallet
     * @param opts Optional options to pass to the endpoint
     */
    public async balance(opts?: BalanceOpts): Promise<RelysiaBalance> {
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
            return this.balanceRepeat(opts);
        }

        return body.data;
    }

    private async balanceRepeat(opts?: BalanceOpts): Promise<RelysiaBalance> {
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
                return this.balanceRepeat(opts);
            }

            throw new Error('Reached Max Attempts');
        }

        return body.data;
    }

    /**
     * Get wallet history
     * @param opts Optional options to pass
     */
    public async history(opts?: HistoryOpts): Promise<RelysiaHistory> {
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
            return this.historyRepeat(opts);
        }

        return body.data;
    }

    private async historyRepeat(opts?: HistoryOpts): Promise<RelysiaHistory> {
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
                return this.historyRepeat(opts);
            }

            throw new Error('Reached Max Attempts');
        }

        return body.data;
    }

    /**
     * Transfer all assets from a specific private key
     * @param privateKey The private key you wish to sweep from
     */
    public async sweep(privateKey: string, walletID?: string): Promise<RelysiaSweep | 'Reached Max Attempts' | 'Non-existant wallet' | 'Not a valid private key'> {
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
            return this.sweepRepeat(privateKey, walletID);
        }

        return res.data;
    }

    private async sweepRepeat(privateKey: string, walletID?: string): Promise<RelysiaSweep> {
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
                return this.sweepRepeat(privateKey, walletID);
            }

            throw new Error('Reached Max Attempts');
        }

        return res.data;
    }

    /**
     * Create a raw transaction
     * @param opts Function Options
     */
    public async rawTx(opts: RawTxOpts): Promise<RelysiaRawTx> {
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
            return this.rawTxRepeat(opts);
        }

        return res.data;
    }

    private async rawTxRepeat(opts: RawTxOpts): Promise<RelysiaRawTx> {
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
                return this.rawTxRepeat(opts);
            }

            throw new Error('Reached Max Attempts');
        }

        return res.data;
    }

    /**
     * Make a transaction with a custom script. Relatively limited and should be avoided where possible
     * @param asm The custom bitcoin script to be added as an output
     * @param amount The amount of BSV to lock in the script
     * @param walletID The wallet you want to use
     */
    public async asm(asm: string, amount: number, walletID?: string): Promise<RelysiaAsm> {
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
            return this.asmRepeat(asm, amount, walletID);
        }

        return res.data;
    }

    private async asmRepeat(asm: string, amount: number, walletID?: string): Promise<RelysiaAsm> {
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
                return this.asmRepeat(asm, amount, walletID);
            }

            throw new Error('Reached Max Attempts');
        }

        return res.data;
    }

    /**
     * Dissolve a token for satoshis
     * @param tokenId The token you wish to redeem
     * @param amount How much you wish to redeem
     * @param opts Additional options
     */
    public async redeemToken(tokenId: string, amount: number, opts?: RedeemOpts): Promise<RelysiaRedeem> {
        this.retriesLeft = this.retries;

        const verifyCheck: void | false = await this.checkAuth();
        if (verifyCheck === false) {
            throw new Error('Reached Max Attempts');
        }

        const headers: Headers = this.postHeaders;

        let body: BodyInit;

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
        } else {
            body = JSON.stringify({
                dataArray: [
                    {
                        amount,
                        tokenId,
                    }
                ]
            });
        }

        const response: Response = await fetch('https://api.relysia.com/v1/redeem', {
            method: 'POST',
            headers,
            body,
        });

        const res: RelysiaBasic<RelysiaRedeem> = await response.json();

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

    private async redeemTokenRepeat(tokenId: string, amount: number, opts?: RedeemOpts): Promise<RelysiaRedeem> {
        const headers: Headers = this.postHeaders;

        let body: BodyInit;

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
        } else {
            body = JSON.stringify({
                dataArray: [
                    {
                        amount,
                        tokenId,
                    }
                ]
            });
        }

        const response: Response = await fetch('https://api.relysia.com/v1/redeem', {
            method: 'POST',
            headers,
            body,
        });

        const res: RelysiaBasic<RelysiaRedeem> = await response.json();

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
     * @param walletId The wallet you want to use
     * @param opts Function options
     */
    public async atomicSwapOffer(opts: AtomicSwapOfferOpts[], walletId: string): Promise<RelysiaAtomicSwapOffer> {
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
            return this.atomicSwapOfferRepeat(opts, walletId);
        }

        return res.data;
    }

    private async atomicSwapOfferRepeat(opts: AtomicSwapOfferOpts[], walletId?: string): Promise<RelysiaAtomicSwapOffer> {
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
                return this.atomicSwapOfferRepeat(opts, walletId);
            }

            throw new Error('Reached Max Attempts');
        }

        return res.data;
    }

    /**
     * Accept an atomic swap
     * @param opts Function Options
     * @param walletId The wallet you want to use
     */
    public async atomicSwapAccept(opts: AtomicSwapAcceptOpts, walletId?: string): Promise<RelysiaAtomicSwapAccept> {
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
            return this.atomicSwapAcceptRepeat(opts, walletId);
        }

        return res.data;
    }

    private async atomicSwapAcceptRepeat(opts: AtomicSwapAcceptOpts, walletId?: string): Promise<RelysiaAtomicSwapAccept> {
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
                return this.atomicSwapAccept(opts, walletId);
            }

            throw new Error('Reached Max Attempts');
        }

        return res.data;
    }
}

/**
    * Authenticate with the Relysia API. Does not support OAuth.
    * @param email Email address of the Relysia account
    * @param password Password of the Relysia account
    * @param retries Number of retries that requests should do
    */
export async function authenticate(email: string, password: string, retries: number = 20): Promise<BetterRelysiaSDK> {
    const response: Response = await fetch('https://api.relysia.com/v1/auth', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: postHeaders,
    });

    let toReturn: BetterRelysiaSDK = new BetterRelysiaSDK();

    toReturn.authTimestamp = Date.now();

    const body: RelysiaAuth = await response.json();

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

async function authenticateAfterFail(email: string, password: string, retries: number, retriesLeft: number): Promise<BetterRelysiaSDK> {
    const response: Response = await fetch('https://api.relysia.com/v1/auth', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: postHeaders,
    });

    let toReturn: BetterRelysiaSDK = new BetterRelysiaSDK();

    toReturn.authTimestamp = Date.now();

    const body: RelysiaAuth = await response.json();

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
        } else {
            throw new Error('Reached Max Attempts');
        }
    }

    toReturn.authToken = body.data.token;
    this.getHeaders.set('authToken', this.authToken);
    this.postHeaders.set('authToken', this.authToken);
    return toReturn;
}

const getHeaders = new Headers({ accept: 'application/json' });
const postHeaders: Headers = new Headers({ accept: 'application/json', 'Content-Type': 'application/json', });