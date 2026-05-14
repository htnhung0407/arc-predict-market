# ArcPredict - Crypto Prediction Market

Welcome to ArcPredict! This is a complete, beautiful prediction market dApp built for the Arc Testnet. 

Since you mentioned you are not a coder, I have written down exactly what you need to do step-by-step.

> **Important Note:** You tried to run `git init` and `npx` earlier, but those commands failed because your computer does not have `Git` or `Node.js` installed (or they are not in your system's PATH). **You must install Node.js to run this application.**
> Download Node.js here: https://nodejs.org/ (Download the "LTS" version and install it).

---

## 🚀 Step 1: Install Dependencies

Once you have installed Node.js, open your terminal (PowerShell or Command Prompt) in this folder (`c:\Users\Administrator\arc-predict-market`) and run:

```bash
npm install
```
*This will download all the required packages to run the frontend and the smart contracts.*

## 🚀 Step 2: Set up your Wallet

1. You need a wallet like **MetaMask** or **Rabby Wallet** installed in your browser.
2. Open the `.env.example` file in this folder and rename it to `.env`.
3. Inside the `.env` file, replace `your_private_key_here_for_deployment` with your actual wallet private key. *(Do not share this key with anyone!)*

## 🚀 Step 3: Deploy the Smart Contract (Optional)

If you want to deploy the smart contract to the Arc Testnet yourself, run:

```bash
npx hardhat run scripts/deploy.js --network arcTestnet
```
*Once deployed, the terminal will give you a "Contract Address". Open `src/utils/contract.js` and paste that address where it says `0xYOUR_DEPLOYED_CONTRACT_ADDRESS`.*

## 🚀 Step 4: Start the Website!

To start your beautiful neon prediction market, run:

```bash
npm run dev
```

It will give you a local web address (usually `http://localhost:5173`). 
**Click that link or copy-paste it into your browser.**

---

## 🖱️ How to use the App (What to click)

1. **Connect Wallet:** When the page loads, click the big **"Connect Wallet"** button in the top right.
2. **Switch Network:** If your wallet is not on the Arc Testnet, the button will turn red and say **"Switch Network"**. Click it, and your wallet will automatically prompt you to add/switch to the Arc Testnet.
3. **Daily Claim:** Once connected on the right network, you will see the **"Daily Alpha Drop"** section. Click the **"Claim 10 Points"** button. Your wallet will pop up asking you to sign a transaction.
4. **Predict:** Scroll down to the Active Markets. Find a question you like (e.g. "Will BTC be above $70,000 tomorrow?") and click either the **"YES"** or **"NO"** button.

Enjoy your beautiful new dApp!
