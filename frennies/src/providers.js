// Corrected imports for a web environment
import { ethers } from 'ethers';
import Web3Modal from 'web3modal'; // No need to use `{ Web3Modal }`
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for Web3
const Web3Context = createContext();

// Web3Provider component to wrap around your app
export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');

  // Initialize Web3Modal without `AsyncStorage` as it's specific to React Native
  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions: {},
  });

  // Function to connect to the wallet
  const connectWallet = async () => {
    try {
      const instance = await web3Modal.connect();
      const ethersProvider = new ethers.providers.Web3Provider(instance);
      setProvider(ethersProvider);

      const signer = ethersProvider.getSigner();
      setSigner(signer);

      const userAddress = await signer.getAddress();
      setAddress(userAddress);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Provide the Web3 values throughout the app
  return (
    <Web3Context.Provider value={{ provider, signer, address, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use the Web3 context
export const useWeb3 = () => useContext(Web3Context);
