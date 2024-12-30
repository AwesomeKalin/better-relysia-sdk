import { getUserProfile } from "./functions/identity";
import { redeemToken } from "./functions/smart";
import { sweep, asm as assembly, rawTx, atomicSwapOffer, atomicSwapAccept, inspectAtomicSwap } from "./functions/transactions";
import { balance, getAddress, getAllAddressess, leaderboard, mnemonic, wallets, history } from "./functions/wallets";
import { RelysiaAuth, RelysiaUserProfileData, RelysiaBasic, CreateWalletOpt, RelysiaCreateWallet, RelysiaGetAddress, RelysiaGetAllAddress, RelysiaLeaderboard, RelysiaWallets, RelysiaMnemonic, BalanceOpts, RelysiaBalance, HistoryOpts, RelysiaHistory, RelysiaSweep, RawTxOpts, RelysiaRawTx, RelysiaAsm, RedeemOpts, RelysiaRedeem, AtomicSwapOfferOpts, RelysiaAtomicSwapOffer, AtomicSwapAcceptOpts, RelysiaAtomicSwapAccept, RelysiaAtomicSwapInspect } from "./types";

export class BetterRelysiaSDK {
    authToken: string;
    authTimestamp: number;
    email: string;
    password: string;
    retries: number;
    retriesLeft: number;
    getHeaders = new Headers({ accept: 'application/json' });
    postHeaders: Headers = new Headers({ accept: 'application/json', 'Content-Type': 'application/json', });

    protected async checkAuth(): Promise<void | false> {
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
        return getUserProfile.call(this);
    }

    /**
     * Get an address and the paymail for a specified wallet.
     * @param walletId The Wallet ID that you wish to get the address for. Defaults to default wallet if not specified
     */
    public async getAddress(walletId?: string): Promise<RelysiaGetAddress> {
        return getAddress.call(this, walletId);
    }

    /**
     * Get all addresses related to your wallet.
     * @param walletId Wallet ID of the wallet you want to use. Leave blank to use default wallet
     */
    public async getAllAddressess(walletId?: string): Promise<RelysiaGetAllAddress> {
        return getAllAddressess.call(this, walletId);
    }

    /**
     * Gets the leaderboard of those who hold a particular STAS token.
     * @param tokenId The token id of the token you wish to query.
     * @param nextPageToken The next page token given by a previous response.
     */
    public async leaderboard(tokenId: string, nextPageToken?: number): Promise<RelysiaLeaderboard> {
        return leaderboard.call(this, tokenId, nextPageToken);
    }

    /**
     * Gets all wallets in the Relysia account.
     */
    public async wallets(): Promise<RelysiaWallets> {
        return wallets.call(this);
    }

    /** Gets the mnemonic of a wallet
     * @param walletId Wallet ID of the wallet you want to use. Leave blank to use default wallet
     */
    public async mnemonic(walletId?: string): Promise<RelysiaMnemonic> {
        return mnemonic.call(this, walletId);
    }

    /**
     * Get the balance of the specified wallet
     * @param opts Optional options to pass to the endpoint
     */
    public async balance(opts?: BalanceOpts): Promise<RelysiaBalance> {
        return balance.call(this, opts);
    }

    /**
     * Get wallet history
     * @param opts Optional options to pass
     */
    public async history(opts?: HistoryOpts): Promise<RelysiaHistory> {
        return history.call(this, opts);
    }

    /**
     * Transfer all assets from a specific private key
     * @param privateKey The private key you wish to sweep from
     */
    public async sweep(privateKey: string, walletID?: string): Promise<RelysiaSweep> {
        return sweep.call(this, privateKey, walletID);
    }

    /**
     * Create a raw transaction
     * @param opts Function Options
     */
    public async rawTx(opts: RawTxOpts): Promise<RelysiaRawTx> {
        return rawTx.call(this, opts);
    }

    /**
     * Make a transaction with a custom script. Relatively limited and should be avoided where possible
     * @param asm The custom bitcoin script to be added as an output
     * @param amount The amount of BSV to lock in the script
     * @param walletID The wallet you want to use
     */
    public async asm(asm: string, amount: number, walletID?: string): Promise<RelysiaAsm> {
        return assembly.call(this, asm, amount, walletID);
    }

    /**
     * Dissolve a token for satoshis
     * @param tokenId The token you wish to redeem
     * @param amount How much you wish to redeem
     * @param opts Additional options
     */
    public async redeemToken(tokenId: string, amount: number, opts?: RedeemOpts): Promise<RelysiaRedeem> {
        return redeemToken.call(this, tokenId, amount, opts);
    }

    /**
     * Create an atomic swap offer
     * @param walletId The wallet you want to use
     * @param opts Function options
     */
    public async atomicSwapOffer(opts: AtomicSwapOfferOpts[], walletId: string): Promise<RelysiaAtomicSwapOffer> {
        return atomicSwapOffer.call(this, opts, walletId);
    }

    /**
     * Accept an atomic swap
     * @param opts Function Options
     * @param walletId The wallet you want to use
     */
    public async atomicSwapAccept(opts: AtomicSwapAcceptOpts, walletId?: string): Promise<RelysiaAtomicSwapAccept> {
        return atomicSwapAccept.call(this, opts, walletId);
    }

    /**
     * Allows you to inspect an atomic swap to check the validity of it
     * @param opts The function options
     * @param walletId The wallet you wish to use
     */
    public async inspectAtomicSwap(opts: AtomicSwapAcceptOpts, walletId?: string) {
        return inspectAtomicSwap.call(this, opts, walletId);
    }
}