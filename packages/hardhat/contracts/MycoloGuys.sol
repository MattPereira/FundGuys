// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";

contract MycoloGuys is ERC721 {
	error MycoloGuys__TokenUriNotFound();

	mapping(uint256 tokenId => string tokenUri) public s_tokenIdToUri;
	uint256 public s_tokenCounter;
	string public baseUri =
		"ipfs://bafybeidnwjxhpv2xnfczfk7x7zucve3yzvxnjyxuakfm3u7ebghfakpmwe/";
	string public uriSuffix = ".json";

	/**
	 * Starting from one to match hashlips generation
	 */
	constructor() ERC721("MycoloGuys", "MYG") {
		s_tokenCounter = 1;
	}

	function mintNft() public {
		_safeMint(msg.sender, s_tokenCounter);
		s_tokenCounter = s_tokenCounter + 1;
	}

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
	 *
	 * @return uint256 the next token id to be minted
	 */
	function getTokenCounter() public view returns (uint256) {
		return s_tokenCounter;
	}
}
