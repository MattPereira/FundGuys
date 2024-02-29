// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error Mycologuys__TokenUriNotFound();

contract Mycologuys is ERC721, Ownable {
	// State variables
	string public baseUri =
		"ipfs://bafybeidnwjxhpv2xnfczfk7x7zucve3yzvxnjyxuakfm3u7ebghfakpmwe/";
	string public uriSuffix = ".json";
	uint256 public s_tokenCounter;

	// Functions
	/**
	 * Starting from one to match hashlips art engine configuration
	 */
	constructor() ERC721("Mycologuys", "MYG") Ownable() {
		s_tokenCounter = 1;
	}

	/**
	 * Increment token counter after minting
	 */
	function mintNft() public onlyOwner {
		_safeMint(msg.sender, s_tokenCounter);
		s_tokenCounter = s_tokenCounter + 1;
	}

	/**
	 * Concat baseUri, tokenId and uriSuffix to form the tokenURI
	 */
	function tokenURI(
		uint256 _tokenId
	) public view virtual override returns (string memory) {
		require(
			_exists(_tokenId),
			"ERC721Metadata: URI query for nonexistent token"
		);

		return
			string(
				abi.encodePacked(baseUri, Strings.toString(_tokenId), uriSuffix)
			);
	}

	/**
	 * Incase we need to change the baseUri after re-generating nft images & metadata
	 */
	function setBaseUri(string memory _baseUri) public onlyOwner {
		baseUri = _baseUri;
	}
}
