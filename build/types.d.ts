/** @typedef {'success' | 'error'} status */
export type status = 'success' | 'error';
/**
 * @typedef {Object} RelysiaAuth
 * @property {number} statusCode
 * @property {Object} data
 * @property {status} data.status
 * @property {string} data.msg
 * @property {string} data.token
 */
export type RelysiaAuth = {
    statusCode: number;
    data: {
        status: status;
        msg: string;
        token: string;
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
 * @typedef {Object} RelysiaProfile
 * @property {number} statusCode
 * @property {Object} data
 * @property {status} data.status
 * @property {string} data.msg
 * @property {RelysiaUserDetails} data.userDetails
 */
export type RelysiaProfile = {
    statusCode: number;
    data: {
        status: status;
        msg: string;
        userDetails: RelysiaUserDetails;
    };
};
