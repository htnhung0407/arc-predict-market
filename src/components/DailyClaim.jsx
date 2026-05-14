import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { ethers } from 'ethers';
import PredictionMarketArtifact from '../../artifacts/contracts/PredictionMarket.sol/PredictionMarket.json';

const DailyClaim = ({ address, points, setPoints }) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [status, setStatus] = useState('');

  const handleClaim = async () => {
    try {
      setIsClaiming(true);
      setStatus('Waiting for wallet confirmation...');

      if (!window.ethereum) {
        throw new Error('Wallet not found');
      }

      if (!address) {
        throw new Error('Connect wallet first');
      }

      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

      if (!contractAddress) {
        throw new Error('Contract not configured');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        PredictionMarketArtifact.abi,
        signer
      );

      const tx = await contract.dailyClaim();

      setStatus('Transaction pending...');
      await tx.wait();

      setStatus('Daily claim confirmed!');
      setPoints(Number(points || 0) + 10);
    } catch (error) {
      console.error(error);

      setStatus(
        error?.shortMessage ||
        error?.message ||
        'Transaction failed'
      );
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-8 max-w-xl mx-auto relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-arcBlue/10 to-arcPurple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-arcBlue/20 to-arcPurple/20 flex items-center justify-center mb-4 border border-arcBlue/30 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
          <Gift className="text-arcBlue w-8 h-8" />
        </div>

        <h3 className="text-2xl font-bold mb-2 neon-text-blue">
          Daily Alpha Drop
        </h3>

        <p className="text-gray-400 mb-6">
          Claim 10 points every 24 hours.
          This requires Arc Testnet USDC gas fee.
        </p>

        <button
          onClick={handleClaim}
          disabled={isClaiming || !address}
          className={`px-12 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-arcBlue to-arcPurple text-white shadow-[0_0_20px_rgba(58,123,213,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,210,255,0.6)] ${
            isClaiming || !address
              ? 'opacity-70 cursor-not-allowed'
              : ''
          }`}
        >
          {isClaiming ? 'Claiming...' : 'Claim Daily'}
        </button>

        {!address && (
          <p className="text-red-400 text-sm mt-4">
            Connect wallet first.
          </p>
        )}

        {status && (
          <p className="text-arcBlue text-sm mt-4">
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default DailyClaim;