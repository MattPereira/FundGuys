// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import './PublicGoodsFunding.sol';

contract Project {
	address publicGoodsFundingAddress;
	address projectOwner;
	address projectTokenAddress;
	string projectTitle;
	string projectDescription;
	string image;
	uint256 targetAmount;
	uint256 deadline;
	uint256 amountRaised;
	bool completed;
	mapping(address => uint256) contributions;

	event Contribution(address indexed contributor, uint256 amount);

	constructor(
		address _publicGoodsFundingAddress,
		address _projectOwner,
		address _projectTokenAddress,
		string memory _projectTitle,
		string memory _projectDescription,
		uint256 _targetAmount,
		uint256 _deadline,
		string memory _image
	) {
		publicGoodsFundingAddress = _publicGoodsFundingAddress;
		projectOwner = _projectOwner;
		projectTokenAddress = _projectTokenAddress;
		projectTitle = _projectTitle;
		projectDescription = _projectDescription;
		targetAmount = _targetAmount;
		deadline = _deadline;
		image = _image;
	}

	modifier onlyOwner() {
		require(
			msg.sender == projectOwner,
			"You are not project owner"
		);
		_;
	}

	receive() external payable {
		require(completed == false, "Project is completed");
		require(projectTokenAddress == address(0), "Project does not accept contributions in ETH");
		_handleDonation(msg.sender, msg.value);
	}

	function _handleDonation(address contributor, uint256 amount) private {
		if (contributions[contributor] == 0) {
			contributions[contributor] = amount;
			PublicGoodsFunding publicGoodsFunding = PublicGoodsFunding(publicGoodsFundingAddress);	
			publicGoodsFunding.mintNFT();
		} else {
			contributions[contributor] += amount;
		}

		amountRaised += amount;
		emit Contribution(contributor, amount);
	}

	// function withdrawFunds() public onlyOwner {
	// 	require(
	// 		address(this).balance >= targetAmount ||
	// 			block.timestamp >= deadline,
	// 		"Project funding goals have not been reached"
	// 	);
	// 	if (projectTokenAddress == address(0)) {
	// 		// withdraw ETH
	// 		(bool success, ) = msg.sender.call{ value: address(this).balance }("");
	// 		require(success, "Failed to withdraw funds");
	// 	} else {
	// 		// withdraw tokens
	// 		IERC20 token = IERC20(projectTokenAddress);

	// 	}
	// 	completed = true;
	// }

	///////////////////////////////////////////
	/////////// GETTER FUNCTIONS //////////////
	///////////////////////////////////////////

	function getProject() public view returns (
		string memory,
		string memory,
		string memory,
		uint256,
		uint256,
		uint256,
		bool
	) {
		return (
			projectTitle,
			projectDescription,
			image,
			targetAmount,
			amountRaised,
			deadline,
			completed
		);
	}
}
