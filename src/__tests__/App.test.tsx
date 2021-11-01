// Imports
// ========================================================
import { render, screen, act } from '@testing-library/react';
import user from '@testing-library/user-event';

// To Test
import App from '../App';

// Config
// ========================================================
// Test wallet address from Hardhat
const WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

// Mocks
// ========================================================
window.ethereum = {
  isMetaMask: true,
  request: async (request: { method: string, params?: Array<unknown> }) => {
    if (['eth_accounts', 'eth_requestAccounts'].includes(request.method)) {
      return [WALLET_ADDRESS]
    }
    
    throw Error(`Unknown request: ${request.method}`);
  },
}

// Tests
// ========================================================
/**
 * 
 */
test('Renders main page correctly', async () => {
  // TBD
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
test('Does not display wallet because not connected', () => {
  // TBD
});