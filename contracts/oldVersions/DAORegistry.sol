// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "../interfaces/IERC6551Registry.sol";
import "./interfaces/IERC1155Votes.sol";
import "./interfaces/IDAORegistry.sol";
import "../DAOGovernor.sol";

// Create DAOs, join DAOs and edit DAO metadata
contract DAORegistry is ERC1155Supply, ERC1155URIStorage, IDAORegistry {
    // total amount of DAOs created trough this contract
    uint256 public totalDAOs;
    
    // interface 6551Registry to create TBAs
    IERC6551Registry public iERC6551Registry;
    // the 6551 TBA implementation
    address public daotbaImplAddress;
    
    // initialize the ERC1155 and set metadata
    // store 6551 registry and tba implementation addresses
    constructor(
        IERC6551Registry _iERC6551Registry,
        address _daotbaImplAddress
    ) ERC1155("ipfs://cid") {
        iERC6551Registry = _iERC6551Registry;
        daotbaImplAddress = _daotbaImplAddress;
    }
    
    // register id and metadata of a new DAO, create a TBA for the DAO
    // deploy governor contract and emit an event
    function createDAO(string memory daoUri) public {
        uint256 daoId = ++totalDAOs;
        // set the metadata of the new DAO
        _setURI(daoId, daoUri);
        
        // call the 6551 registry to create the TBA of the new DAO
        address daoTba = iERC6551Registry.createAccount(
            daotbaImplAddress,
            block.chainid,
            address(this),
            daoId,
            42,
            ""
        );        
        
        address daoGovernor = address(new DAOGovernor{salt: bytes32(daoId)}(IVotes(daoTba)));
        
        // minting the dao membership nft to the founder
        _mint(msg.sender, daoId, 1, "");
        
        emit DAOCreated(
            daoTba,
            daoId,
            daoGovernor,
            daoUri
        );
        
        emit DAOJoined(msg.sender, daoId); 
    }

    // mint the DAO membership nft and join the DAO
    function joinDAO(uint256 daoId, uint256 amount, bytes memory data) public {
        // check whether a daoId exists or not, revert if it does not exist
        require(exists(daoId), "DAO does not exist");
        // minting the dao membership nft
        _mint(msg.sender, daoId, amount, data);
        
        emit DAOJoined(msg.sender, daoId);   
    }

    // overrides requires by Solidity compiler
    
    function uri(uint256 tokenId) public view override(ERC1155URIStorage, ERC1155) returns (string memory) {
        return super.uri(tokenId);
    }

    function _setURI(uint256 tokenId, string memory tokenURI) internal override {
        super._setURI(tokenId, tokenURI);
    }

    function _setBaseURI(string memory baseURI) internal override {
        super._setBaseURI(baseURI);
    }
    
    function _update(address from, address to, uint256[] memory ids, uint256[] memory values) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
        // iterate trough every transferred token
        for (uint256 i = 0; i < values.length; i++) {
            // calling the 6551Registry to get the DAOTBA from the daoId
            address daotba = iERC6551Registry.account(
                daotbaImplAddress,
                block.chainid,
                address(this),
                ids[i],
                42            
            );
            // calling the DAOTBA to update voting units after every token transfer
            IERC1155Votes(daotba).transferVotingUnits(from, to, values[i]);
        }
    }
}
