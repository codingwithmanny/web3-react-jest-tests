# Web3 React Jest Tests

This is a WIP on Jest tests working with an Ethereum wallet.
Support is mainly Metamask at the moment.

## Requirements

- Node `v16.13.0`
- Yarn `v1.22.10`
- Docker Image: https://github.com/codingwithmanny/hardhat-docker

## Contract / Docker Setup

This setup to create a localhost contract to work with the web client.

Clone the repository and follow the stepts in the `README.md` from:
[https://github.com/codingwithmanny/hardhat-docker](https://github.com/codingwithmanny/hardhat-docker)

When getting to the step of creating a `.env` file, copy the `CONTRACT_ADDRESS`.

In this repository, copy `.env.example` as `.env` and paste in the contract address as:

**File:** `.env`

```
# Must have prefix VITE_ to be exposed to client
VITE_CONTRACT_ADDRESS={COPIED-CONTRACT-ADDRESS-FROM-DOCKER}
```

## Client Setup

This is the setup for the web client to work with the Docker contract.

Install dependencies:

```bash
yarn install;
```

Run tests:

```bash
yarn test;
```

## Tests

There are the main file used for testing.

Main test file:
- `src/__tests__/App.test.jsx`

Mock used for images:
- `test/__mocks__/fileMock.js`

Main jest config file
- `jest.config.ts`

Main jest setup file to extend jest
- `jest.setup.ts`
