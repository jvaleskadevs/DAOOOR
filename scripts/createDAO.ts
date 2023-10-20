import { ethers } from "hardhat";
/*
// using this abi, just compiled a new contract version
// losing the working artifacts... hopefully the app is outdated
import { DAO_REGISTRY_ABI } from "../app/constants/daoRegistry";
*/



async function main() {
  const [signer] = await ethers.getSigners();
  
  const DAORegistryAddress = "0xeBD0bb6f463971044fB07b91C5B6eD191795a5D9";
  const DAORegistry = await ethers.getContractAt("contracts/DAORegistry.sol:DAORegistry", DAORegistryAddress, signer);
  
  const totalDAOs = await DAORegistry.totalDAOs();
  console.log(totalDAOs);

  const daoUri = "ipfs://bafyreicvasglirukzsyxboin5iztpby74slxezcjzmoqq2ntewnrwdo53y/metadata.json";
  const daoPrice = ethers.parseEther("0.001");
  const daoType = 2;
  const sismoGroupId = "0xda1c3726426d5639f4c6352c2c976b87";
  
  let tx = await DAORegistry.createDAO(daoUri, daoPrice, daoType, sismoGroupId);
  await tx.wait();
  console.log(tx);
  
  console.log("/////////////////////////");
  console.log(`Created DAO ${totalDAOs + 1n}.`);
  console.log("/////////////////////////");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
