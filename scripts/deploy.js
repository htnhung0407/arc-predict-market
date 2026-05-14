const hre = require("hardhat");

async function main() {
  const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.deploy();

  await predictionMarket.waitForDeployment();

  const address = await predictionMarket.getAddress();
  console.log("PredictionMarket deployed to:", address);
  
  // Create some initial markets for demo purposes
  console.log("Creating initial markets...");
  
  // Market 1: Will BTC be above $70,000 tomorrow?
  await predictionMarket.createMarket("Will BTC be above $70,000 tomorrow?", 86400); // 1 day
  
  // Market 2: Will SOL be above $180 this week?
  await predictionMarket.createMarket("Will SOL be above $180 this week?", 604800); // 1 week
  
  console.log("Markets created successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
