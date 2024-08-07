/** @typedef {'success' | 'error'} status */
export type status = 'success' | 'error';
/**
 * @typedef {Object} RelysiaAuth
 * @property {number} statusCode
 * @property {Object} data
 * @property {status} data.status
 * @property {string} data.msg
 * @property {string} data.token
 * @property {string} data.refreshToken
 */
export type RelysiaAuth = {
    statusCode: number;
    data: {
        status: status;
        msg: string;
        token: string;
        refreshToken: string;
    };
};
/**
 * @typedef {Object} RelysiaUserDetailsUnproccessed
 * @property {string} userId
 * @property {string} passwordHash
 * @property {number} passwordUpdatedAt
 * @property {string} validSince
 * @property {string} lastLoginAt
 * @property {string} createdAt
 * @property {string} lastRefreshAt
 * @property {string | null} photo
 * @property {string | null} displayName
 * @property {string | null} phoneNumber
 */
export type RelysiaUserDetailsUnproccessed = {
    userId: string;
    passwordHash: string;
    passwordUpdatedAt: number;
    validSince: string;
    lastLoginAt: string;
    createdAt: string;
    lastRefreshAt: string;
    photo: string | null;
    displayName: string | null;
    phoneNumber: string | null;
};
/**
 * @typedef {Object} RelysiaUserDetails
 * @property {string} userId
 * @property {string} passwordHash
 * @property {Date} passwordUpdatedAt
 * @property {Date} validSince
 * @property {Date} lastLoginAt
 * @property {Date} createdAt
 * @property {Date} lastRefreshAt
 * @property {string | null} photo
 * @property {string | null} displayName
 * @property {string | null} phoneNumber
 */
export type RelysiaUserDetails = {
    userId: string;
    passwordHash: string;
    passwordUpdatedAt: Date;
    validSince: Date;
    lastLoginAt: Date;
    createdAt: Date;
    lastRefreshAt: Date;
    photo: string | null;
    displayName: string | null;
    phoneNumber: string | null;
};
/**
 * @typedef {Object} RelysiaBasic
 * @property {number} statusCode
 * @property {T} data
 * @template T
 */
export type RelysiaBasic<T> = {
    statusCode: number;
    data: T;
};
/**
 * @typedef {Object} RelysiaUserProfileData
 * @property {status} status
 * @property {string} msg
 * @property {RelysiaUserDetails} userDetails
 */
export type RelysiaUserProfileData = {
    status: status;
    msg: string;
    userDetails: RelysiaUserDetails;
};
/**

 * @param mnemonicPhrase The mnemonic phrase that you wish to use. One will be generated by Relysia if not provided.
 * @param paymail The paymail address prefix. One will be generated by Relysia if not provided.
 * @param paymailActivate I'm honestly not sure what this does.
 * @param type Select the type of wallet. Either Standard or Escrow. Appears both are identical.
 * @param walletLogo The icon that appears in the Relysia logo
 * @typedef {Object} CreateWalletOpt
 * @property {string} [mnemonicPhrase]
 * @property {string} [paymail]
 * @property {string} [paymailActivate]
 * @property {string} [type]
 * @property {string} [walletLogo]
 */
export type CreateWalletOpt = {
    mnemonicPhrase?: string;
    paymail?: string;
    paymailActivate?: string;
    type?: string;
    walletLogo?: string;
};
/**
 * @typedef {Object} RelysiaCreateWallet
 * @property {status} status
 * @property {string} msg
 * @property {string} walletId
 * @property {string} paymail
 */
export type RelysiaCreateWallet = {
    status: status;
    msg: string;
    walletId: string;
    paymail: string;
};
/**
 * @typedef {Object} RelysiaGetAddress
 * @property {status} status
 * @property {string} msg
 * @property {string} address
 * @property {string} paymail
 */
export type RelysiaGetAddress = {
    status: status;
    msg: string;
    address: string;
    paymail: string;
};
/**
 * @typedef {Object} RelysiaGetAllAddress
 * @property {status} status
 * @property {string} msg
 * @property {string[]} addressess
 */
export type RelysiaGetAllAddress = {
    status: status;
    msg: string;
    addressess: string[];
};
/**
 * @typedef {Object} RelysiaLeaderboard
 * @property {status} status
 * @property {string} msg
 * @property {{
        paymail?: string;
        totalAmount: number;
        uid: string;
        rank: number;
        displayName?: string;
    }[]} leaderboard
 * @property {number | null} nextPageToken
 */
export type RelysiaLeaderboard = {
    status: status;
    msg: string;
    leaderboard: {
        paymail?: string;
        totalAmount: number;
        uid: string;
        rank: number;
        displayName?: string;
    }[];
    nextPageToken: number | null;
};
/**
 * @typedef {Object} RelysiaWallets
 * @property {status} status
 * @property {string} msg
 * @property {{
        walletId: string;
        walletTitle: string;
        walletLogo: string | null;
    }[]} wallets
 */
export type RelysiaWallets = {
    status: status;
    msg: string;
    wallets: {
        walletId: string;
        walletTitle: string;
        walletLogo: string | null;
    }[];
};
/**
 * @typedef {Object} RelysiaMnemonic
 * @property {status} status
 * @property {string} msg
 * @property {string} mnemonic
 */
