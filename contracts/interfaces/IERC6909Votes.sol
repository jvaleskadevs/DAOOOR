// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;
// @dev the ERC-165 identifier for this interface is `TODO`
interface IERC6909Votes {
    function transferVotingUnits(address from, address to, uint256 id, uint256 amount) external; 
    function setGovernor(address _governor, uint256 id) external;   
}
