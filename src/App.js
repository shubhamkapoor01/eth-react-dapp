import { useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Token from './artifacts/contracts/Token.sol/Token.json';
import './App.css';

const greeterAddress = "0xfC794C80b6093332c59d479AC625df6448C9B8D4"
const tokenAddress = "0x648965563a86a8133AF1F8b23097bA9e7E875735"

function App() {
const [greeting, setGreetingValue] = useState('');
const [userAccount, setUserAccount] = useState('');
const [amount, setAmount] = useState(0);

  async function requestAccount() {
    await window.ethereum.request({method: 'eth_requestAccounts'})
  }

  async function getBalance() {
    const [account] = await window.ethereum.request({method: 'eth_requestAccounts'})
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
    const balance = await contract.balanceOf(account);
    console.log("Balance: ", balance.toString());
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer)
      const transaction = await contract.transfer(userAccount, amount)
      await transaction.wait()
      console.log(`${amount} coins successfully sent to ${userAccount}`)
      setAmount(0)
      setUserAccount('')
    }
  }

  async function getGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      try {
        const data = await contract.greet()
        console.log('data : ', data)
      } catch (err) {
        console.log(err)
      }
    }
  }

  async function setGreeting() {
    if (!greeting) {
      alert("Greeting cannot be empty")
      return;
    }

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      setGreetingValue('')
      await transaction.wait()
      getGreeting()
    }
  }

  return (
    <div className="App">
      <button onClick={getGreeting}>get Greeting</button>
      <button onClick={setGreeting}>set Greeting</button>
      <input
        onChange={e => setGreetingValue(e.target.value)}
        placeholder="Set greeting value"
        value={greeting} 
      />
      <button onClick={getBalance}>Get Balance</button>
      <button onClick={sendCoins}>Send Coins</button>
      <input 
        onChange={e => setUserAccount(e.target.value)} 
        placeholder="Account ID"
        value={userAccount}
      />
      <input 
        onChange={e => setAmount(e.target.value)} 
        placeholder="Amount" 
      />
    </div>
  );
}

export default App;
