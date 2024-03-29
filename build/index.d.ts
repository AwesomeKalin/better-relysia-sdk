import { RelysiaProfile } from "./types";
export declare class BetterRelysiaSDK {
    authToken: string;
    authTimestamp: number;
    email: string;
    password: string;
    /**
     * @private
     * @returns {Promise<void>}
     */
    private checkAuth;
    /**
     * Gets the user profile from Relysia.
     * @public
     * @returns {Promise<RelysiaProfile>}
     */
    getUserProfile(): Promise<RelysiaProfile>;
}
/**
    * Authenticate with the Relysia API. Does not support OAuth.
 * @param {string} email Email address of the Relysia account
 * @param {string} password Password of the Relysia account
 * @returns {Promise<'Incorrect Password' | BetterRelysiaSDK>}
 */
export declare function authenticate(email: string, password: string): Promise<'Incorrect Password' | BetterRelysiaSDK>;
