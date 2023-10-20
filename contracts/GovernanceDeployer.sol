// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./DAOGovernor.sol";
import "./interfaces/IGovernanceDeployer.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GovernanceDeployer is IGovernanceDeployer, Ownable {
    constructor () Ownable(msg.sender) {}
    function deploy(uint256 salt, address token) public onlyOwner returns (address) {
        return address(new DAOGovernor{salt: bytes32(salt)}(IVotes(token)));
    }
}
