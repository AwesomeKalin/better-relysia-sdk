const BetterRelysiaSDK = require('./build/index');
const { expect, test } = require('@jest/globals');
const randomstring = require('randomstring');

test('test authentication with Relysia', () => {
    return BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        expect(data).not.toEqual('Incorrect Password');
    });
});

test('test non-existant account', () => {
    return BetterRelysiaSDK.authenticate('thisaccountdefinitelydoesn\'texist', 'no').then(data => {
        expect(data).toEqual('Account doesn\'t exist');
    });
});

test('getting user profile', () => {
    return BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        data.getUserProfile().then(data => {
            expect(data.userDetails.userId).toEqual('DnkLULM4bGdn4H6z1cv3iiXqRoT2');
        });
    });
});

test('creating wallet', () => {
    return BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        data.createWallet(randomstring.generate(8)).then(data => {
            expect(data.status).toEqual('success');
        });
    });
})