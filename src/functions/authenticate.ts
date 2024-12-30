import { BetterRelysiaSDK } from "../object";
import { RelysiaAuth } from "../types";

/**
    * Authenticate with the Relysia API. Does not support OAuth.
    * @param email Email address of the Relysia account
    * @param password Password of the Relysia account
    * @param retries Number of retries that requests should do
    */
export async function authenticate(email: string, password: string, retries: number = 20): Promise<BetterRelysiaSDK> {
    const response: Response = await fetch('https://api.relysia.com/v1/auth', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: postHeaders,
    });

    let toReturn: BetterRelysiaSDK = new BetterRelysiaSDK();

    toReturn.authTimestamp = Date.now();

    const body: RelysiaAuth = await response.json();

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

async function authenticateAfterFail(email: string, password: string, retries: number, retriesLeft: number): Promise<BetterRelysiaSDK> {
    const response: Response = await fetch('https://api.relysia.com/v1/auth', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: postHeaders,
    });

    let toReturn: BetterRelysiaSDK = new BetterRelysiaSDK();

    toReturn.authTimestamp = Date.now();

    const body: RelysiaAuth = await response.json();

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
        } else {
            throw new Error('Reached Max Attempts');
        }
    }

    toReturn.authToken = body.data.token;
    this.getHeaders.set('authToken', this.authToken);
    this.postHeaders.set('authToken', this.authToken);
    return toReturn;
}

const getHeaders = new Headers({ accept: 'application/json' });
const postHeaders: Headers = new Headers({ accept: 'application/json', 'Content-Type': 'application/json', });