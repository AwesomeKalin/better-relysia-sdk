import { BetterRelysiaSDK } from "../object";
import { RelysiaUserProfileData, RelysiaBasic } from "../types";

export async function getUserProfile(this: BetterRelysiaSDK): Promise<RelysiaUserProfileData> {
    this.retriesLeft = this.retries;
    const verifyCheck: void | false = await this.checkAuth();
    if (verifyCheck === false) {
        throw new Error('Reached Max Attempts');
    }

    const response: Response = await fetch('https://api.relysia.com/v1/user', {
        method: 'GET',
        headers: this.getHeaders,
    });

    if (response.status !== 200) {
        this.retriesLeft--;
        return getUserProfileRepeat.call(this);
    }

    let body: RelysiaBasic<RelysiaUserProfileData> = await response.json();
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

    return body.data;
}

async function getUserProfileRepeat(this: BetterRelysiaSDK): Promise<RelysiaUserProfileData> {
    const response: Response = await fetch('https://api.relysia.com/v1/user', {
        method: 'GET',
        headers: this.getHeaders,
    });

    if (response.status !== 200) {
        this.retriesLeft--;
        if (this.retriesLeft > 0) {
            return getUserProfileRepeat.call(this);
        }

        throw new Error('Reached Max Attempts');
    }

    let body: RelysiaBasic<RelysiaUserProfileData> = await response.json();
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

    return body.data;
}