import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { ethers } from 'ethers';
import PredictionMarketArtifact from '../../artifacts/contracts/PredictionMarket.sol/PredictionMarket.json';

const ARC_TESTNET_CHAIN_ID_HEX = '0x4cef52';

const DailyClaim = ({ address, points, setPoints }) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [status, setStatus] = useState('');

  const switchToArcTestnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARC_TESTNET_CHAIN_ID_HEX }],
      });
    } catch (error) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: ARC_TESTNET_CHAIN_ID_HEX,
              chainName: 'Arc Testnet',
              nativeCurrency: {
                name: 'USDC',
                symbol: 'USDC',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.testnet.arc.network'],
              blockExplorerUrls: ['https://testnet.arcscan.app'],
            },
          ],
        });
      } else {
        throw error;
      }
    }
  };

  const handleClaim = async () => {
    try {
      setIsClaiming(true);
      setStatus('Checking wallet...');

      if (!window.ethereum) {
        throw new Error('Wallet not found.');
      }

      const contractAddress =
        import.meta.env.VITE_CONTRACT_ADDRESS ||
        '0x18b47ad9e8e820da05cf65b5c12d07d89c11b47cb';

      console.log('CONTRACT:', contractAddress);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('Wallet not connected.');
      }

      const currentAddress = accounts[0];

      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      if (chainId.toLowerCase() !== ARC_TESTNET_CHAIN_ID_HEX) {
        setStatus('Switching to Arc Testnet...');
        await switchToArcTestnet();
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        PredictionMarketArtifact.abi,
        signer
      );

      setStatus('Waiting for wallet confirmation...');

      const tx = await contract.dailyClaim({
        gasLimit: 300000,
      });

      setStatus('Transaction pending...');

      await tx.wait();

      setStatus('Daily claim confirmed!');

      setPoints(Number(points || 0) + 10);
    } catch (error) {
      console.error(error);

      let message =
        error?.shortMessage ||
        error?.reason ||
        error?.message ||
        'Transaction failed';

      if (message.includes('Can only claim once')) {
        message = 'You already claimed. Try again after 24 hours.';
      }

      if (message.toLowerCase().includes('user rejected')) {
        message = 'Transaction rejected in wallet.';
      }

      setStatus(message);
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
          This is a real Arc Testnet transaction and requires testnet USDC for gas.
        </p>

        <a
          href="https://faucet.circle.com/"
          target="_blank"
          rel="noreferrer"
          className="text-arcBlue text-sm underline mb-5"
        >
          Need gas? Get Arc Testnet USDC from faucet
        </a>

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
          <p className="text-arcBlue text-sm mt-4 break-words max-w-full">
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default DailyClaim;