// Imports
// ========================================================
import { render, screen, act } from '@testing-library/react';
import user from '@testing-library/user-event';
import { ethers } from 'ethers';

// To Test
import App from '../App';

// Config
// ========================================================
// Test wallet address from Hardhat
const WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const SIGNED_MESSAGE = '0xa2162955fbfbac44ad895441a3501465861435d6615053a64fc9622d98061f1556e47c6655d0ea02df00ed6f6050298eea381b4c46f8148ecb617b32695bdc451c';
const ERROR_DECLINED_REQUEST = 'User rejected the request.';
const ERROR_DECLINED_SIGNATURE = 'MetaMask Message Signature: User denied message signature.';

// Mocks
// ========================================================
// For resetting back to original
const WINDOW_ETHEREUM = {
  isMetaMask: true,
  request: async (request: { method: string, params?: Array<unknown> }) => {
    // console.log(request.method); to see the different requests made by ethers
    if (['eth_accounts', 'eth_requestAccounts'].includes(request.method)) {
      return [WALLET_ADDRESS]
    } else if (['personal_sign'].includes(request.method)) {
      return SIGNED_MESSAGE;
    }
    
    throw Error(`Unknown request: ${request.method}`);
  },
}

/**
 * 
 */
window.ethereum = WINDOW_ETHEREUM;

// Tests
// ========================================================
/**
 * 
 */
afterEach(() => {
  window.ethereum = {...WINDOW_ETHEREUM };
});

/**
 * 
 */
test('Renders main page correctly', async () => {
  // Setup
  render(<App />);

  // Post Expectations
  expect(await screen.queryByText(/Hello Vite \+ React!/)).toBeInTheDocument();
});

/**
 * 
 */
test('Displays connected wallet address', async () => {
  // Setup
  render(<App />);
  const buttonWallet = await screen.queryByText(/Show me your wallet/);

  // Pre Expecations
  expect(buttonWallet).toBeInTheDocument();

  // Init
  // - Because our button click is an async we need to both await the act and have it async
  await act(async () => {
    user.click(buttonWallet as HTMLElement);
  });

  // Post Expectations
  const regexWallet = new RegExp(`${WALLET_ADDRESS}`);
  expect(await screen.queryByText(regexWallet)).toBeInTheDocument();
});

/**
 * 
 */
test('Does not display wallet because not connected', async () => {
  // Setup
  window.ethereum = {
    ...WINDOW_ETHEREUM,
    request: async (request: { method: string, params?: Array<unknown> }) => {
      if (['eth_accounts', 'eth_requestAccounts'].includes(request.method)) {
        throw Error(ERROR_DECLINED_REQUEST);
      }
      
      throw Error(`Unknown request: ${request.method}`);
    },
  }
  render(<App />);
  const buttonWallet = await screen.queryByText(/Show me your wallet/);

  // Pre Expecations
  expect(buttonWallet).toBeInTheDocument();

  // Init
  // - Because our button click is an async we need to both await the act and have it async
  await act(async () => {
    user.click(buttonWallet as HTMLElement);
  });

  // Post Expectations
  const regexWallet = new RegExp(`${WALLET_ADDRESS}`);
  expect(await screen.queryByText(regexWallet)).not.toBeInTheDocument();
});

/**
 * 
 */
test('Signs message with connected wallet', async () => {
  // Setup
  render(<App />);
  const buttonWallet = await screen.queryByText(/Show me your wallet/);
  const buttonSignMessage = await screen.queryByText(/Sign message/);

  // Pre Expecations
  expect(buttonWallet).toBeInTheDocument();
  expect(buttonSignMessage).not.toBeInTheDocument();

  // Init
  await act(async () => {
    user.click(buttonWallet as HTMLElement);
  });

  await act(async () => {
    user.click(await screen.queryByText(/Sign message/) as HTMLElement);
  })

  // Post Expectations
  const regexWallet = new RegExp(`${WALLET_ADDRESS}`);
  const signedMessageParagraph = await screen.queryByText(/Your signed message:/);
  const signedMessage = signedMessageParagraph?.innerHTML.replace('Your signed message: ', '');
  expect(signedMessageParagraph).toBeInTheDocument();
  expect(await screen.queryByText(regexWallet)).toBeInTheDocument();
  expect(await screen.queryByText(/Sign message/)).toBeInTheDocument();
  expect(ethers.utils.verifyMessage('Hello there!', signedMessage as string)).toBe(WALLET_ADDRESS);
});

 /**
 * 
 */
test('Does NOT sign message with connected wallet because canceled', async () => {
  // Setup
  window.ethereum = {
    ...WINDOW_ETHEREUM,
    request: async (request: { method: string, params?: Array<unknown> }) => {
      if (['eth_accounts', 'eth_requestAccounts'].includes(request.method)) {
        return [WALLET_ADDRESS]
      } else if (['personal_sign'].includes(request.method)) {
        throw Error(ERROR_DECLINED_SIGNATURE);
      }
      
      throw Error(`Unknown request: ${request.method}`);
    },
  }
  render(<App />);
  const buttonWallet = await screen.queryByText(/Show me your wallet/);
  const buttonSignMessage = await screen.queryByText(/Sign message/);

  // Pre Expecations
  expect(buttonWallet).toBeInTheDocument();
  expect(buttonSignMessage).not.toBeInTheDocument();

  // Init
  await act(async () => {
    user.click(buttonWallet as HTMLElement);
  });

  await act(async () => {
    user.click(await screen.queryByText(/Sign message/) as HTMLElement);
  })

  // Post Expectations
  const regexWallet = new RegExp(`${WALLET_ADDRESS}`);
  const regexDeclinedSignature = new RegExp(`Signature declined. "${ERROR_DECLINED_SIGNATURE}"`);
  const signedMessageParagraph = await screen.queryByText(/Your signed message:/);
  expect(signedMessageParagraph).not.toBeInTheDocument();
  expect(await screen.queryByText(regexWallet)).toBeInTheDocument();
  expect(await screen.queryByText(/Sign message/)).toBeInTheDocument();
  expect(await screen.queryByText(regexDeclinedSignature)).toBeInTheDocument();
});