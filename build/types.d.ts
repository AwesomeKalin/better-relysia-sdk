/**
 * @typedef {Object} RelysiaAuth
 * @property {number} statusCode
 * @property {Object} data
 * @property {string} data.status
 * @property {string} data.msg
 * @property {string} data.token
 */
export type RelysiaAuth = {
    statusCode: number;
    data: {
        status: string;
        msg: string;
        token: string;
    };
};
