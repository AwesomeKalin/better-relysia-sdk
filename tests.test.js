const BetterRelysiaSDK = require('./build/index');
const { expect, test } = require('@jest/globals');
const randomstring = require('randomstring');

test('test authentication with Relysia', async () => {
    await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        expect(data).not.toEqual('Incorrect Password');
    });
});

test('test non-existant account', async () => {
    try {
        await BetterRelysiaSDK.authenticate('thisaccountdefinitelydoesn\'texist', 'no');
    } catch (e) {
        expect(e).toEqual('Account doesn\'t exist');
    }
});

test('getting user profile', async () => {
    await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        data.getUserProfile().then(data => {
            expect(data.userDetails.userId).toEqual('DnkLULM4bGdn4H6z1cv3iiXqRoT2');
        });
    });
});

test('creating wallet', async () => {
    await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        data.createWallet(randomstring.generate(8)).then(data => {
            expect(data.status).toEqual('success');
        });
    });
});

test('get wallet address', async () => {
    await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        data.getAddress().then(data => {
            expect(data.status).toEqual('success');
        });
    });
});

test('get all addressess', async () => {
    await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        data.getAllAddressess().then(data => {
            expect(data.addressess[0]).toEqual('162ERwDNsav1j5XpZkanHbMj4aQAQ6mZ37');
        });
    });
});

test('test leaderboard', async () => {
    await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        data.leaderboard('ea96d3c5f233409ade6e2eb9bba5f5b4a50a9302-SBP90').then(data => {
            expect(data.leaderboard[0].uid).toEqual('cLa5T8NIPFd7Ei4nwKYjDruWjyI2');
        });
    });
});

test('get wallets', async () => {
    await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        data.wallets().then(data => {
            expect(data.wallets[0].walletTitle).toEqual('QA1');
        });
    });
});

test('get mnemonic', async () => {
    await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        data.mnemonic().then(data => {
            expect(data.mnemonic).toEqual('silver salt ticket wash calm album noodle shift sweet pact good resist');
        });
    });
});

test('get balance', async () => {
    await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        data.balance().then(data => {
            expect(data.coins[0].protocol).toEqual('BSV');
        });
    });
});

test('get history', async () => {
    await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        data.history().then(data => {
            expect(data.histories.length).not.toEqual(0);
        });
    });
});

test('sweep private key', async () => {
    await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        data.sweep('L3ufPcAVVwNRhbV6PJArwt2U4KyQkfUNUT8WXWoRq6KdL2bGtct7').then(data => {
            expect(data).not.toEqual('Not a valid private key');
        });
    });
});

test('get raw tx', async () => {
    const relysia = await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch');
    // TODO Get raw Tx from Relysia API with a token
    return;
});

test('test asm', async () => {
    await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        data.asm('OP_FALSE OP_RETURN aabbcc', 0).then(data => {
            fetch(`https://api.whatsonchain.com/v1/bsv/main/tx/hash/${data.txid}`).then(data => {
                data.json().then(data => {
                    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
                    expect(data.vout[0].scriptPubKey.asm).toEqual('0 OP_RETURN 13417386');
                });
            });
        });
    });
});

test('token redemption', async () => {
    // TODO Test Token Redemption
    return;
});

test('test atomic swap', async () => {
    return await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        // TODO Test Atomic Swaps
    });
});

test('test atomic swap inspect', async () => {
    return await BetterRelysiaSDK.authenticate('satoshiasdsa@gmail.com', '4m4z1ngT3ch').then(data => {
        // TODO Test Atomic Swap Inspect
    });
})