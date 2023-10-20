// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@sismo-core/sismo-connect-solidity/contracts/SismoConnectLib.sol";

contract SismoVerifier is SismoConnect {
    using SismoConnectHelper for SismoConnectVerifiedResult;
    
    constructor() SismoConnect(buildConfig(0xbc8550f1e4b1ba0f47296aa5feff6692, true)) {}
    
    // this contract MUST add a nullifier, on production, to prevent replay attacks
    // something like:
    //mapping(address token => uint256 tokenId => uint256 claimedAmount) public nullifier;
    // on every claim, the amount claimed by any address must be checked and updated
    
    // sismo verifier check whetherthe zko sent is valid or not
    function verifyZKP(
        bytes memory zkp, 
        address to,
        uint256 amount,
        bytes16 groupId
    ) public view returns (bool) {
        // revert if there is no zk proof to verify
        require(zkp.length > 0, "InvalidZKP");
        // this check is a non-necessary constraint on production
        // a config dao field should be used to set a custom amount per dao
        // this simplified version skip complexity on testing
        require(amount == 1, "InvalidAmount");
        // an improved version of the previous check
        //require(amount + nullifier[to][daoId] < sponsoredAmount,
        // "ClaimedCannotExceedSponsoredAmount");
        // then, update the nullifier mapping
        // nullifier[to][daoId] += amount;

        // build auth requests
        AuthRequest[] memory authRequests = new AuthRequest[](2);
        // an unique sismo vaultId of the caller for our dapp
        authRequests[0] = buildAuth({ authType: AuthType.VAULT });
        // an unique address owned by the caller
        authRequests[1] = buildAuth({ authType: AuthType.EVM_ACCOUNT });
        
        // build claim requests
        ClaimRequest[] memory claimRequests = new ClaimRequest[](1);
        // groupId of the sismo datasource (aka claim allowlist)
        claimRequests[0] = buildClaim({
            groupId: groupId
        });
        
        // verify the validity of the zkp sent
        SismoConnectVerifiedResult memory result = verify({
            responseBytes: zkp,
            auths: authRequests,
            claims: claimRequests,
            // this message signature prevents front-running attacks
            // adding block.chainid prevents multichain replay attacks (!)
            signature: buildSignature({message: abi.encode(to/*, block.chainid*/)})
        });

        // return true only if all auth and claim requests were verified successfully.
        return result.auths.length == 2 && result.claims.length == 1;
    }    
}