export type RelysiaMnemonic = {
    status: status;
    msg: string;
    mnemonic: string;
};
/**
 * @typedef {Object} RelysiaBalance
 * @property {status} status
 * @property {string} msg
 * @property {Object} totalBalance
 * @property {string} totalBalance.currency
 * @property {number} totalBalance.balance
 * @property {{
        protocol: "BSV";
        balance: number;
    }|{
        Id: string;
        protocol: string;
        tokenId: string;
        splittable: boolean;
        splitable: boolean;
        verified: boolean;
        address: string;
        satsPerToken: number;
        symbol: string;
        redeemAddr: string;
        image: string;
        amount: number;
        supply: number;
        decimals: number;
        sn: number[];
        name: string;
    }[]} coins
 * @property {Object} meta
 * @property {number} meta.nextPageToken
 */
export type RelysiaBalance = {
    status: status;
    msg: string;
    totalBalance: {
        currency: string;
        balance: number;
    };
    coins: {
        protocol: "BSV";
        balance: number;
    } | {
        Id: string;
        protocol: string;
        tokenId: string;
        splittable: boolean;
        splitable: boolean;
        verified: boolean;
        address: string;
        satsPerToken: number;
        symbol: string;
        redeemAddr: string;
        image: string;
        amount: number;
        supply: number;
        decimals: number;
        sn: number[];
        name: string;
    }[];
    meta: {
        nextPageToken: number;
    };
};
/**
 * @param nextPageToken Next Page Token returned by a previous request
 * @param tokenId Specify a specific token to return
 * @param symbol Specify a specific token by symbol
 * @param walletId The wallet id
 * @param type What type of coin/token to return
 * @param currency What currency to return in totalBalance
 * @param maxResults Maximum number of results to return
 * @typedef {Object} BalanceOpts
 * @property {string} [nextPageToken]
 * @property {string} [tokenId]
 * @property {string} [symbol]
 * @property {string} [walletId]
 * @property {'BSV' | 'STAS' | 'ALL'} [type]
 * @property {string} [currency]
 * @property {number} [maxResults]
 */
export type BalanceOpts = {
    nextPageToken?: string;
    tokenId?: string;
    symbol?: string;
    walletId?: string;
    type?: 'BSV' | 'STAS' | 'ALL';
    currency?: string;
    maxResults?: number;
};
/**
 * @param nextPageToken Next page token returned by a previous request
 * @param tokenId Return the history of a specific token
 * @param protocol The protocol to return
 * @param walletID Wallet to return history for
 * @param type What type of coin/token to return history for
 * @typedef {Object} HistoryOpts
 * @property {string} [nextPageToken]
 * @property {string} [tokenId]
 * @property {string} [protocol]
 * @property {string} [limit]
 * @property {string} [walletID]
 * @property {'debit' | 'credit'} [type]
 */
export type HistoryOpts = {
    nextPageToken?: string;
    tokenId?: string;
    protocol?: string;
    limit?: string;
    walletID?: string;
    type?: 'debit' | 'credit';
};
/**
 * @typedef {Object} RelysiaHistory
 * @property {status} status
 * @property {string} msg
 * @property {{
        to: {
            amount: number;
            image: string;
            protocol: string;
            tokenId: string;
            sn: number;
            to: string;
            name: string;
            decimals: number;
        }|{
            amount: number;
            protocol: string;
            to: string;
        }[];
        txId: string;
        from: string;
        timestamp: string;
        totalAmount: number;
        type: string;
        notes?: string | null;
    }[]} histories
 * @property {Object} meta
 * @property {number} meta.nextPageToken
 */
export type RelysiaHistory = {
    status: status;
    msg: string;
    histories: {
        to: {
            amount: number;
            image: string;
            protocol: string;
            tokenId: string;
            sn: number;
            to: string;
            name: string;
            decimals: number;
        } | {
            amount: number;
            protocol: string;
            to: string;
        }[];
        txId: string;
        from: string;
        timestamp: string;
        totalAmount: number;
        type: string;
        notes?: string | null;
    }[];
    meta: {
        nextPageToken: number;
    };
};
/**
 * @typedef {Object} RelysiaSweep
 * @property {status} status
 * @property {string} msg
 * @property {string[]} txIds
 * @property {any[]} errors
 */
export type RelysiaSweep = {
    status: status;
    msg: string;
    txIds: string[];
    errors: any[];
};
/**
 * @param walletID The wallet you want to use
 * @param transfers All the transfers you wish to do
 * @typedef {Object} RawTxOpts
 * @property {string} [walletID]
 * @property {TransferSchema[]} transfers
 */
export type RawTxOpts = {
    walletID?: string;
    transfers: TransferSchema[];
};
/**
 * @param to The wallet you wish to send tokens/BSV to
 * @param amount How much you wish to send
 * @param notes Any notes you wish to send along side the transaction
 * @param tokenId The STAS token ID you wish to send
 * @typedef {Object} TransferSchema
 * @property {string} to
 * @property {string} amount
 * @property {string} [notes]
 * @property {string} [tokenId]
 * @property {number} [sn]
 */
export type TransferSchema = {
    to: string;
    amount: string;
    notes?: string;
    tokenId?: string;
    sn?: number;
};
/**
 * @typedef {Object} RelysiaRawTx
 * @property {status} stauts
 * @property {string} msg
 * @property {string[]} rawTxs
 */
export type RelysiaRawTx = {
    stauts: status;
    msg: string;
    rawTxs: string[];
};
/**
 * @typedef {Object} RelysiaAsm
 * @property {status} status
 * @property {string} msg
 * @property {string} txid
 */
export type RelysiaAsm = {
    status: status;
    msg: string;
    txid: string;
};
