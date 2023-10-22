// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

interface IDAORegistry {
    // emited after successful DAO creation
    event DAOCreated(
        uint256 indexed daoId,
        address indexed daoTba,
        address indexed daoGovernor,
        string daoUri,
        uint256 price,
        bytes16 data
    ); 
    
    // emited after successful join a DAO
    event DAOJoined(
        address indexed member,
        uint256 indexed daoId,
        uint256 price
    ); 
    
    // create a TBA for the new DAO, register id and metadata
    function createDAO(string memory daoUri, uint256 price, uint8 daoType, bytes16 data) external;

    // mint the DAO membership nft and join the DAO
    function joinDAO(uint256 daoId, uint256 amount, bytes memory data) external payable;
}
