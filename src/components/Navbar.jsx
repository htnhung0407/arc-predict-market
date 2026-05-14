import React from 'react';
import { Wallet, AlertTriangle, Coins } from 'lucide-react';

const Navbar = ({ address, connectWallet, isCorrectNetwork, switchNetwork, points }) => {
  const formatAddress = (addr) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-arcBlue to-arcPurple animate-pulse shadow-[0_0_15px_rgba(0,210,255,0.5)]"></div>
        <span className="text-2xl font-bold tracking-wider neon-text-blue">ArcPredict</span>
      </div>

      <div className="flex items-center space-x-4">
        {address && isCorrectNetwork && (
          <div className="hidden md:flex items-center glass px-4 py-2 rounded-lg text-arcBlue font-bold space-x-2 border-arcBlue/30">
            <Coins size={18} className="text-arcBlue" />
            <span>{points} Points</span>
          </div>
        )}

        {!address ? (
          <button 
            onClick={connectWallet}
            className="flex items-center space-x-2 bg-gradient-to-r from-arcBlue to-arcPurple px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity text-white shadow-[0_0_15px_rgba(58,123,213,0.4)]"
          >
            <Wallet size={18} />
            <span>Connect Wallet</span>
          </button>
        ) : !isCorrectNetwork ? (
          <button 
            onClick={switchNetwork}
            className="flex items-center space-x-2 bg-red-500/20 border border-red-500 text-red-400 px-6 py-2 rounded-lg font-semibold hover:bg-red-500/30 transition-colors"
          >
            <AlertTriangle size={18} />
            <span>Switch Network</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2 glass px-6 py-2 rounded-lg font-semibold border-arcBlue/30 text-white">
            <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
            <span>{formatAddress(address)}</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
