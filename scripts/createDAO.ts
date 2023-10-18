import { ethers } from "hardhat";

// using this abi, I just compiled a new contract version
// losing my working artifacts... hopefully the app is outdated
import { DAO_REGISTRY_ABI } from "../app/constants/daoRegistry";

async function main() {
  const [signer] = await ethers.getSigners();
  
  const DAORegistryAddress = "0x599D3d303d70b23f80a4Be7db4E6E701663034D8";
  const DAORegistry = await ethers.getContractAt(DAO_REGISTRY_ABI, DAORegistryAddress, signer);
  
  const totalDAOs = await DAORegistry.totalDAOs();
  console.log(totalDAOs);

  const daoUri = "ipfs://bafyreicvasglirukzsyxboin5iztpby74slxezcjzmoqq2ntewnrwdo53y/metadata.json";
  const daoPrice = ethers.parseEther("0.001");
  const sismoGroupId = "0xda1c3726426d5639f4c6352c2c976b87";
  
  let tx = await DAORegistry.createDAO(daoUri, daoPrice, sismoGroupId);
  await tx.wait();
  console.log(tx);
  
  console.log("/////////////////////////");
  console.log(`Created DAO ${totalDAOs + 1}.`);
  console.log("/////////////////////////");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
