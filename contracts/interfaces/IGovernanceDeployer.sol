// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

interface IGovernanceDeployer {
    function deploy(uint256 salt, address token) external returns (address);
}
