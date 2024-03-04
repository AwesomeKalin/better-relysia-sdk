export declare class BetterRelysiaSDK {
    authToken: string;
    authTimestamp: number;
    email: string;
    password: string;
    authenticate(email: string, password: string): Promise<string | BetterRelysiaSDK>;
    private checkAuth;
}
