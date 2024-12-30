/** @import { RelysiaAuth } from '../types' */
import { BetterRelysiaSDK } from "../object";
/**
    * Authenticate with the Relysia API. Does not support OAuth.
 * @param {string} email Email address of the Relysia account
 * @param {string} password Password of the Relysia account
 * @param {number} [retries=20] Number of retries that requests should do
 * @returns {Promise<BetterRelysiaSDK>}
 */
export declare function authenticate(email: string, password: string, retries?: number): Promise<BetterRelysiaSDK>;
