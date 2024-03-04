import { RelysiaAuth } from "./types";

export class BetterRelysiaSDK {
    authToken: string;
    authTimestamp: number;
    email: string;
    password: string;

    public async authenticate(email: string, password: string): Promise<string | BetterRelysiaSDK> {
        const response: Response = await fetch('https://api.relysia.com/v1/auth', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
            }),
        });

        this.authTimestamp = Date.now();

        const body: RelysiaAuth = await response.json();

        if (body.data.msg === 'INVALID_PASSWORD') {
            return 'Incorrect Password';
        }

        this.email = email;
        this.password = password;

        if (response.status !== 200) {
            return this.authenticate(email, password);
        }

        this.authToken = body.data.token;
        return this;
    }

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