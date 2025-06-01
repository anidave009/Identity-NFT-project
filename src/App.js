import React, { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";
import "./App.css"; // Import the CSS file

// Pinata JWT (copy from your dashboard's API Key)
// IMPORTANT: In a real app, never expose your JWT directly in client-side code.
// Use a backend server to handle Pinata API calls.
const PINATA_JWT = "paste your pinata JWT api key/jwt here, remember to keep it secret and remove while deploying";
// Smart contract details
const CONTRACT_ADDRESS = "paste your deployed contract address here, keep this also safe and secret"; // 
const CONTRACT_ABI = [
  "function mintNFT(address recipient, string memory tokenURI) public returns (uint256)",
  "function tokenCounter() public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function tokenURI(uint256 tokenId) public view returns (string)",y
];


function App() {
  // Combine form data into a single state object
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    imageFile: null,
  });
  // State for wallet address and transaction status
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState(""); // For displaying messages to the user
// Automatically connect wallet on component mount
  useEffect(() => {
    connectWallet();
  }, []);
  const [ownedNFTs, setOwnedNFTs] = useState([]);

useEffect(() => {
  if (walletAddress) {
    fetchOwnedNFTs();
  }
}, [walletAddress]);

async function fetchOwnedNFTs() {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    const count = await contract.tokenCounter();
    const items = [];

    for (let tokenId = 0; tokenId < count; tokenId++) {
      const owner = await contract.ownerOf(tokenId);
      if (owner.toLowerCase() === walletAddress.toLowerCase()) {
        const tokenURI = await contract.tokenURI(tokenId);
        const url = tokenURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
        const metadata = await axios.get(url);
        items.push({ tokenId, ...metadata.data });
      }
    }

    setOwnedNFTs(items);
  } catch (error) {
    console.error("Error fetching NFTs:", error);
  }
}


  // Connects to MetaMask and sets the connected wallet address
  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
        setStatus("Wallet connected successfully!");
      } catch (error) {
        console.error("Error connecting wallet:", error);
        setStatus("Failed to connect wallet. Please ensure MetaMask is installed and unlocked.");
      }
    } else {
      setStatus("Please install MetaMask to use this app.");
      alert("MetaMask is not detected. Please install it to use this application.");
    }
  }

  // Handle changes for text inputs (username, bio)
  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle change for image file input
  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  // Upload image to IPFS using Pinata
async function uploadImageToIPFS(file) {
  setStatus("Uploading image to IPFS...");
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  const data = new FormData();
  data.append("file", file);

  try {
    const res = await axios.post(url, data, {
      maxBodyLength: Infinity,
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`,
      },
    });
    console.log("Image uploaded to IPFS:", res.data.IpfsHash);
    return `ipfs://${res.data.IpfsHash}`;
  } catch (error) {
    console.error("Detailed IPFS upload error:", error?.response || error?.message || error);
    throw new Error("Failed to upload image to IPFS.");
  }
}
  // Upload metadata JSON to IPFS
  async function uploadMetadataToIPFS(metadata) {
    setStatus("Uploading metadata to IPFS...");
    try {
      const res = await axios.post(
        `https://api.pinata.cloud/pinning/pinJSONToIPFS`,
        metadata,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PINATA_JWT}`,
          }
        }
      );
      console.log("Metadata uploaded to IPFS:", res.data.IpfsHash);
      return `ipfs://${res.data.IpfsHash}`;
    } catch (error) {
  console.error("Error uploading metadata to IPFS:", error.response?.data || error.message);
  throw new Error("Failed to upload metadata to IPFS.");
}
  }

  // Main submission and minting logic
  async function handleSubmit(e) {
    e.preventDefault();

    if (!walletAddress) {
      setStatus("Please connect your wallet first.");
      await connectWallet(); // Try connecting again if not connected
      return;
    }

    const { username, bio, imageFile } = formData;

    if (!username || !bio || !imageFile) {
      setStatus("Please fill out all fields and select an image.");
      return;
    }

    try {
      // 1. Upload Image
      const imageIPFS = await uploadImageToIPFS(imageFile);

      // 2. Prepare and Upload Metadata
      const metadata = {
        name: username,
        description: bio,
        image: imageIPFS,
        attributes: [
          // You can add more attributes here if your NFT design needs them
          {
            trait_type: "Bio Length",
            value: bio.length,
          },
        ],
      };
      const metadataURI = await uploadMetadataToIPFS(metadata);

      // 3. Mint NFT
      setStatus("Initiating NFT minting transaction...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      console.log(`Minting NFT for ${walletAddress} with URI: ${metadataURI}`);
      const tx = await contract.mintNFT(walletAddress, metadataURI);
      setStatus("Transaction sent. Waiting for confirmation...");
      await tx.wait(); // Wait for the transaction to be mined

      setStatus(`NFT minted successfully ! Check your wallet`);
      // Optionally reset form
      setFormData({ username: "", bio: "", imageFile: null });

    } catch (err) {
      console.error("Minting process failed:", err);
      // More user-friendly error messages based on error type
      if (err.code === 4001) { // User rejected transaction
        setStatus("Transaction rejected by user.");
      } else if (err.message.includes("insufficient funds")) {
        setStatus("Insufficient funds for gas fees. Please add more ETH to your wallet.");
      } else {
        setStatus(`Error minting NFT: ${err.message || "An unknown error occurred."}`);
      }
    }
  }
return (
  <div className="page">
    <div className="card">
      <h1 className="heading">Mint Your Identity NFT</h1>

      <form onSubmit={handleSubmit} className="form">
        <label className="label" htmlFor="username">Name</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Your unique name"
          value={formData.username}
          onChange={handleInputChange}
          className="input"
          required
        />

        <label className="label" htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          placeholder="A short bio about yourself or your identity."
          value={formData.bio}
          onChange={handleInputChange}
          rows="3"
          className="input textarea-input"
          required
        />

        <label className="label" htmlFor="imageFile">Profile Image</label>
        <input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input"
          required
        />
        {formData.imageFile && (
          <p className="file-name-display">
            Selected file: <strong>{formData.imageFile.name}</strong>
          </p>
        )}

        <button type="submit" className="button" disabled={!walletAddress}>
          {walletAddress ? "Submit & Mint NFT" : "Connect Wallet to Mint"}
        </button>
      </form>

      {status && (
        <p className={`status-message ${
          status.includes("Error") ? "error" :
          status.includes("successfully") ? "success" : "info"
        }`}>{status}</p>
      )}


    </div>

    {/* 👇 NFT Gallery Section - moved inside return */}
    {ownedNFTs.length > 0 && (
      <div className="nft-gallery">
        <h2>Your Minted NFTs</h2>
        <div className="nft-grid">
          {ownedNFTs.map((nft) => (
            <div key={nft.tokenId} className="nft-card">
              <img
                src={nft.image.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")}
                alt={nft.name}
                className="nft-image"
              />
              <h3>{nft.name}</h3>
              <p>{nft.description}</p>
              <small>Token ID: {nft.tokenId}</small>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
}

export default App;