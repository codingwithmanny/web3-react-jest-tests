// Imports
// ========================================================
import { useState } from 'react'
import { ethers} from 'ethers'
import logo from './logo.svg'
import './App.css'

// Main Component
// ========================================================
/**
 * 
 * @returns 
 */
const App = () =>{
  // State / Props
  const [walletAddress, setWalletAddress] = useState('');

  // Functions
  /**
   * 
   */
  const requestAccount = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  /**
   * 
   */
  const onClickShowMeYourWallet = async () => {
    if (typeof window.ethereum !== undefined) {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
    }
  }

  // Render
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={onClickShowMeYourWallet}>
            Show me your wallet
          </button>
        </p>
        {walletAddress ? <p>Your wallet address is: {walletAddress}</p> : null}
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  )
}

// Exports
// ========================================================
export default App
