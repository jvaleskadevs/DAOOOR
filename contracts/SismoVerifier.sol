// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@sismo-core/sismo-connect-solidity/contracts/SismoConnectLib.sol";

contract SismoVerifier is SismoConnect {
    using SismoConnectHelper for SismoConnectVerifiedResult;
    
    constructor() SismoConnect(buildConfig(0xbc8550f1e4b1ba0f47296aa5feff6692, true)) {}
    
    function verifyZKP(
        bytes memory zkp, 
        address to,
        uint256 amount,
        bytes16 groupId
    ) public view returns (bool) {
        require(zkp.length > 0, "InvalidZKP");
        require(amount == 1, "InvalidAmmount");

        AuthRequest[] memory authRequests = new AuthRequest[](2);
        authRequests[0] = buildAuth({ authType: AuthType.VAULT });
        authRequests[1] = buildAuth({ authType: AuthType.EVM_ACCOUNT });
        
        ClaimRequest[] memory claimRequests = new ClaimRequest[](1);
        claimRequests[0] = buildClaim({
            groupId: groupId
        });
        
        SismoConnectVerifiedResult memory result = verify({
            responseBytes: zkp,
            auths: authRequests,
            claims: claimRequests,
            // this message signature prevents front-running attacks
            signature: buildSignature({message: abi.encode(to)})
        });

        return result.auths.length == 2 && result.claims.length == 1;
    }    
}
