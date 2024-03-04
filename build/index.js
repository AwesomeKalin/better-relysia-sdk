"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetterRelysiaSDK = void 0;
class BetterRelysiaSDK {
    authToken;
    authTimestamp;
    email;
    password;
    async authenticate(email, password) {
        const response = await fetch('https://api.relysia.com/v1/auth', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
            }),
        });
        this.authTimestamp = Date.now();
        const body = await response.json();
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
        });
        this.authTimestamp = Date.now();
        const body = await response.json();
        if (response.status !== 200) {
            return this.checkAuth();
        }
        this.authToken = body.data.token;
    }
}
exports.BetterRelysiaSDK = BetterRelysiaSDK;
