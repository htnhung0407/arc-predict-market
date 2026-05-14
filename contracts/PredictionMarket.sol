// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PredictionMarket {
    struct Market {
        uint256 id;
        string question;
        uint256 yesPool;
        uint256 noPool;
        uint256 resolutionTime;
        bool isResolved;
        bool resolvedYes;
    }

    mapping(address => uint256) public userPoints;
    mapping(address => uint256) public lastClaimTime;
    
    uint256 public nextMarketId;
    mapping(uint256 => Market) public markets;
    
    // marketId => user => amount
    mapping(uint256 => mapping(address => uint256)) public yesBets;
    mapping(uint256 => mapping(address => uint256)) public noBets;

    address public owner;

    event MarketCreated(uint256 id, string question, uint256 resolutionTime);
    event BetPlaced(uint256 marketId, address user, bool isYes, uint256 amount);
    event MarketResolved(uint256 id, bool resolvedYes);
    event RewardClaimed(uint256 marketId, address user, uint256 amount);
    event DailyClaimed(address user, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    function dailyClaim() external {
        require(block.timestamp >= lastClaimTime[msg.sender] + 24 hours, "Can only claim once every 24 hours");
        userPoints[msg.sender] += 10;
        lastClaimTime[msg.sender] = block.timestamp;
        emit DailyClaimed(msg.sender, 10);
    }

    function createMarket(string memory _question, uint256 _duration) external onlyOwner {
        uint256 id = nextMarketId++;
        markets[id] = Market({
            id: id,
            question: _question,
            yesPool: 0,
            noPool: 0,
            resolutionTime: block.timestamp + _duration,
            isResolved: false,
            resolvedYes: false
        });
        emit MarketCreated(id, _question, block.timestamp + _duration);
    }

    function betYes(uint256 _marketId, uint256 _amount) external {
        require(_marketId < nextMarketId, "Market does not exist");
        Market storage market = markets[_marketId];
        require(!market.isResolved, "Market already resolved");
        require(block.timestamp < market.resolutionTime, "Market voting has ended");
        require(userPoints[msg.sender] >= _amount, "Insufficient points");

        userPoints[msg.sender] -= _amount;
        market.yesPool += _amount;
        yesBets[_marketId][msg.sender] += _amount;

        emit BetPlaced(_marketId, msg.sender, true, _amount);
    }

    function betNo(uint256 _marketId, uint256 _amount) external {
        require(_marketId < nextMarketId, "Market does not exist");
        Market storage market = markets[_marketId];
        require(!market.isResolved, "Market already resolved");
        require(block.timestamp < market.resolutionTime, "Market voting has ended");
        require(userPoints[msg.sender] >= _amount, "Insufficient points");

        userPoints[msg.sender] -= _amount;
        market.noPool += _amount;
        noBets[_marketId][msg.sender] += _amount;

        emit BetPlaced(_marketId, msg.sender, false, _amount);
    }

    function resolveMarket(uint256 _marketId, bool _resolvedYes) external onlyOwner {
        require(_marketId < nextMarketId, "Market does not exist");
        Market storage market = markets[_marketId];
        require(!market.isResolved, "Market already resolved");
        require(block.timestamp >= market.resolutionTime, "Market not yet ended");

        market.isResolved = true;
        market.resolvedYes = _resolvedYes;

        emit MarketResolved(_marketId, _resolvedYes);
    }

    function claimReward(uint256 _marketId) external {
        require(_marketId < nextMarketId, "Market does not exist");
        Market storage market = markets[_marketId];
        require(market.isResolved, "Market not yet resolved");

        uint256 reward = 0;
        if (market.resolvedYes) {
            uint256 userBet = yesBets[_marketId][msg.sender];
            require(userBet > 0, "No winning bet");
            yesBets[_marketId][msg.sender] = 0; // Prevent double claim
            
            // Calculate proportion of the total pool
            uint256 totalPool = market.yesPool + market.noPool;
            reward = (userBet * totalPool) / market.yesPool;
        } else {
            uint256 userBet = noBets[_marketId][msg.sender];
            require(userBet > 0, "No winning bet");
            noBets[_marketId][msg.sender] = 0; // Prevent double claim
            
            // Calculate proportion of the total pool
            uint256 totalPool = market.yesPool + market.noPool;
            reward = (userBet * totalPool) / market.noPool;
        }

        userPoints[msg.sender] += reward;
        emit RewardClaimed(_marketId, msg.sender, reward);
    }

    function getUserPoints(address _user) external view returns (uint256) {
        return userPoints[_user];
    }
}
