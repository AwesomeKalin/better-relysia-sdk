export declare class BetterRelysiaSDK {
    authToken: string;
    authTimestamp: number;
    email: string;
    password: string;
    /**
    * Authenticate with the Relysia API. Does not support OAuth.
     * @public
     * @param {string} email Email address of the Relysia account
     * @param {string} password Password of the Relysia account
     * @returns {Promise<'Incorrect Password' | BetterRelysiaSDK>}
     */
    authenticate(email: string, password: string): Promise<'Incorrect Password' | BetterRelysiaSDK>;
    /**
     * @private
     * @returns {Promise<void>}
     */
    private checkAuth;
}
