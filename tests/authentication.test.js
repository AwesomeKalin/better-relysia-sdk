const BetterRelysiaSDK = require('../build/index');
const { expect, test } = require('@jest/globals');

test('test authentication with Relysia', async () => {
    return BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        expect(data).not.toEqual('Incorrect Password');
    });
});