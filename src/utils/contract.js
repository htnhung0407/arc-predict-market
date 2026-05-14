import { ethers } from 'ethers';

// Replace with your deployed contract address
export const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";

export const ARC_TESTNET_CONFIG = {
  chainId: '0x4CEBB2', // 5042002 in hex
  chainName: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18
  },
  rpcUrls: ['https://rpc.testnet.arc.network'],
  blockExplorerUrls: ['https://testnet.arcscan.app']
};

export const CONTRACT_ABI = [
  "function dailyClaim() external",
  "function createMarket(string memory _question, uint256 _duration) external",
  "function betYes(uint256 _marketId, uint256 _amount) external",
  "function betNo(uint256 _marketId, uint256 _amount) external",
  "function resolveMarket(uint256 _marketId, bool _resolvedYes) external",
  "function claimReward(uint256 _marketId) external",
  "function getUserPoints(address _user) external view returns (uint256)",
  "function nextMarketId() external view returns (uint256)",
  "function markets(uint256) external view returns (uint256 id, string question, uint256 yesPool, uint256 noPool, uint256 resolutionTime, bool isResolved, bool resolvedYes)",
  "function lastClaimTime(address) external view returns (uint256)",
  "event MarketCreated(uint256 id, string question, uint256 resolutionTime)",
  "event BetPlaced(uint256 marketId, address user, bool isYes, uint256 amount)",
  "event MarketResolved(uint256 id, bool resolvedYes)",
  "event RewardClaimed(uint256 marketId, address user, uint256 amount)",
  "event DailyClaimed(address user, uint256 amount)"
];

export const getContract = async (signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};
