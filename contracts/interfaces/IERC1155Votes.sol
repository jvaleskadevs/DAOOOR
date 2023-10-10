// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;
// @dev the ERC-165 identifier for this interface is `TODO`
interface IERC1155Votes {
    function transferVotingUnits(address from, address to, uint256 amount) external;    
}
