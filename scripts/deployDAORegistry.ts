import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  
  const ERC6551Registry = "0x6eFA9246af1f6F1f9577990FFE7D07fA0d7101b5";
  const DAOTBA = "0xE6e2A8DE7893E2B458Ef132BfecCfBE83Ebc7675";
  const DAORegistry = await ethers.deployContract("contracts/DAORegistryX.sol:DAORegistry", [ERC6551Registry, DAOTBA]);

  await DAORegistry.waitForDeployment();

  console.log("/////////////////////////");
  console.log(
    `DAORegistry deployed to ${DAORegistry.target}`
  );
  console.log("/////////////////////////");
  
  const daoUri = "ipfs://bafyreicvasglirukzsyxboin5iztpby74slxezcjzmoqq2ntewnrwdo53y/metadata.json";
  const daoPrice = ethers.parseEther("0.001");
  
  let tx = await DAORegistry.createDAO(daoUri, daoPrice);
  console.log(tx);
  
  console.log("/////////////////////////");
  console.log("DAO #1 created.");
  console.log("/////////////////////////");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
