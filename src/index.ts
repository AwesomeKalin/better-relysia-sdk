import { RelysiaAuth } from "./types";

export class BetterRelysiaSDK {
    authToken: string;
    authTimestamp: number;
    email: string;
    password: string;

    private async checkAuth(): Promise<void> {
        if (this.authTimestamp <= Date.now() - 600000) {
            return;
        }

        const response: Response = await fetch('https://api.relysia.com/v1/auth', {
            method: 'POST',
            body: JSON.stringify({
                email: this.email,
                password: this.password,
            }),
        });

        this.authTimestamp = Date.now();

        const body: RelysiaAuth = await response.json();

        if (response.status !== 200) {
            return this.checkAuth();
        }

        this.authToken = body.data.token;
    }
}

/**
    * Authenticate with the Relysia API. Does not support OAuth.
    * @param email Email address of the Relysia account
    * @param password Password of the Relysia account
    */
export async function authenticate(email: string, password: string): Promise<'Incorrect Password' | BetterRelysiaSDK> {
    const response: Response = await fetch('https://api.relysia.com/v1/auth', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: new Headers({accept: 'application/json', 'Content-Type': 'application/json'}),
    });

    let toReturn: BetterRelysiaSDK = new BetterRelysiaSDK();

    toReturn.authTimestamp = Date.now();

    const body: RelysiaAuth = await response.json();

    if (body.data.msg === 'INVALID_PASSWORD') {
        return 'Incorrect Password';
    }

    toReturn.email = email;
    toReturn.password = password;

    if (response.status !== 200) {
        return authenticate(email, password);
    }

    toReturn.authToken = body.data.token;
    return toReturn;
}