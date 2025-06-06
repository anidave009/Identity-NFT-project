# IdentityNFT
# IdentityNFT Minting dApp

IdentityNFT is a simple decentralized application (dApp) that allows users to mint an NFT representing a basic digital identity. Users can provide a name, a short bio, and upload a profile image. This information is then packaged into metadata, uploaded to IPFS via Pinata, and an NFT is minted on the blockchain (e.g., Sepolia Testnet) with the metadata URI. Users can also view the NFTs they have minted.

## Features

*   Connect to MetaMask wallet.
*   Input fields for Name and Bio.
*   Image uploader for a profile picture.
*   Uploads image and metadata to IPFS using Pinata.
*   Mints an NFT with the IPFS metadata URI to the user's wallet.
*   Displays status messages throughout the process.
*   Displays a gallery of NFTs owned by the connected user.

## Tech Stack

*   **Frontend:** React.js
*   **Ethereum Interaction:** Ethers.js (v6.x)
*   **Wallet:** MetaMask
*   **IPFS Pinning Service:** Pinata
*   **Smart Contract:** Solidity (`IdentityNFT.sol`)
*   **Target Network (Example):** Sepolia Testnet

## Prerequisites

Before you begin, ensure you have the following installed/set up:

1.  **Node.js and npm/yarn:**
    *   Node.js (v16.x or later recommended): [Download Node.js](https://nodejs.org/)
    *   npm (comes with Node.js) or Yarn: [Install Yarn](https://classic.yarnpkg.com/en/docs/install)
2.  **MetaMask Browser Extension:**
    *   Install MetaMask: [MetaMask.io](https://metamask.io/)
    *   Create or import an Ethereum wallet.
    *   Fund your wallet with Sepolia ETH (or ETH for your target testnet) from a faucet (e.g., [sepoliafaucet.com](https://sepoliafaucet.com/), [infura.io/faucet/sepolia](https://infura.io/faucet/sepolia)).
3.  **Pinata Account:**
    *   Sign up for a free account at [Pinata.cloud](https://www.pinata.cloud/).
    *   Generate an API Key with JWT permissions. You will need this JWT.
4.  **Remix IDE (Online):**
    *   We'll use Remix for contract deployment: [Remix Ethereum IDE](https://remix.ethereum.org/)

## Project Setup and Running Locally
1 . Set up the React Environment :
 * Watch a quick youtube video on how to setup a react environment (it is simple).Replace the App.js and App.css(this will be existing files when you create a react env/app) with the one i provided above.
 * If you have an existing Create React App project, you can replace its src/App.js and src/App.css with the versions from this repository.
 * Ensure your src/index.js is set up to render the <App /> component. A standard Create React App index.js will work.

2. Deploy the IdentityNFT.sol Smart Contract (using Remix IDE)
 
3.  Go to Remix Ethereum IDE.
* Create a new file (e.g., IdentityNFT.sol) and paste the Solidity code into it.
* If your contract imports OpenZeppelin contracts (like the example above), Remix will usually fetch them automatically. If not, you might need to import them via GitHub URL or npm.
* Go to the "Solidity Compiler" tab. Select a compatible compiler version (e.g., 0.8.9 or whatever your pragma specifies).
* Click "Compile IdentityNFT.sol".
* Go to the "Deploy & Run Transactions" tab.
* Under "ENVIRONMENT", select "Injected Provider - MetaMask". (Ensure MetaMask is connected to the Sepolia Testnet or your desired testnet).
* Under "CONTRACT", ensure IdentityNFT is selected.
* Click the "Deploy" button.
* Confirm the transaction in MetaMask.
* Once deployed, find the "Deployed Contracts" section in Remix. Copy the address of your deployed IdentityNFT contract.

4. Set up Pinata:
Go to Pinata.cloud and log in.
Navigate to the "API Keys" section of your Pinata dashboard.
Create a new API Key. Give it Admin permissions (or at least pinJSONToIPFS and pinFileToIPFS permissions).
Copy the JWT (JSON Web Token) provided. This is your PINATA_JWT.

5. Configure App.js:
* Open src/App.js in your project.
* Find the following lines and replace the placeholder strings with your copied values:

6. Run the React Application: npm start
7. How to Use the IdentityNFT dApp
* Connect Wallet: The app will attempt to connect to MetaMask automatically when it loads. If not, there might be a connect button or you might need to interact with the page. Ensure MetaMask is unlocked and on the correct network (e.g., Sepolia).
* Fill the Form:
* Enter your desired Name.
* Write a short Bio.
* Click "Choose File" to select a Profile Image.
* Mint NFT:
* Once the form is complete and your wallet is connected, the "Submit & Mint NFT" button should be active.
* Click it.
* The app will:
* Upload your image to IPFS via Pinata.
* Upload your metadata (name, bio, image IPFS link) to IPFS via Pinata.
* Prompt you to confirm the minting transaction in MetaMask (this will incur gas fees).
* Check Status: Follow the status messages displayed in the app.
* View Your NFT: Once minted, the NFT should appear in the "Your Minted NFTs" gallery section at the bottom of the page. You can also check your wallet on a block explorer or NFT marketplace that supports your testnet
8. "MetaMask is not detected": Ensure the MetaMask extension is installed and enabled in your browser.
* "Failed to connect wallet": Make sure MetaMask is unlocked and you've approved the connection request.
* IPFS Upload Errors: Double-check your PINATA_JWT in App.js is correct and active. Check your Pinata account for any API usage limits or issues.
* Minting Errors / Transaction Failed: Ensure CONTRACT_ADDRESS in App.js is correct for your deployed contract on the selected network. Make sure your connected wallet has enough Sepolia ETH (or testnet ETH) for gas fees.
* Check the browser console for more detailed error messages from Ethers.js or MetaMask.
* NFTs not showing in gallery: Verify the minting transaction was successful on a block explorer. Check console logs for errors during fetchOwnedNFTs. Ensure the CONTRACT_ADDRESS is correct for fetching.
