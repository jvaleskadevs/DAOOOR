import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  // Deploy DAORegistry

  const ERC6551Registry = "0x6efa9246af1f6f1f9577990ffe7d07fa0d7101b5";
  const DAOTBA = "0x903b4111C9eDe8Da0062e252a67284f5fad64C11";
  const GovernanceDeployerAddress = "0xCEe0d0738820E5972aF4e5487b1b7300C2C32362";
  const DAORegistry = await ethers.deployContract("contracts/DAORegistryS.sol:DAORegistry", [ERC6551Registry, DAOTBA, GovernanceDeployerAddress], {gasLimit: "0x1000000"});

  await DAORegistry.waitForDeployment();

  console.log("/////////////////////////");
  console.log(
    `DAORegistry deployed to ${DAORegistry.target}`
  );
  console.log("/////////////////////////");

/*
  const DAORegistry = await ethers.getContractAt("contracts/DAORegistryS.sol:DAORegistry", "0x599D3d303d70b23f80a4Be7db4E6E701663034D8", deployer);
  const GovernanceDeployerAddress = "0xe693f349A6e6D585A53f16093C8a3e7e85444b12";
*/
 
  // Transfer ownership of GovernanceDeployer
  const GovernanceDeployer = await ethers.getContractAt("GovernanceDeployer", GovernanceDeployerAddress, deployer);
  
  let tx = await GovernanceDeployer.transferOwnership(DAORegistry.target, {gasLimit: "0x1000000"});
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
  
  tx = await DAORegistry.createDAO(daoUri, daoPrice, daoType, sismoGroupId, {gasLimit: "0x1000000"});
  await tx.wait();
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
  
  tx = await DAORegistry.createDAO(daoUri, daoPrice, daoType, sismoGroupId, {gasLimit: "0x1000000"});
  await tx.wait();
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
  
  tx = await DAORegistry.createDAO(daoUri, daoPrice, daoType, sismoGroupId, {gasLimit: "0x1000000"});
  await tx.wait();
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
