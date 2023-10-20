import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  // Deploy DAORegistry
  
  const ERC6551Registry = "0x7721337863daEF71011c4Cb690CE895228b4dFFF";
  const DAOTBA = "0x3cA14d1C38de45E9943653Ec4D441bC927b8b30c";
  const GovernanceDeployer = "0xDf223b69512796D871eF24fCd48D6fa3130559bA";
  const DAORegistry = await ethers.deployContract("contracts/DAORegistry.sol:DAORegistry", [ERC6551Registry, DAOTBA, GovernanceDeployer]);

  await DAORegistry.waitForDeployment();

  console.log("/////////////////////////");
  console.log(
    `DAORegistry deployed to ${DAORegistry.target}`
  );
  console.log("/////////////////////////");
  
  // Transfer ownership of GovernanceDeployer
  
  const GovernanceDeployerAddress = "0xDf223b69512796D871eF24fCd48D6fa3130559bA";
  const GovernanceDeployer = await ethers.getContractAt("GovernanceDeployer", GovernanceDeployerAddress, signer);
  
  let tx = await GovernanceDeployer.transferOwnership(DAORegistry.target);
  await tx.wait();
  console.log(tx);
  
  console.log("/////////////////////////");
  console.log(`Transferred ownership of ${GovernanceDeployer.target} to ${DAORegistry}.`);
  console.log("/////////////////////////");
  
  // Create DAOS
  
  const daoUri = "ipfs://bafyreicvasglirukzsyxboin5iztpby74slxezcjzmoqq2ntewnrwdo53y/metadata.json";
  const sismoGroupId = "0xda1c3726426d5639f4c6352c2c976b87";
  
  // no governance system, schema 1-of-n
  // every holder could executeCall
  let daoType = 0;
  // a high price to force sismo verification
  let daoPrice = ethers.parseEther("7777777");
  
  let tx = await DAORegistry.createDAO(daoUri, daoPrice, daoType, sismoGroupId);
  console.log(tx);
  
  console.log("/////////////////////////");
  console.log("DAO #1 created.");
  console.log("/////////////////////////");
  
  // governance system + schema 1-of-n
  // a proposal must get quorum or succeed to execute on governor
  // but the dao tba is still under every holder control
  daoType = 1;
  // a low price, governor gives more protection
  daoPrice = ethers.parseEther("0.001");
  
  tx = await DAORegistry.createDAO(daoUri, daoPrice, daoType, sismoGroupId);
  console.log(tx);
  
  console.log("/////////////////////////");
  console.log("DAO #2 created.");
  console.log("/////////////////////////");
  
  // only governance system, schema m-of-n
  // a proposal must get quorum or succeed to execute on governor
  // or to executeCall on the dao tba
  daoType = 2;
  // a low price, this is the safest and recommended daoType
  daoPrice = ethers.parseEther("0.001");
  
  tx = await DAORegistry.createDAO(daoUri, daoPrice, daoType, sismoGroupId);
  console.log(tx);
  
  console.log("/////////////////////////");
  console.log("DAO #3 created.");
  console.log("/////////////////////////");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
