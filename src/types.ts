export type status = 'success' | 'error';

export type RelysiaAuth = {
    statusCode: number;
    data: {
        status: status;
        msg: string;
        token: string;
        refreshToken: string;
    }
}

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
}

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
}

export type RelysiaBasic<T> = {
    statusCode: number;
    data: T;
}

export type RelysiaUserProfileData = {
    status: status;
    msg: string;
    userDetails: RelysiaUserDetails;
}

/**

 * @param mnemonicPhrase The mnemonic phrase that you wish to use. One will be generated by Relysia if not provided.
 * @param paymail The paymail address prefix. One will be generated by Relysia if not provided.
 * @param paymailActivate I'm honestly not sure what this does.
 * @param type Select the type of wallet. Either Standard or Escrow. Appears both are identical.
 * @param walletLogo The icon that appears in the Relysia logo
 */
export type CreateWalletOpt = {
    mnemonicPhrase?: string;
    paymail?: string;
    paymailActivate?: string;
    type?: string;
    walletLogo?: string;
}

export type RelysiaCreateWallet = {
    status: status;
    msg: string;
    walletId: string;
    paymail: string;
}

export type RelysiaGetAddress = {
    status: status;
    msg: string;
    address: string;
    paymail: string;
}

export type RelysiaGetAllAddress = {
    status: status;
    msg: string;
    addressess: string[];
}

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
}

export type RelysiaWallets = {
    status: status;
    msg: string;
    wallets: {
        walletId: string;
        walletTitle: string;
        walletLogo: string | null;
    }[];
}

export type RelysiaMnemonic = {
    status: status;
    msg: string;
    mnemonic: string;
}

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
    }[];
    meta: {
        nextPageToken: number;
    };
}

/**
 * @param nextPageToken Next Page Token returned by a previous request
 * @param tokenId Specify a specific token to return
 * @param symbol Specify a specific token by symbol
 * @param walletId The wallet id
 * @param type What type of coin/token to return
 * @param currency What currency to return in totalBalance
 * @param maxResults Maximum number of results to return
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
 */
export type HistoryOpts = {
    nextPageToken?: string;
    tokenId?: string;
    protocol?: string;
    limit?: string;
    walletID?: string;
    type?: 'debit' | 'credit';
};

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
    }[];
    meta: {
        nextPageToken: number;
    };
};

export type RelysiaSweep = {
    status: status;
    msg: string;
    txIds: string[];
    errors: any[];
};

/**
 * @param walletID The wallet you want to use
 * @param transfers All the transfers you wish to do
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
 */
export type TransferSchema = {
    to: string;
    amount: string;
    notes?: string;
    tokenId?: string;
    sn?: number;
};

export type RelysiaRawTx = {
    stauts: status;
    msg: string;
    rawTxs: string[];
};

export type RelysiaAsm = {
    status: status;
    msg: string;
    txid: string;
};

/**
 * @param walletID The wallet you want to use
 */
export type RedeemOpts = {
    sn?: number;
    walletID?: string;
};

export type RelysiaRedeem = {
    status: status;
    msg: string;
    txIds: string[];
    errors: any[];
};

/**
 * @param tokenId The id of the token you are offering. Omit to offer BSV.
 * @param amount The amount of tokenId or BSV you are offering.
 * @param wantedAmount The amount of wantedTokenId or BSV you want.
 * @param sn Serial number of the tokenId. Must include tokenId if specified.
 * @param wantedTokenId The id of the token you want. Omit to want BSV. Cannot omit if tokenId is ommited.
 * @param wantedSn Serial number of wantedTokenId. Must include wantedTokenId if specified.
 */
export type AtomicSwapOfferOpts = {
    tokenId?: string;
    amount: number;
    wantedAmount: number
    sn?: number;
    wantedTokenId?: string;
    wantedSn?: number;
};

export type RelysiaAtomicSwapOffer = {
    status: status;
    msg: string;
    contents: string[];
};

/**
 * @param swapHex Hex of the atomic swap
 */
export type AtomicSwapAcceptOpts = {
    swapHex: string;
}[];

export type RelysiaAtomicSwapAccept = {
    status: status;
    msg: string;
    txIds: string[];
    errors: string[];
};

export type RelysiaAtomicSwapInspect = {
    status: status;
    msg: string;
    offerDetails: Array<{
        tokenOwnerAddress: string;
        tokenCreatorAddress: string;
        tokenSatoshis: number;
        wantedSatoshis: number;
        tokenImage: string;
        serialNumber: number;
        splittable: boolean;
        contractTxid: string;
        tokenId: string;
        symbol: string;
        tokenSupply: number;
        verified: boolean;
        tokenName: string;
        tokenDescription?: string;
    } | {
        tokenOwnerAddress: string;
        tokenCreatorAddress: string;
        tokenSatoshis: number;
        wantedSatoshis: number;
        tokenId: string;
        symbol: string;
        sn: number;
        splittable: boolean;
        tokenImage: string;
        contractTxid: string;
        tokenName: string;
        tokenDescription?: string;
        verified: boolean;
    }>;
};