import React, { useState, useEffect } from 'react';
import { Gift, Clock } from 'lucide-react';

const DailyClaim = ({ signer, address, points, setPoints }) => {
  const [canClaim, setCanClaim] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);

  // Mocking the daily claim logic for the UI demo
  useEffect(() => {
    const lastClaim = localStorage.getItem(`lastClaim_${address}`);
    if (lastClaim) {
      const timePassed = Date.now() - parseInt(lastClaim);
      if (timePassed < 86400000) { // 24 hours in ms
        setCanClaim(false);
        updateTimer(parseInt(lastClaim) + 86400000);
      }
    }
  }, [address]);

  const updateTimer = (endTime) => {
    const interval = setInterval(() => {
      const now = Date.now();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(interval);
        setCanClaim(true);
        setTimeLeft("");
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  };

  const handleClaim = async () => {
    if (!canClaim) return;
    setIsClaiming(true);
    
    // Simulate transaction delay
    setTimeout(() => {
      setPoints(points + 10);
      localStorage.setItem(`lastClaim_${address}`, Date.now().toString());
      setCanClaim(false);
      setIsClaiming(false);
      updateTimer(Date.now() + 86400000);
    }, 2000);
  };

  return (
    <div className="glass rounded-2xl p-8 max-w-xl mx-auto relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-arcBlue/10 to-arcPurple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-arcBlue/20 to-arcPurple/20 flex items-center justify-center mb-4 border border-arcBlue/30 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
          <Gift className="text-arcBlue w-8 h-8" />
        </div>
        
        <h3 className="text-2xl font-bold mb-2 neon-text-blue">Daily Alpha Drop</h3>
        <p className="text-gray-400 mb-6">Claim 10 demo points every 24 hours to use in prediction markets.</p>
        
        {canClaim ? (
          <button 
            onClick={handleClaim}
            disabled={isClaiming}
            className={`px-12 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-arcBlue to-arcPurple text-white shadow-[0_0_20px_rgba(58,123,213,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,210,255,0.6)] ${isClaiming ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isClaiming ? 'Claiming...' : 'Claim 10 Points'}
          </button>
        ) : (
          <div className="flex flex-col items-center">
            <button disabled className="px-12 py-4 rounded-xl font-bold text-lg glass border-gray-600 text-gray-500 cursor-not-allowed">
              Already Claimed
            </button>
            <div className="flex items-center space-x-2 mt-4 text-arcBlue">
              <Clock size={16} />
              <span className="font-mono">{timeLeft}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyClaim;
