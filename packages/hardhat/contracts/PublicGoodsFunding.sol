// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import './Project.sol';

contract PublicGoodsFunding {
	mapping (address => bool) projects;

	event ProjectCreated(address projectAddress);
	event NFTMinted(address projectAddress, address contributor);

	// create public goods project campaign
	function createProject(
		string memory projectTitle,
		string memory projectDescription,
		address projectTokenAddress, // this shouldnt be a parameter. we should control which addresses can be assigned
		uint256 targetAmount,
		uint256 deadline,
		string memory image
	) public {
		require(
			deadline > block.timestamp,
			"Deadline must be set in the future"
		);

		Project project = new Project(
			address(this),
			msg.sender,
			projectTokenAddress,
			projectTitle,			
			projectDescription,
			targetAmount,
			deadline,
			image
		);

		emit ProjectCreated(address(project));
	}

	function mintNFT() public {
		require(projects[msg.sender], 'Must be a valid project');
		// mint NFT
		emit NFTMinted(msg.sender, tx.origin);
	}
}
