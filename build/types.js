"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @typedef {'success' | 'error'} status */
/**
 * @typedef {Object} RelysiaAuth
 * @property {number} statusCode
 * @property {Object} data
 * @property {status} data.status
 * @property {string} data.msg
 * @property {string} data.token
 * @property {string} data.refreshToken
 */
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
/**
 * @typedef {Object} RelysiaBasic
 * @property {number} statusCode
 * @property {T} data
 * @template T
 */
/**
 * @typedef {Object} RelysiaUserProfileData
 * @property {status} status
 * @property {string} msg
 * @property {RelysiaUserDetails} userDetails
 */
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
/**
 * @typedef {Object} RelysiaCreateWallet
 * @property {status} status
 * @property {string} msg
 * @property {string} walletId
 * @property {string} paymail
 */
/**
 * @typedef {Object} RelysiaGetAddress
 * @property {status} status
 * @property {string} msg
 * @property {string} address
 * @property {string} paymail
 */
/**
 * @typedef {Object} RelysiaGetAllAddress
 * @property {status} status
 * @property {string} msg
 * @property {string[]} addressess
 */
/**
 * @typedef {Object} RelysiaLeaderboard
 * @property {status} status
 * @property {string} msg
 * @property {{        paymail?: string;        totalAmount: number;        uid: string;        rank: number;        displayName?: string;    }[]} leaderboard
 * @property {number | null} nextPageToken
 */
/**
 * @typedef {Object} RelysiaWallets
 * @property {status} status
 * @property {string} msg
 * @property {{        walletId: string;        walletTitle: string;        walletLogo: string | null;    }[]} wallets
 */
/**
 * @typedef {Object} RelysiaMnemonic
 * @property {status} status
 * @property {string} msg
 * @property {string} mnemonic
 */
/**
 * @typedef {Object} RelysiaBalance
 * @property {status} status
 * @property {string} msg
 * @property {Object} totalBalance
 * @property {string} totalBalance.currency
 * @property {number} totalBalance.balance
 * @property {{        protocol: "BSV";        balance: number;    }|{        Id: string;        protocol: string;        tokenId: string;        splittable: boolean;        splitable: boolean;        verified: boolean;        address: string;        satsPerToken: number;        symbol: string;        redeemAddr: string;        image: string;        amount: number;        supply: number;        decimals: number;        sn: number[];        name: string;    }[]} coins
 * @property {Object} meta
 * @property {number} meta.nextPageToken
 */
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
/**
 * @typedef {Object} RelysiaHistory
 * @property {status} status
 * @property {string} msg
 * @property {{        to: {            amount: number;            image: string;            protocol: string;            tokenId: string;            sn: number;            to: string;            name: string;            decimals: number;        }|{            amount: number;            protocol: string;            to: string;        }[];        txId: string;        from: string;        timestamp: string;        totalAmount: number;        type: string;        notes?: string | null;    }[]} histories
 * @property {Object} meta
 * @property {number} meta.nextPageToken
 */
/**
 * @typedef {Object} RelysiaSweep
 * @property {status} status
 * @property {string} msg
 * @property {string[]} txIds
 * @property {any[]} errors
 */
/**
 * @param walletID The wallet you want to use
 * @param transfers All the transfers you wish to do
 * @typedef {Object} RawTxOpts
 * @property {string} [walletID]
 * @property {TransferSchema[]} transfers
 */
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
/**
 * @typedef {Object} RelysiaRawTx
 * @property {status} stauts
 * @property {string} msg
 * @property {string[]} rawTxs
 */
/**
 * @typedef {Object} RelysiaAsm
 * @property {status} status
 * @property {string} msg
 * @property {string} txid
 */
/**
 * @param walletID The wallet you want to use
 * @typedef {Object} RedeemOpts
 * @property {number} [sn]
 * @property {string} [walletID]
 */
/**
 * @typedef {Object} RelysiaRedeem
 * @property {status} status
 * @property {string} msg
 * @property {string[]} txIds
 * @property {any[]} errors
 */
/**
 * @param tokenId The id of the token you are offering. Omit to offer BSV.
 * @param amount The amount of tokenId or BSV you are offering.
 * @param wantedAmount The amount of wantedTokenId or BSV you want.
 * @param sn Serial number of the tokenId. Must include tokenId if specified.
 * @param wantedTokenId The id of the token you want. Omit to want BSV. Cannot omit if tokenId is ommited.
 * @param wantedSn Serial number of wantedTokenId. Must include wantedTokenId if specified.
 * @typedef {Object} AtomicSwapOfferOpts
 * @property {string} [tokenId]
 * @property {number} amount
 * @property {number} wantedAmount
 * @property {number} [sn]
 * @property {string} [wantedTokenId]
 * @property {number} [wantedSn]
 */
/**
 * @typedef {Object} RelysiaAtomicSwapOffer
 * @property {status} status
 * @property {string} msg
 * @property {string[]} contents
 */
/**
 * @param swapHex Hex of the atomic swap
 * @typedef {{
 *     swapHex: string;
 * }[]} AtomicSwapAcceptOpts
 */
/**
 * @typedef {Object} RelysiaAtomicSwapAccept
 * @property {status} status
 * @property {string} msg
 * @property {string[]} txIds
 * @property {string[]} errors
 */
/**
 * @typedef {Object} RelysiaAtomicSwapInspect
 * @property {status} status
 * @property {string} msg
 * @property {Array<{        tokenOwnerAddress: string;        tokenCreatorAddress: string;        tokenSatoshis: number;        wantedSatoshis: number;        tokenImage: string;        serialNumber: number;        splittable: boolean;        contractTxid: string;        tokenId: string;        symbol: string;        tokenSupply: number;        verified: boolean;        tokenName: string;        tokenDescription?: string;    } | {        tokenOwnerAddress: string;        tokenCreatorAddress: string;        tokenSatoshis: number;        wantedSatoshis: number;        tokenId: string;        symbol: string;        sn: number;        splittable: boolean;        tokenImage: string;        contractTxid: string;        tokenName: string;        tokenDescription?: string;        verified: boolean;    }>} offerDetails
 */
