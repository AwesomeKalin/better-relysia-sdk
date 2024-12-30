"use strict";
/** @import { RelysiaAuth } from '../types' */
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const object_1 = require("../object");
/**
    * Authenticate with the Relysia API. Does not support OAuth.
 * @param {string} email Email address of the Relysia account
 * @param {string} password Password of the Relysia account
 * @param {number} [retries=20] Number of retries that requests should do
 * @returns {Promise<BetterRelysiaSDK>}
 */
async function authenticate(email, password, retries = 20) {
    const response = await fetch('https://api.relysia.com/v1/auth', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: postHeaders,
    });
    let toReturn = new object_1.BetterRelysiaSDK();
    toReturn.authTimestamp = Date.now();
    const body = await response.json();
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
/**
 * @param {string} email
 * @param {string} password
 * @param {number} retries
 * @param {number} retriesLeft
 * @returns {Promise<BetterRelysiaSDK>}
 */
async function authenticateAfterFail(email, password, retries, retriesLeft) {
    const response = await fetch('https://api.relysia.com/v1/auth', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: postHeaders,
    });
    let toReturn = new object_1.BetterRelysiaSDK();
    toReturn.authTimestamp = Date.now();
    const body = await response.json();
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
        }
        else {
            throw new Error('Reached Max Attempts');
        }
    }
    toReturn.authToken = body.data.token;
    this.getHeaders.set('authToken', this.authToken);
    this.postHeaders.set('authToken', this.authToken);
    return toReturn;
}
const getHeaders = new Headers({ accept: 'application/json' });
const postHeaders = new Headers({ accept: 'application/json', 'Content-Type': 'application/json', });
