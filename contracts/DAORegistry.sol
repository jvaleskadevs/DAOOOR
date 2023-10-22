// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./ERC6909.sol";
import "./interfaces/IERC6909MetadataURI.sol";
import "./interfaces/IDAORegistry.sol";
import "./interfaces/IERC6551Registry.sol";
import "./interfaces/IERC6909Votes.sol";
import "./interfaces/IGovernanceDeployer.sol";
import "./SismoVerifier.sol";


// Create DAOs, join DAOs and edit DAO metadata
contract DAORegistry is ERC6909, IERC6909MetadataURI, IDAORegistry, SismoVerifier {
    // total amount of DAOs created trough this contract
    uint256 public totalDAOs;
    
    // interface erc6551Registry compliant to create TBAs
    IERC6551Registry public registry6551;
    // address of the implementation (bytecode) for all daotbas
    address public daotbaImplAddr;
    // 
    IGovernanceDeployer public governanceDeployer;
    
    // config data for a DAO
    struct ConfigDAO {
        // dao unique identifier
        uint256 daoId;
        // address of the dao tba
        address daotba;
        // address of the dao Governor
        address daoGov;
        // uri pointing to dao metadata
        string daoURI;
        // membership token price
        uint256 tokenPrice;
        // sponsored membership filter
        bytes16 sismoGroupId;
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
    
    // store 6551 regsitry, governance deployer and tba implementation addresses
    constructor(
        IERC6551Registry _registry6551,
        address _daotbaImplAddr,
        IGovernanceDeployer _governanceDeployer
    ) {
        registry6551 = _registry6551;
        daotbaImplAddr = _daotbaImplAddr;
        governanceDeployer = _governanceDeployer;
    }
    
    // register id and metadata of a new DAO, create a TBA for the DAO
    // deploy governor contract, mint membership to founder and emit 2 events
    function createDAO(
        string memory daoUri, 
        uint256 price,
        uint8 daoType,
        bytes16 data
    ) public {
        // hardcoded constraint to check if a valid daoType was sent
        require(daoType < 3, "InvalidDaoType");
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
        
        // deploy an OZ Governor for the new DAO, if requested by the caller
        address daoGov = 
            daoType == 1 || daoType == 2
                ? governanceDeployer.deploy(daoId, daoTba)
                : address(0);
                
        // call the daotba here to set the daoGovernor, if it was requested
        if (daoType == 2) IERC6909Votes(daoTba).setGovernor(daoGov, daoId);
        
        // set config dao details
        configOf[daoId] = ConfigDAO(daoId, daoTba, daoGov, daoUri, price, data);
        
        // minting dao membership nft to the founder (caller)
        _mint(msg.sender, daoId, 1);
        
        // add voting power manually (minting does not trigger our transfer hook)
        IERC6909Votes(daoTba).transferVotingUnits(address(0), msg.sender, daoId, 1);
        
        emit DAOCreated(
            daoId,
            daoTba,
            daoGov,
            daoUri,
            price,
            data
        );
        
        emit DAOJoined(msg.sender, daoId, 0);
    }    
    
    // mint the DAO membership nft and join the DAO
    function joinDAO(
        uint256 daoId, 
        uint256 amount, 
        bytes calldata data
    ) public payable {
        // check whether a daoId exists or not, revert if it does not exist
        require(daoId < totalDAOs + 1, "DAO does not exist");
        // load dao config on memory
        ConfigDAO memory config = configOf[daoId];
        // revert if the value sent is not equal to the token price * amount of tokens
        // and the mint is not sponsored by the dao (sismoVerifier will verify the ZKP)
        require(
            amount * config.tokenPrice == msg.value || 
            verifyZKP(data, msg.sender, amount, config.sismoGroupId),
            "InvalidPriceOrZKP"
        );
        
        // minting the dao membership nft
        _mint(msg.sender, daoId, amount);
        // add voting power manually, (minting does not trigger our hook)
        IERC6909Votes(config.daotba)
            .transferVotingUnits(address(0), msg.sender, daoId, amount);

        // send the eth from the payment to the dao treasury aka the dao tba
        (bool sent, ) = payable(config.daotba).call{value: msg.value}("");
        require(sent, "TreasuryError");
        
        emit DAOJoined(msg.sender, daoId, msg.value);
    }
    
    // config dao setter, allow changes on config from tba or governor
    function setConfigDao(
        uint256 daoId, 
        uint256 tokenPrice, 
        bytes16 sismoGroupId, 
        string memory daoURI
    ) public {
        // check whether a daoId exists or not, revert if it does not exist
        require(daoId < totalDAOs + 1, "DAO does not exist");        
        ConfigDAO storage config = configOf[daoId];
        // sender must be the TBA trough executeCall
        // or the governor trough proposal execution
        require(msg.sender == config.daotba || msg.sender == config.daoGov, "Forbidden");
        config.tokenPrice = tokenPrice;
        config.sismoGroupId = sismoGroupId;
        config.daoURI = daoURI;
        // tba and governor cannot be changed.     
    }
    
    // overrides required to manage voting power changes on every transfer
    
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
    
    // override required by solidity 
    function supportsInterface(
        bytes4 interfaceId
    ) public pure override(ERC6909, IERC165) returns (bool supported) {
        return interfaceId == type(IERC6909MetadataURI).interfaceId ||
                interfaceId == type(IDAORegistry).interfaceId ||
                super.supportsInterface(interfaceId);
    }
}
