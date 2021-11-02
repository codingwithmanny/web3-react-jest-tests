// Imports
// ========================================================
import React, { useState } from 'react'
import { ethers} from 'ethers'
import logo from './logo.svg'
import './App.css'
// NOTE: '* as' is needed because Jest doesn't work with direct json file imports
import * as Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

// Main Component
// ========================================================
/**
 * 
 * @returns 
 */
const App = () =>{
  // State / Props
  const [walletAddress, setWalletAddress] = useState('');
  const [signedMessage, setSignedMessage] = useState('');
  const [errorSigned, setErrorSigned] = useState('');
  const [greeting, setGreeting] = useState('');
  const [transaction, setTransaction] = useState('');
  const [message, setMessage] = useState('');
  const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS || '';

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
      try {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      } catch (error) {
        // Do nothing (make sure the user can still click the button)
      }
    }
  }

  /**
   * 
   */
  const onClickSignMessage = async () => {
    if (typeof window.ethereum !== undefined) {
      setErrorSigned('');
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signed = await signer.signMessage('Hello there!');
        setSignedMessage(signed);
      } catch (error: any) {
        setErrorSigned(error?.message);
      }
    }
  }

  /**
   * 
   * @param event 
   */
  const onChangeGreeting = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGreeting(event.target.value);
  }

  /**
   * 
   */
  const onClickGetGreeting = async () => {
    if (typeof window.ethereum !== undefined) {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, Greeter.abi, signer);
      const result = await contract.greet();
      setMessage(result);
    }
  }

  /**
   * 
   * @param event 
   */
  const onSubmitGreeting = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Reset before submission
    setMessage('');

    if (typeof window.ethereum !== undefined) {
      try {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, Greeter.abi, signer);

        const result = await contract.greet();
        console.log({ result });

        const transaction = await contract.setGreeting(greeting);
        console.log({ transaction });
        setTransaction(transaction);
        
        // Wait for transaction to be complete
        await transaction.wait();

        // Output result
        const greet = await contract.greet();
        await contract.greet();
        setMessage(greet);
        setTransaction('');
        console.log({ result: greet });
      } catch (error) {
        console.log({ error });
      }
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
        {walletAddress ? <div>
          <p>Your wallet address is: {walletAddress}</p>
          <hr />
          <button type="button" onClick={onClickSignMessage}>
            Sign message
          </button>
          {signedMessage ? <p>Your signed message: {signedMessage}</p> : null}
          {errorSigned ? <code>Signature declined. {JSON.stringify(errorSigned)}</code> : null}
          <hr />
          <button type="button" onClick={onClickGetGreeting}>Get Greeting</button>
          <form onSubmit={onSubmitGreeting}>
            <p>
              <input type="text" name="greeting" value={greeting} onChange={onChangeGreeting} placeholder="Set a greeting" />
            </p>
            <p>
              <button type="submit">Update Greeting</button>
            </p>
          </form>
          {transaction ? <span>Transaction pending: {JSON.stringify(transaction)}</span> : null}
          {message ? <span>Contract message: {message}</span> : null}
          </div> : null}
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
