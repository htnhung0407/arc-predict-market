import React, { useState, useEffect } from 'react';
import { Timer, TrendingUp, TrendingDown, Bitcoin } from 'lucide-react';

const MarketCard = ({ market, signer, address }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isBetting, setIsBetting] = useState(false);

  const totalPool = market.yesPool + market.noPool;
  const yesPercent = totalPool === 0 ? 50 : Math.round((market.yesPool / totalPool) * 100);
  const noPercent = totalPool === 0 ? 50 : Math.round((market.noPool / totalPool) * 100);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const distance = market.endTime - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("Ended");
      } else {
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${d}d ${h}h ${m}m`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [market.endTime]);

  const handleBet = (type) => {
    if (!address) return alert("Please connect wallet first");
    setIsBetting(true);
    // Simulate transaction
    setTimeout(() => {
      alert(`Successfully placed a demo ${type} bet!`);
      setIsBetting(false);
    }, 1500);
  };

  return (
    <div className="glass rounded-2xl p-6 glass-hover group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${market.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'}`}>
          {market.status}
        </div>
      </div>

      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${market.asset === 'BTC' ? 'bg-[#F7931A]/20 text-[#F7931A]' : 'bg-[#14F195]/20 text-[#14F195]'}`}>
          {market.asset === 'BTC' ? <Bitcoin size={24} /> : <span className="font-bold">SOL</span>}
        </div>
        <h3 className="text-xl font-bold leading-tight flex-1 pr-12">{market.question}</h3>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2 font-mono">
          <span className="text-green-400">Yes {yesPercent}%</span>
          <span className="text-red-400">No {noPercent}%</span>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden flex">
          <div className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500" style={{ width: `${yesPercent}%` }}></div>
          <div className="h-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500" style={{ width: `${noPercent}%` }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
          <span>{market.yesPool} pts</span>
          <span>{market.noPool} pts</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button 
          onClick={() => handleBet('YES')}
          disabled={isBetting || market.status !== 'Active'}
          className="flex items-center justify-center space-x-2 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-bold hover:bg-green-500/20 transition-colors disabled:opacity-50"
        >
          <TrendingUp size={18} />
          <span>YES</span>
        </button>
        <button 
          onClick={() => handleBet('NO')}
          disabled={isBetting || market.status !== 'Active'}
          className="flex items-center justify-center space-x-2 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          <TrendingDown size={18} />
          <span>NO</span>
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm">
        <div className="flex items-center space-x-2 text-gray-400">
          <Timer size={16} className="text-arcBlue" />
          <span>{timeLeft}</span>
        </div>
        
        {market.status === 'Resolved' && (
          <button className="text-arcBlue font-semibold hover:text-white transition-colors">
            Claim Reward
          </button>
        )}
      </div>
    </div>
  );
};

export default MarketCard;
