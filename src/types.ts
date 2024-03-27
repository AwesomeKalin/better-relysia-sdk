export type status = 'success' | 'error';

export type RelysiaAuth = {
    statusCode: number;
    data: {
        status: status;
        msg: string;
        token: string;
    }
}

export type RelysiaUserDetailsUnproccessed = {
    userId: string;
    passwordHash: string;
    passwordUpdatedAt: number;
    validSince: string;
    lastLoginAt: string;
    createdAt: string;
    lastRefreshAt: string;
    photo: string | null;
    displayName: string | null;
    phoneNumber: string | null;
}

export type RelysiaUserDetails = {
    userId: string;
    passwordHash: string;
    passwordUpdatedAt: Date;
    validSince: Date;
    lastLoginAt: Date;
    createdAt: Date;
    lastRefreshAt: Date;
    photo: string | null;
    displayName: string | null;
    phoneNumber: string | null;
}

export type RelysiaProfile = {
    statusCode: number;
    data: {
        status: status;
        msg: string;
        userDetails: RelysiaUserDetails;
    }
}