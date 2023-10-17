// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./interfaces/IERC6909MetadataURI.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "@openzeppelin/contracts/governance/utils/Votes.sol";
import "./interfaces/ITokenBoundAccount.sol";
import "./interfaces/IERC6909Votes.sol";
import "./callback/TokenCallbackHandler.sol";


// the DAO TBA implementation, also known as DAO Bound Account.
// this includes all the TBA and DAO logic
contract DAOTBA is TokenCallbackHandler, IERC1271, ITokenBoundAccount, Votes, IERC6909Votes {
    uint256 private _nonce;
    receive() external payable {}
    
    constructor() EIP712("DAOTBA", "0.0.0") {}
    
    // dummy functions to simulate being an ERC721 and ERC20...
    function name() public pure returns (string memory) {
        return "DAOTBA";
    }
    function symbol() public pure returns (string memory) {
        return "DAOTBA";
    }
    function decimals() public pure returns (uint256) {
        return 0;
    }
    
    // uri proxy function, it calls DAORegistry to get the tokenID URI
    // external dapps can use this proxy function to get the token metadata
    function uri() public view returns (string memory) {
        (uint256 chainId, address tokenContract, uint256 tokenId) = this.token();
        
        if (chainId != block.chainid) revert();
        // calling the DAORegistry to get tokenId URI
        return IERC6909MetadataURI(tokenContract).tokenURI(tokenId);
    } 
    
    // totalSupply proxy function, it calls DAORegistry to get the tokenId supply
    // external dapps can use this proxy function to get the total voting power
    function totalSupply() external view returns (uint256) {
        (uint256 chainId, address tokenContract, uint256 tokenId) = this.token();
        
        if (chainId != block.chainid) revert();
        // calling the DAORegistry to get current tokenId supply aka max voting power
        return IERC6909MetadataURI(tokenContract).totalSupply(tokenId);
    }
    
    // IERC1155Votes
    // function called from the DAORegistry after every transfer to update voting power
    function transferVotingUnits(address from, address to, uint256 id, uint256 amount) external {
        (uint256 chainId, address tokenContract, uint256 tokenId) = this.token();
        // tokenContract aka DAORegistry must be the only one allowed to transferVotingUnits
        if (chainId != block.chainid || tokenContract != msg.sender || id != tokenId) revert();
        // calling the Votes function to update voting power
        _transferVotingUnits(from, to, amount);        
    }
    
    // override required by Votes, it returns the current voting power of a dao member
    // based on the current amount of tokens this user holds
    function _getVotingUnits(address account) internal view virtual override returns (uint256) {
        (uint256 chainId, address tokenContract, uint256 tokenId) = this.token();
        
        if (chainId != block.chainid) revert();
        // calling the DAORegistry to get current balance/voting power of a dao member
        return IERC6909MetadataURI(tokenContract).balanceOf(account, tokenId);
    }   
    
    // basic 6551 functions w/ minor changes to support erc1155
    // ITokenBoundAccount

    // every holder could call this function
    // IMPORTANT: allow every holder to make use of this contract's treasury
    // and execute arbitrary transactions, only for trusted groups, like family, friends...
    // trustless communities should use the OZ Governor proposal system instead.
    function executeCall(
        address to,
        uint256 value,
        bytes calldata data
    ) external payable returns (bytes memory result) {
        require(isValidSigner(msg.sender), "Forbidden");
        
        _nonce++;
        
        bool success;
        (success, result) = to.call{value: value}(data);

        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    function token()
        external
        view
        returns (
            uint256,
            address,
            uint256
        )
    {
        bytes memory footer = new bytes(0x60);

        assembly {
            // copy 0x60 bytes from end of footer
            extcodecopy(address(), add(footer, 0x20), 0x4d, 0x60)
        }

        return abi.decode(footer, (uint256, address, uint256));
    }


    function isValidSigner(address signer) public view returns (bool) {
        (uint256 chainId, address tokenContract, uint256 tokenId) = this
            .token();
        if (chainId != block.chainid) return false;

        return IERC6909MetadataURI(tokenContract).balanceOf(signer, tokenId) > 0;
    }
    
    function recoverSigner(
        bytes32 _hash,
        bytes memory _signature
    ) internal pure returns (address signer) {
        require(_signature.length == 65, "Invalid signature length");
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly { 
            r := mload(add(_signature, 32))//bytes32(_signature[0:32]);
            s := mload(add(_signature, 64))//bytes32(_signature[32:64]);
            v := byte(0, mload(add(_signature, 96)))//uint8(_signature[64]);
        }
        // EIP-2 still allows signature malleability for ecrecover(). Remove this possibility and make the signature
        // unique. Appendix F in the Ethereum Yellow paper (https://ethereum.github.io/yellowpaper/paper.pdf), defines
        // the valid range for s in (281): 0 < s < secp256k1n ÷ 2 + 1, and for v in (282): v ∈ {27, 28}. Most
        // signatures from current libraries generate a unique signature with an s-value in the lower half order.
        //
        // If your library generates malleable signatures, such as s-values in the upper range, calculate a new s-value
        // with 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141 - s1 and flip v from 27 to 28 or
        // vice versa. If your library also generates signatures with 0/1 for v instead 27/28, add 27 to v to accept
        // these malleable signatures as well.
        //
        // Source OpenZeppelin
        // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/cryptography/ECDSA.sol

        if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
          revert("SignatureValidator#recoverSigner: invalid signature 's' value");
        }

        if (v != 27 && v != 28) {
          revert("SignatureValidator#recoverSigner: invalid signature 'v' value");
        }

        // Recover ECDSA signer
        signer = ecrecover(_hash, v, r, s);
        
        // Prevent signer from being 0x0
        require(
          signer != address(0x0),
          "Invalid signer"
        );

        return signer;        
    }

    function supportsInterface(bytes4 interfaceId) public view override(TokenCallbackHandler) returns (bool) {
        return (super.supportsInterface(interfaceId) ||
                  interfaceId == type(ITokenBoundAccount).interfaceId ||
                  interfaceId == type(IERC6909Votes).interfaceId ||
                  interfaceId == type(IERC1271).interfaceId
        );
    }

    function isValidSignature(bytes32 hash, bytes memory signature)
        external
        view
        returns (bytes4 magicValue)
    {
        bool isValid = isValidSigner(recoverSigner(hash, signature));

        if (isValid) {
            return IERC1271.isValidSignature.selector;
        }

        return "";
    }
    
    function nonce() public view returns (uint256) {
        return _nonce;
    }
}
