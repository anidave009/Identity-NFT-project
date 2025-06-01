import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
// Replace with your contract's ABI and address
import IdentityNFTABI from "./IdentityNFT.json";
const CONTRACT_ADDRESS = "0xYourContractAddressHere";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    checkWalletConnection();
  }, []);

  async function checkWalletConnection() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
    } else {
      alert("Please install MetaMask!");
    }
  }

  async function mintNFT() {
    if (!recipient || !username || !bio) {
      setStatus("Please fill in all fields.");
      return;
    }

    // 1. Create metadata JSON
    const metadata = {
      name: username,
      description: bio,
      image: "ipfs://your_image_link_or_leave_blank"
    };

    // 2. Upload to IPFS (replace with real API call)
    const tokenURI = await uploadToIPFS(metadata);
    if (!tokenURI) {
      setStatus("Failed to upload metadata.");
      return;
    }

    // 3. Call smart contract
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, IdentityNFTABI.abi, signer);

      const tx = await contract.mintIdentityNFT(recipient, tokenURI);
      await tx.wait();

      setStatus("NFT Minted Successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Error minting NFT.");
    }
  }

  // Simulated IPFS upload function (replace this with real Pinata or NFT.Storage logic)
  async function uploadToIPFS(metadata) {
    const metadataString = JSON.stringify(metadata);
    console.log("Uploading metadata:", metadataString);
    // Simulate IPFS return link
    return "ipfs://QmFakeCID123/metadata.json";
  }

  return (
    <div className="App">
      <h1>Mint Identity NFT</h1>
      <p>Connected Wallet: {walletAddress || "Not connected"}</p>

      <input
        type="text"
        placeholder="Recipient Wallet Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <textarea
        placeholder="Short Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
      <button onClick={mintNFT}>Mint NFT</button>
      <p>{status}</p>
    </div>
  );
}

export default App;
