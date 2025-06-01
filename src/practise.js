// src/App.js
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import IdentityNFTABI from "./IdentityNFT.json";


// Your contract's ABI
const CONTRACT_ABI = [
  // Only include what's needed
  "function mintIdentityNFT(address recipient, string memory tokenURI) public returns (uint256)"
];

const CONTRACT_ADDRESS = "0xf0E857Be93DdF32A5F2395046FE73b51426E7976";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tokenURI, setTokenURI] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    connectWalletOnPageLoad();
  }, []);

  async function connectWalletOnPageLoad() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
      } catch (err) {
        if (err.code === 4001) {
          console.log("User rejected the connection request.");
        } else {
          console.error("Failed to connect wallet:", err);
        }
      }
    } else {
      alert("MetaMask not detected. Please install it.");
    }
  }
  

  async function mintNFT() {
    if (!recipient || !tokenURI) {
      alert("Please enter both recipient and tokenURI");
      return;
    }
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
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.mintIdentityNFT(recipient, tokenURI);
      setStatus("Transaction sent. Waiting for confirmation...");
      await tx.wait();
      setStatus("NFT minted successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Error minting NFT. Check console.");
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
      <div className="container">
        <h1>Mint Identity NFT</h1>
  
        <div className="address">
          {walletAddress ? `Connected Wallet: ${walletAddress}` : "Wallet not connected"}
        </div>
  
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
  
        <input
          type="text"
          placeholder="Token URI (IPFS link)"
          value={tokenURI}
          onChange={(e) => setTokenURI(e.target.value)}
        />
  
        <button onClick={mintNFT} disabled={!walletAddress}>
          Mint NFT
        </button>
  
        <p className="status">{status}</p>
      </div>
    </div>
  );  
}

export default App;
//-----------------------------------------------
import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    imageFile: null,
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    // NEXT STEP: Upload to IPFS and Mint NFT
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Mint Your Identity NFT</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Name</label>
          <input
            type="text"
            name="username"
            placeholder="Your name"
            value={formData.username}
            onChange={handleInputChange}
            style={styles.input}
            required
          />

          <label style={styles.label}>Bio</label>
          <textarea
            name="bio"
            placeholder="A short bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows="3"
            style={{ ...styles.input, resize: "vertical" }}
            required
          />

          <label style={styles.label}>Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.fileInput}
            required
          />

          <button type="submit" style={styles.button}>
            Submit & Mint NFT
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    fontFamily: "sans-serif",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
    maxWidth: "400px",
    width: "100%",
  },
  heading: {
    fontSize: "1.75rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#4a4a4a",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    padding: "0.6rem 0.8rem",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
  },
  fileInput: {
    padding: "0.4rem",
  },
  button: {
    padding: "0.75rem",
    background: "#6C63FF",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "1rem",
    transition: "background 0.3s ease",
  },
};

export default App;
/*eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhNTljZmFlMC0zZDdlLTRmYTEtYjcxMy1mYTQ3YjNlMzVhMTAiLCJlbWFpbCI6ImFuaWtldGRhdmUwMDJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImY1ZmE3MmRiYjdmM2VlNzBmYmRiIiwic2NvcGVkS2V5U2VjcmV0IjoiNTI1NzJmMzI2Y2NhNjEyNzZkNzdmYjJhNzJkNzVhNDlmMzIxZWNmYmNiNWU4M2FhYjVhNjg0MDljMDAzN2ViNiIsImV4cCI6MTc3ODk5OTI2NX0.TVehaS3_J8GsDL3W8lY2tVBreRvwK6ejoM2eWTwjGRw */
/*API Key: f5fa72dbb7f3ee70fbdb
API Secret: 52572f326cca61276d77fb2a72d75a49f321ecfbcb5e83aab5a68409c0037eb6
JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhNTljZmFlMC0zZDdlLTRmYTEtYjcxMy1mYTQ3YjNlMzVhMTAiLCJlbWFpbCI6ImFuaWtldGRhdmUwMDJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImY1ZmE3MmRiYjdmM2VlNzBmYmRiIiwic2NvcGVkS2V5U2VjcmV0IjoiNTI1NzJmMzI2Y2NhNjEyNzZkNzdmYjJhNzJkNzVhNDlmMzIxZWNmYmNiNWU4M2FhYjVhNjg0MDljMDAzN2ViNiIsImV4cCI6MTc3ODk5OTI2NX0.TVehaS3_J8GsDL3W8lY2tVBreRvwK6ejoM2eWTwjGRw */