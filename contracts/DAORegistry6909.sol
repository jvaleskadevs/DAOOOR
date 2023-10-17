// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./ERC6909.sol";
import "./interfaces/IERC6909MetadataURI.sol";
import "./interfaces/IERC6551Registry.sol";
import "./interfaces/IERC6909Votes.sol";
import "./interfaces/IDAORegistry6909.sol";
//import "./DAOGovernor.sol";
import "./SismoVerifier.sol";

// Create DAOs, join DAOs and edit DAO metadata
contract DAORegistry is ERC6909, IERC6909MetadataURI, IDAORegistry, SismoVerifier {
    // total amount of DAOs created trough this contract
    uint256 public totalDAOs;
    
    // interface erc6551Registry compliant to create TBAs
    IERC6551Registry public registry6551;
    // address of the implementation (bytecode) for all daotbas
    address public daotbaImplAddr;
    
    // config data for a dao
    struct ConfigDAO {
        uint256 tokenPrice;
        bytes16 sismoGroupId;
        address daotba;
        string daoURI;
        /*address daogov;*/
    }
    
    // get the config of a dao from its ID
    mapping(uint256 => ConfigDAO) public configOf;
    
    // ERC6909Metadata implementation 
    string public name = "DAO Registry";
    string public symbol = "DAOR";
    function decimals(uint256/* id */) public pure override returns (uint8) { return 0; }
    
    // ERC6909MetadataURI implementation
    function tokenURI(uint256 daoId) public view override returns (string memory) {
        return configOf[daoId].daoURI;
    }
    
    // store 6551 registry and tba implementation addresses
    constructor(
        IERC6551Registry _registry6551,
        address _daotbaImplAddr
    ) {
        registry6551 = _registry6551;
        daotbaImplAddr = _daotbaImplAddr;
    }
    
    // register id and metadata of a new DAO, create a TBA for the DAO
    // deploy governor contract and emit an event
    function createDAO(
        string memory daoUri, 
        uint256 price,
        bytes calldata data
    ) public {
        // add 1 to totalDAOs and set the result as daoId for the new DAO
        uint256 daoId = ++totalDAOs;
        
        // call the 6551 registry to create the TBA of the new DAO
        address daoTba = registry6551.createAccount(
            daotbaImplAddr, // implementation
            block.chainid,
            address(this), // tokenContract
            daoId, // tokenId
            420, // salt
            "" // initData
        ); 
        
        // deploy an OZ Governor for the new DAO
        //address daoGov = address(new DAOGovernor{salt: bytes32(daoId)}(IVotes(daoTba)));

        // set config dao details
        configOf[daoId] = ConfigDAO(price, bytes16(data), daoTba/*, daoGov */, daoUri);
        
        // minting dao membership nft to the founder
        _mint(msg.sender, daoId, 1);
        //transferFrom(address(0), msg.sender, daoId, 1);
        // add voting power manually
        IERC6909Votes(daoTba).transferVotingUnits(address(0), msg.sender, daoId, 1);
        
        emit DAOCreated(
            daoTba,
            daoId,
            daoTba,//faking daoGovernor,
            daoUri
        );
        
        emit DAOJoined(msg.sender, daoId); 
    }    
    
    // mint the DAO membership nft and join the DAO
    function joinDAO(
        uint256 daoId, 
        uint256 amount, 
        bytes calldata data
    ) public payable {
        ConfigDAO memory config = configOf[daoId];
        // check whether a daoId exists or not, revert if it does not exist
        require(daoId < ++totalDAOs, "DAO does not exist");
        // revert if the value sent is not equal to the token price * amount of tokens
        // and the mint is not sponsored by the dao (sismoVerifier will verify the ZKP)
        require(
            amount * config.tokenPrice == msg.value || 
            verifyZKP(data, msg.sender, amount, config.sismoGroupId),
            "Invalid price sent"
        );
        
        // minting the dao membership nft
        _mint(msg.sender, daoId, amount);
        //transferFrom(address(0), msg.sender, daoId, amount);
        // add voting power manually
        IERC6909Votes(configOf[daoId].daotba).transferVotingUnits(address(0), msg.sender, daoId, amount);

        // send the eth from the payment to the dao treasury
        (bool sent, ) = payable(config.daotba).call{value: msg.value}("");
        require(sent, "TreasuryError");
        
        emit DAOJoined(msg.sender, daoId);
    }
    
    // overrides required to manage voting power changes on transfer
    
    function transfer(
        address receiver, 
        uint256 id, 
        uint256 amount
    ) public override(ERC6909, IERC6909) returns (bool) {
        super.transfer(receiver, id, amount);
        return onTransfer(msg.sender, receiver, id, amount);

    }
    
    function transferFrom(
        address sender,
        address receiver, 
        uint256 id, 
        uint256 amount
    ) public override(ERC6909, IERC6909) returns (bool) {
        super.transferFrom(sender, receiver, id, amount);
        return onTransfer(sender, receiver, id, amount);  
    }
    
    // hook to update voting power units after every token transfer
    
    function onTransfer(
        address from,
        address to, 
        uint256 daoId, 
        uint256 amount    
    ) internal returns (bool) {
        // calling the DAOTBA to update voting units after every token transfer
        IERC6909Votes(configOf[daoId].daotba).transferVotingUnits(from, to, daoId, amount);
        return true;
    }
    
    // overrides required by solidity 
    function supportsInterface(
        bytes4 interfaceId
    ) public pure override(ERC6909, IERC165) returns (bool supported) {
        return interfaceId == type(IERC6909MetadataURI).interfaceId ||
                interfaceId == type(IDAORegistry).interfaceId ||
                super.supportsInterface(interfaceId);
    }
}
