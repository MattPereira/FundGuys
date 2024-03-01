// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Project } from "./Project.sol";
import { Mycologuys } from "./Mycologuys.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract PublicGoodsFunding is Ownable {
	// State variables
	Mycologuys nftContract;
	mapping(address => bool) projects;

	//Events
	event ProjectCreated(
		address indexed projectAddress,
		address indexed projectOwner
	);
	event NFTMinted(address projectAddress, address contributor);

	// Functions
	constructor(Mycologuys _nftContract) {
		nftContract = _nftContract;
	}

	/**
	 * Create public goods project campaign
	 */
	function createProject(
		string memory projectTitle,
		string memory projectDescription,
		address projectTokenAddress, // this shouldnt be a parameter. we should eventually control which addresses can be assigned to
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
		projects[address(project)] = true;
		emit ProjectCreated(address(project), msg.sender);
	}

	function mintToFunder() public {
		require(
			projects[msg.sender],
			"Only campaign project contracts can mint NFTs"
		);
		nftContract.mintNft();
		emit NFTMinted(msg.sender, tx.origin);
	}

	function setNewBaseUri(string memory _baseUri) public onlyOwner {
		nftContract.setBaseUri(_baseUri);
	}
}
