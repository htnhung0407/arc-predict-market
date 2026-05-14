import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DailyClaim from './components/DailyClaim';
import MarketCard from './components/MarketCard';
import { ethers } from 'ethers';
import { ARC_TESTNET_CONFIG, CONTRACT_ABI, CONTRACT_ADDRESS } from './utils/contract';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [points, setPoints] = useState(0);

  // Hardcoded markets for demo
  const markets = [
    {
      id: 0,
      question: "Will BTC be above $70,000 tomorrow?",
      asset: "BTC",
      yesPool: 1500,
      noPool: 800,
      endTime: Date.now() + 86400000,
      status: "Active"
    },
    {
      id: 1,
      question: "Will SOL be above $180 this week?",
      asset: "SOL",
      yesPool: 3000,
      noPool: 4500,
      endTime: Date.now() + 604800000,
      status: "Active"
    },
    {
      id: 2,
      question: "Will BTC close green today?",
      asset: "BTC",
      yesPool: 1200,
      noPool: 1100,
      endTime: Date.now() + 21600000,
      status: "Active"
    },
    {
      id: 3,
      question: "Will SOL outperform BTC in 24h?",
      asset: "SOL",
      yesPool: 500,
      noPool: 200,
      endTime: Date.now() + 86400000,
      status: "Active"
    },
    {
      id: 4,
      question: "Will BTC dominance increase this week?",
      asset: "BTC",
      yesPool: 8000,
      noPool: 10000,
      endTime: Date.now() + 604800000,
      status: "Active"
    }
  ];

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      checkConnection();
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAddress('');
      setSigner(null);
    } else {
      setAddress(accounts[0]);
      updateSigner();
    }
  };

  const handleChainChanged = (chainId) => {
    window.location.reload();
  };

  const checkConnection = async () => {
    if (window.ethereum) {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(_provider);
      const network = await _provider.getNetwork();
      setIsCorrectNetwork(network.chainId.toString() === "5042002");

      const accounts = await _provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        const _signer = await _provider.getSigner();
        setSigner(_signer);
        fetchPoints(_signer, accounts[0]);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        await _provider.send("eth_requestAccounts", []);
        const _signer = await _provider.getSigner();
        const _address = await _signer.getAddress();
        
        setProvider(_provider);
        setSigner(_signer);
        setAddress(_address);

        const network = await _provider.getNetwork();
        setIsCorrectNetwork(network.chainId.toString() === "5042002");
        
        if (network.chainId.toString() === "5042002") {
          fetchPoints(_signer, _address);
        }
      } catch (error) {
        console.error("User rejected request", error);
      }
    } else {
      alert("Please install MetaMask or Rabby!");
    }
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARC_TESTNET_CONFIG.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ARC_TESTNET_CONFIG],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const fetchPoints = async (_signer, _address) => {
    // In a real app, this connects to the contract
    // For demo purposes and since contract isn't deployed yet:
    setPoints(100); 
  };

  return (
    <div className="min-h-screen font-sans">
      <Navbar 
        address={address} 
        connectWallet={connectWallet} 
        isCorrectNetwork={isCorrectNetwork}
        switchNetwork={switchNetwork}
        points={points}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 mt-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 neon-text-blue bg-clip-text text-transparent bg-gradient-to-r from-arcBlue to-arcPurple">
            Predict BTC & SOL.<br/>Claim Daily. Win Rewards.
          </h1>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
            Testnet demo only. Not financial advice. The premier prediction market on the Arc network.
          </p>
        </div>

        {address && isCorrectNetwork && (
          <DailyClaim signer={signer} address={address} points={points} setPoints={setPoints} />
        )}

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 neon-text-purple">Active Markets</h2>
          
          {!address ? (
            <div className="glass rounded-xl p-12 text-center text-gray-400 border-yellow-500/30 border">
              <p className="text-xl">Please connect your wallet to view and interact with markets.</p>
              <button 
                onClick={connectWallet}
                className="mt-6 px-8 py-3 bg-gradient-to-r from-arcBlue to-arcPurple text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Connect Wallet
              </button>
            </div>
          ) : !isCorrectNetwork ? (
            <div className="glass rounded-xl p-12 text-center text-gray-400 border-red-500/30 border">
              <p className="text-xl">Please switch to the Arc Testnet to view markets.</p>
              <button 
                onClick={switchNetwork}
                className="mt-6 px-8 py-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg font-bold hover:bg-red-500/30 transition-colors"
              >
                Switch Network
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {markets.map(market => (
                <MarketCard 
                  key={market.id} 
                  market={market} 
                  signer={signer}
                  address={address}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-8 text-gray-500 border-t border-white/10 mt-20 glass">
        <p>Built for the Arc Testnet. 2026 ArcPredict.</p>
      </footer>
    </div>
  );
}

export default App;
