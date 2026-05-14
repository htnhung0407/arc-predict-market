import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { ethers } from 'ethers';
import PredictionMarketArtifact from '../../artifacts/contracts/PredictionMarket.sol/PredictionMarket.json';

// Arc Testnet config
const ARC_TESTNET_CHAIN_ID_HEX = '0x4cef52';
const ARC_TESTNET_CHAIN_ID_DECIMAL = 5038162; // 0x4cef52 in decimal

const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  '0x18b47ad9e8e20da05cf65b5c12d07d89c11b47cb';

const DailyClaim = ({ address, points, setPoints }) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [status, setStatus] = useState('');

  // Switch hoặc thêm Arc Testnet vào wallet
  const switchToArcTestnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARC_TESTNET_CHAIN_ID_HEX }],
      });
    } catch (error) {
      // Error 4902 = chain chưa được thêm vào wallet
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

      // Kiểm tra wallet có tồn tại không
      if (!window.ethereum) {
        throw new Error('Wallet not found. Please install Rabby or MetaMask.');
      }

      console.log('CONTRACT:', CONTRACT_ADDRESS);

      // Yêu cầu kết nối accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('Wallet not connected.');
      }

      // Kiểm tra chainId hiện tại
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      if (chainId.toLowerCase() !== ARC_TESTNET_CHAIN_ID_HEX) {
        setStatus('Switching to Arc Testnet...');
        await switchToArcTestnet();
      }

      // ✅ FIX: Truyền network config với ensAddress: null
      // để tránh lỗi "network does not support ENS"
      const provider = new ethers.BrowserProvider(window.ethereum, {
        chainId: ARC_TESTNET_CHAIN_ID_DECIMAL,
        name: 'arc-testnet',
        ensAddress: null, // Tắt ENS lookup — Arc Testnet không hỗ trợ ENS
      });

      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        PredictionMarketArtifact.abi,
        signer
      );

      setStatus('Waiting for wallet confirmation...');

      const tx = await contract.dailyClaim({
        gasLimit: 300000,
      });

      setStatus('Transaction pending...');
      await tx.wait();

      setStatus('Daily claim confirmed! +10 points 🎉');
      setPoints(Number(points || 0) + 10);
    } catch (error) {
      console.error(error);

      // Parse error message thân thiện
      let message =
        error?.shortMessage ||
        error?.reason ||
        error?.message ||
        'Transaction failed';

      if (message.includes('Can only claim once')) {
        message = 'You already claimed today. Try again after 24 hours.';
      }

      if (message.toLowerCase().includes('user rejected')) {
        message = 'Transaction rejected in wallet.';
      }

      if (message.toLowerCase().includes('insufficient funds')) {
        message = 'Insufficient USDC for gas. Get testnet USDC from faucet.';
      }

      setStatus(message);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-8 max-w-xl mx-auto relative overflow-hidden group">
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-arcBlue/10 to-arcPurple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-arcBlue/20 to-arcPurple/20 flex items-center justify-center mb-4 border border-arcBlue/30 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
          <Gift className="text-arcBlue w-8 h-8" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold mb-2 neon-text-blue">
          Daily Alpha Drop
        </h3>

        {/* Description */}
        <p className="text-gray-400 mb-6">
          Claim 10 points every 24 hours. This is a real Arc Testnet transaction
          and requires testnet USDC for gas.
        </p>

        {/* Faucet link */}
        <a
          href="https://faucet.circle.com/"
          target="_blank"
          rel="noreferrer"
          className="text-arcBlue text-sm underline mb-5 hover:text-arcPurple transition-colors"
        >
          Need gas? Get Arc Testnet USDC from faucet
        </a>

        {/* Claim button */}
        <button
          onClick={handleClaim}
          disabled={isClaiming || !address}
          className={`px-12 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-arcBlue to-arcPurple text-white shadow-[0_0_20px_rgba(58,123,213,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,210,255,0.6)] ${
            isClaiming || !address ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isClaiming ? 'Claiming...' : 'Claim Daily'}
        </button>

        {/* Wallet chưa kết nối */}
        {!address && (
          <p className="text-red-400 text-sm mt-4">
            Connect wallet first.
          </p>
        )}

        {/* Status message */}
        {status && (
          <p
            className={`text-sm mt-4 break-words max-w-full ${
              status.includes('confirmed') || status.includes('🎉')
                ? 'text-green-400'
                : status.toLowerCase().includes('error') ||
                  status.toLowerCase().includes('failed') ||
                  status.toLowerCase().includes('rejected') ||
                  status.toLowerCase().includes('already')
                ? 'text-red-400'
                : 'text-arcBlue'
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default DailyClaim;
