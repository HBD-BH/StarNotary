# Smart Contracts, Tokens and Dapps 

This repository is my solution to the second project of the Udacity "Blockchain Developer" Nanodegree. Below, you find some more information as well as some helpful screenshots.

## What problem does this application solve?



## Dependencies

- node: 16.14.2 
- npm: 8.5.0 (Use `npm -v`)
- Truffle v5.5.7 (core: 5.5.7)
- Ganache v^7.0.3
- Solidity v0.8.13 (solc-js, set in `truffle-config.js`)
- Node v16.14.2 (Use `node -v`)
- Web3.js v1.5.3
- Metamask: v10.12.3

Within `package.json`:
- "@openzeppelin/contracts": "^4.5.0", (Replaces `openzeppelin-solidity`)
- "@truffle/hdwallet-provider": "^2.0.5", (Replaces truffle-hdwallet-provider)
- "bignumber.js": "^9.0.2",    (For avoiding rounding errors)
- "ethereumjs-tx": "^2.1.2"

## Understanding the code



## Run the application

1. Clean the frontend: 
```bash
cd app
# Remove the node_modules  
# remove packages
rm -rf node_modules
# clean cache
npm cache clean
rm package-lock.json
# initialize npm (you can accept defaults)
npm init
# install all modules listed as dependencies in package.json
npm install
```

2. Start Truffle tests by running: `truffle migrate --reset`, then  `truffle test` (you can use `truffle console`, first)

3. Start frontend:
```bash
cd app
npm run dev
```

## Screenshots showing app functionality

1. Showing front end

2. The contract on [Etherscan](https://rinkeby.etherscan.io/address/0x1c617a8b8d88970ede710395ace9d8421f75e434). Name of the token: `CoolStars`, token symbol: `CST`. (Refer to `contracts/StarNotary.sol`)


