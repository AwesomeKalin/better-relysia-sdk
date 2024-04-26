"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.BetterRelysiaSDK = void 0;
class BetterRelysiaSDK {
    authToken;
    authTimestamp;
    email;
    password;
    retries;
    /**
     * @private
     * @returns {Promise<void>}
     */
    async checkAuth() {
        if (this.authTimestamp <= Date.now() - 600000) {
            return;
        }
        const response = await fetch('https://api.relysia.com/v1/auth', {
            method: 'POST',
            body: JSON.stringify({
                email: this.email,
                password: this.password,
            }),
            headers: new Headers({ accept: 'application/json', 'Content-Type': 'application/json', }),
        });
        this.authTimestamp = Date.now();
        const body = await response.json();
        if (response.status !== 200) {
            return this.checkAuth();
        }
        this.authToken = body.data.token;
    }
    /**
     * Gets the user profile from Relysia.
     * @public
     * @returns {Promise<RelysiaProfile>}
     */
    async getUserProfile() {
        await this.checkAuth();
        const response = await fetch('https://api.relysia.com/v1/user', {
            method: 'GET',
            headers: new Headers({ accept: 'application/json', authToken: this.authToken }),
        });
        if (response.status !== 200) {
            return this.getUserProfile();
        }
        let body = await response.json();
        //@ts-expect-error
        const unprocessedDetails = body.data.userDetails;
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
        return body;
    }
}
exports.BetterRelysiaSDK = BetterRelysiaSDK;
/**
    * Authenticate with the Relysia API. Does not support OAuth.
 * @param {string} email Email address of the Relysia account
 * @param {string} password Password of the Relysia account
 * @param {number} [retries=20] Number of retries that requests should do
 * @returns {Promise<'Incorrect Password' | BetterRelysiaSDK | 'Account doesn\'t exist'>}
 */
async function authenticate(email, password, retries = 20) {
    const response = await fetch('https://api.relysia.com/v1/auth', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: new Headers({ accept: 'application/json', 'Content-Type': 'application/json', }),
    });
    let toReturn = new BetterRelysiaSDK();
    toReturn.authTimestamp = Date.now();
    const body = await response.json();
    if (body.data.msg === 'INVALID_PASSWORD') {
        return 'Incorrect Password';
    }
    if (body.data.msg === 'EMAIL_NOT_FOUND') {
        return 'Account doesn\'t exist';
    }
    if (body.data.msg === "body/email must match format \"email\"") {
        return 'Account doesn\'t exist';
    }
    toReturn.email = email;
    toReturn.password = password;
    toReturn.retries = retries;
    if (response.status !== 200) {
        return authenticateAfterFail(email, password, retries, retries - 1);
    }
    toReturn.authToken = body.data.token;
    return toReturn;
}
exports.authenticate = authenticate;
/**
 * @param {string} email
 * @param {string} password
 * @param {number} retries
 * @param {number} retriesLeft
 * @returns {Promise<'Incorrect Password' | BetterRelysiaSDK | 'Account doesn\'t exist'>}
 */
async function authenticateAfterFail(email, password, retries, retriesLeft) {
    const response = await fetch('https://api.relysia.com/v1/auth', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: new Headers({ accept: 'application/json', 'Content-Type': 'application/json', }),
    });
    let toReturn = new BetterRelysiaSDK();
    toReturn.authTimestamp = Date.now();
    const body = await response.json();
    if (body.data.msg === 'INVALID_PASSWORD') {
        return 'Incorrect Password';
    }
    if (body.data.msg === 'EMAIL_NOT_FOUND') {
        return 'Account doesn\'t exist';
    }
    if (body.data.msg === "body/email must match format \"email\"") {
        return 'Account doesn\'t exist';
    }
    toReturn.email = email;
    toReturn.password = password;
    toReturn.retries = retries;
    if (response.status !== 200) {
        if (retriesLeft !== 0) {
            return authenticateAfterFail(email, password, retries, retriesLeft - 1);
        }
        else {
            return undefined;
        }
    }
    toReturn.authToken = body.data.token;
    return toReturn;
}
