// src/App.js
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'react-web3modal';
import contractABI from './abi.json';
import { CONTRACT_ADDRESS, NETWORK } from './config';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const web3Modal = new Web3Modal({ cacheProvider: true });

  const connectWallet = async () => {
    try {
      const instance = await web3Modal.connect();
      const web3Provider = new ethers.providers.Web3Provider(instance);
      const userSigner = web3Provider.getSigner();
      const deployedContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, userSigner);

      setProvider(web3Provider);
      setSigner(userSigner);
      setContract(deployedContract);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  const mintFriendshipNFT = async (friendAddress) => {
    try {
      const tx = await contract.mint(friendAddress);
      await tx.wait();
      alert("Friendship NFT Minted!");
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
  };

  const burnNFT = async (tokenId) => {
    try {
      const tx = await contract.burn(tokenId);
      await tx.wait();
      alert("Friendship NFT Burned!");
    } catch (error) {
      console.error("Error burning NFT:", error);
    }
  };

  useEffect(() => {
    if (provider) {
      provider.send("wallet_switchEthereumChain", [{ chainId: NETWORK.chainId }]);
    }
  }, [provider]);

  return (
    <div>
      <h1>Friendship NFT DApp</h1>
      {!signer ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <input type="text" placeholder="Friend's Address" id="friendAddress" />
          <button onClick={() => mintFriendshipNFT(document.getElementById('friendAddress').value)}>
            Mint Friendship NFT
          </button>

          <input type="number" placeholder="Token ID" id="tokenId" />
          <button onClick={() => burnNFT(document.getElementById('tokenId').value)}>
            Burn NFT
          </button>
        </>
      )}
    </div>
  );
}

export default App;
