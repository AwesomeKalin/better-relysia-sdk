const BetterRelysiaSDK = require('./build/index');
const { expect, test } = require('@jest/globals');

test('test authentication with Relysia', () => {
    return BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        expect(data).not.toEqual('Incorrect Password');
    });
});

test('getting user profile', () => {
    return BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        data.getUserProfile().then(data => {
            expect(data.data.userDetails.userId).toEqual('DnkLULM4bGdn4H6z1cv3iiXqRoT2');
        });
    });
});