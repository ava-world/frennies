// src/config.js
export const CONTRACT_ADDRESS = "0x1FD221D75562c6459EAB6aA9812A86F6ea279B98"; // Replace with real contract address

export const NETWORK = {
  chainId: `11155111`, // Sepolia testnet chain ID
  chainName: "Sepolia Testnet",
  nativeCurrency: {
    name: "SepoliaETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://sepolia.infura.io/v3/"], // Replace with your Infura link
  blockExplorerUrls: ["https://sepolia.etherscan.io/"],
};
