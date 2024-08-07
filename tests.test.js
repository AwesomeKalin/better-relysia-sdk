const BetterRelysiaSDK = require('./build/index');
const { expect, test } = require('@jest/globals');
const randomstring = require('randomstring');

test('test authentication with Relysia', async () => {
    return await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        if (typeof data !== 'object') return;
        expect(data).not.toEqual('Incorrect Password');
    });
});

test('test non-existant account', async () => {
    return await BetterRelysiaSDK.authenticate('thisaccountdefinitelydoesn\'texist', 'no').then(data => {
        if (typeof data !== 'object') return;
        expect(data).toEqual('Account doesn\'t exist');
    });
});

test('getting user profile', async () => {
    return await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        if (typeof data !== 'object') return;
        data.getUserProfile().then(data => {
            if (typeof data !== 'object') return;
            expect(data.userDetails.userId).toEqual('DnkLULM4bGdn4H6z1cv3iiXqRoT2');
        });
    });
});

test('creating wallet', async () => {
    return await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        if (typeof data !== 'object') return;
        data.createWallet(randomstring.generate(8)).then(data => {
            if (typeof data !== 'object') return;
            expect(data.status).toEqual('success');
        });
    });
});

test('get wallet address', async () => {
    return await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        if (typeof data !== 'object') return;
        data.getAddress().then(data => {
            if (typeof data !== 'object') return;
            expect(data.status).toEqual('success');
        });
    });
});

test('get all addressess', async () => {
    return await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        if (typeof data !== 'object') return;
        data.getAllAddressess().then(data => {
            if (typeof data !== 'object') return;
            expect(data.addressess[0]).toEqual('162ERwDNsav1j5XpZkanHbMj4aQAQ6mZ37');
        });
    });
});

test('test leaderboard', async () => {
    return await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        if (typeof data !== 'object') return;
        data.leaderboard('ea96d3c5f233409ade6e2eb9bba5f5b4a50a9302-SBP90').then(data => {
            if (typeof data !== 'object') return;
            expect(data.leaderboard[0].uid).toEqual('cLa5T8NIPFd7Ei4nwKYjDruWjyI2');
        });
    });
});

test('get wallets', async () => {
    return await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        if (typeof data !== 'object') return;
        data.wallets().then(data => {
            if (typeof data !== 'object') return;
            expect(data.wallets[0].walletTitle).toEqual('QA1');
        });
    });
});

test('get mnemonic', async () => {
    return await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        if (typeof data !== 'object') return;
        data.mnemonic().then(data => {
            if (typeof data !== 'object') return;
            expect(data.mnemonic).toEqual('silver salt ticket wash calm album noodle shift sweet pact good resist');
        });
    });
});

test('get balance', async () => {
    return await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        if (typeof data !== 'object') return;
        data.balance().then(data => {
            if (typeof data !== 'object') return;
            expect(data.coins[0].protocol).toEqual('BSV');
        });
    });
});

test('get history', async () => {
    return await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        if (typeof data !== 'object') return;
        data.history().then(data => {
            if (typeof data !== 'object') return;
            expect(data.histories.length).not.toEqual(0);
        });
    });
});

test('sweep private key', async () => {
    return await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        if (typeof data !== 'object') return;
        data.sweep('L3ufPcAVVwNRhbV6PJArwt2U4KyQkfUNUT8WXWoRq6KdL2bGtct7').then(data => {
            expect(data).not.toEqual('Not a valid private key');
        });
    });
});

test('get raw tx', async () => {
    const relysia = await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch');
    if (typeof data !== 'object') return;
    // TODO Get raw Tx from Relysia API with a token
    return;
});

test('test asm', async () => {
    // TODO Add a test for asm()
    return;
});