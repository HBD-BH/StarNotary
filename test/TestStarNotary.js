
const StarNotary = artifacts.require("StarNotary");
const BigNumber = require('bignumber.js');

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});


it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!', "Star not initialized correctly")
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice, "Star is not for sale");
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance}); // Could use 'gas' parameter, as well
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2, "Balance of original did not increase");
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2, "Owner did not change");
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    const balance_user2_before = await web3.eth.getBalance(user2);
    let receipt = await instance.buyStar(starId, {from: user2, value: balance});
    const balance_user2_after = await web3.eth.getBalance(user2);

    // Calculating amount paid for gas: adapted from Ismael: https://ethereum.stackexchange.com/a/42175
    const gasUsed = BigNumber(receipt.receipt.gasUsed);

    // Obtain gasPrice from the transaction
    const tx = await web3.eth.getTransaction(receipt.tx);
    //let gasPrice = await web3.eth.getGasPrice(); // Seems to give wrong result
    let gasPrice = BigNumber(tx.gasPrice);

    //console.log(`Final balance: ${balance_user2_after.toString()}`);
    // console.log(`Final balance: ${Number(balance_user2_after)}`); // Giving a rounding error in last 5 digits
    //console.log(`Final balance: ${BigNumber(balance_user2_after)}`); // Avoiding the rounding error
    let gasFee = gasPrice * gasUsed;
    value = BigNumber(balance_user2_after).plus(gasFee).plus(BigNumber(starPrice));
    assert.equal(value, balance_user2_before, "Balances must be equal");

});

// Implement Task 2 Add supporting unit tests
it('can add the token name and token symbol properly', async() => {
    // Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    // Interpreting this test according to the hints mentioned in the project rubric (https://review.udacity.com/#:~:text=token%20name%20and%20token%20symbol) and in this pull request: https://github.com/udacity/nd1309-p2-Decentralized-Star-Notary-Service-Starter-Code/issues/13
    // Namely, not star name and star symbol, but token/contract name and token/contract symbol
});

it('lets 2 users exchange stars', async() => {
    // 1. Create 2 Stars with different tokenId
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    // 3. Verify that the owners changed
});

it('lets a user transfer a star', async() => {
    // 1. Create a Star with different tokenId
    // 2. Use the transferStar function implemented in the Smart Contract
    // 3. Verify the star owner changed.
});

it('lookUptokenIdToStarInfo test', async() => {
    // 1. Create a Star with different tokenId
    // 2. Call your method lookUptokenIdToStarInfo
    // 3. Verify if you Star name is the same
});
