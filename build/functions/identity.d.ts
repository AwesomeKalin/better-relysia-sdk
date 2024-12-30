/** @import { BetterRelysiaSDK } from '../object' */
/** @import { RelysiaUserProfileData, RelysiaBasic } from '../types' */
import { BetterRelysiaSDK } from "../object";
import { RelysiaUserProfileData } from "../types";
/**
 * @param {BetterRelysiaSDK} this
 * @returns {Promise<RelysiaUserProfileData>}
 */
export declare function getUserProfile(this: BetterRelysiaSDK): Promise<RelysiaUserProfileData>;
