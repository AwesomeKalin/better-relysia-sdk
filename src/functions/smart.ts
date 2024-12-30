import { BetterRelysiaSDK } from "../object";
import { RedeemOpts, RelysiaRedeem, RelysiaBasic } from "../types";

export async function redeemToken(this: BetterRelysiaSDK, tokenId: string, amount: number, opts?: RedeemOpts): Promise<RelysiaRedeem> {
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
        return redeemTokenRepeat.call(this, tokenId, amount, opts);
    }

    return res.data;
}

async function redeemTokenRepeat(this: BetterRelysiaSDK, tokenId: string, amount: number, opts?: RedeemOpts): Promise<RelysiaRedeem> {
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
            return redeemTokenRepeat.call(this, tokenId, amount, opts);
        }

        throw new Error('Reached Max Attempts');
    }

    return res.data;
}