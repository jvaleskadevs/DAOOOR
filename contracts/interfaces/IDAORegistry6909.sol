// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

interface IDAORegistry {
    // emited after successful DAO creation
    event DAOCreated(
        address indexed daoTba,
        uint256 indexed daoId,
        address indexed daoGovernor,
        string daoUri
    ); 
    
    // emited after successful join a DAO
    event DAOJoined(
        address indexed member,
        uint256 indexed daoId
    ); 
    
    // create a TBA for the new DAO, register id and metadata
    function createDAO(string memory daoUri, uint256 price, bytes memory data) external;

    // mint the DAO membership nft and join the DAO
    function joinDAO(uint256 daoId, uint256 amount, bytes memory data) external payable;
}
