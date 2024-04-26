import { RelysiaAuth, RelysiaProfile, RelysiaUserDetailsUnproccessed } from "./types";

export class BetterRelysiaSDK {
    authToken: string;
    authTimestamp: number;
    email: string;
    password: string;
    retries: number;
    retriesLeft: number;

    private async checkAuth(): Promise<void | false> {
        if (this.authTimestamp <= Date.now() - 600000) {
            return;
        }

        const response: Response = await fetch('https://api.relysia.com/v1/auth', {
            method: 'POST',
            body: JSON.stringify({
                email: this.email,
                password: this.password,
            }),
            headers: new Headers({ accept: 'application/json', 'Content-Type': 'application/json', }),
        });

        this.authTimestamp = Date.now();

        const body: RelysiaAuth = await response.json();

        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft < 0) {
                return this.checkAuth();
            }

            return false;
        }

        this.authToken = body.data.token;
    }

    /**
     * Gets the user profile from Relysia.
     */
    public async getUserProfile(): Promise<RelysiaProfile | 'Reached Max Attempts'> {
        this.retriesLeft = this.retries;
        const verifyCheck: void | false = await this.checkAuth();
        if (verifyCheck === false) {
            return 'Reached Max Attempts';
        }

        const response: Response = await fetch('https://api.relysia.com/v1/user', {
            method: 'GET',
            headers: new Headers({ accept: 'application/json', authToken: this.authToken }),
        });

        if (response.status !== 200) {
            this.retriesLeft--;
            return this.getUserProfile();
        }

        let body: RelysiaProfile = await response.json();
        //@ts-expect-error
        const unprocessedDetails: RelysiaUserDetailsUnproccessed = body.data.userDetails;
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

    private async getUserProfileRepeat(): Promise<RelysiaProfile | 'Reached Max Attempts'> {
        const response: Response = await fetch('https://api.relysia.com/v1/user', {
            method: 'GET',
            headers: new Headers({ accept: 'application/json', authToken: this.authToken }),
        });

        if (response.status !== 200) {
            this.retriesLeft--;
            if (this.retriesLeft < 0) {
                return this.getUserProfileRepeat();
            }

            return 'Reached Max Attempts';
        }

        let body: RelysiaProfile = await response.json();
        //@ts-expect-error
        const unprocessedDetails: RelysiaUserDetailsUnproccessed = body.data.userDetails;
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

/**
    * Authenticate with the Relysia API. Does not support OAuth.
    * @param email Email address of the Relysia account
    * @param password Password of the Relysia account
    * @param retries Number of retries that requests should do
    */
export async function authenticate(email: string, password: string, retries: number = 20): Promise<'Incorrect Password' | BetterRelysiaSDK | 'Account doesn\'t exist'> {
    const response: Response = await fetch('https://api.relysia.com/v1/auth', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: new Headers({ accept: 'application/json', 'Content-Type': 'application/json', }),
    });

    let toReturn: BetterRelysiaSDK = new BetterRelysiaSDK();

    toReturn.authTimestamp = Date.now();

    const body: RelysiaAuth = await response.json();

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

async function authenticateAfterFail(email: string, password: string, retries: number, retriesLeft: number): Promise<'Incorrect Password' | BetterRelysiaSDK | 'Account doesn\'t exist'> {
    const response: Response = await fetch('https://api.relysia.com/v1/auth', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: new Headers({ accept: 'application/json', 'Content-Type': 'application/json', }),
    });

    let toReturn: BetterRelysiaSDK = new BetterRelysiaSDK();

    toReturn.authTimestamp = Date.now();

    const body: RelysiaAuth = await response.json();

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
        } else {
            return undefined;
        }
    }

    toReturn.authToken = body.data.token;
    return toReturn;
}