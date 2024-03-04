export type RelysiaAuth = {
    statusCode: number;
    data: {
        status: string;
        msg: string;
        token: string;
    }
}