import { ethers } from "hardhat";
/*
// using this abi, I just compiled a new contract version
// losing my working artifacts... hopefully the app is outdated
import { DAO_REGISTRY_ABI } from "../app/constants/daoRegistry";
*/
async function main() {
  const [signer] = await ethers.getSigners();
  
  const DAORegistryAddress = "0x53f6DD0d1eb5649Aa3BD65c54e6dA7631F4F22Bb";
  const DAORegistry = await ethers.getContractAt("contracts/DAORegistryS.sol:DAORegistry", DAORegistryAddress, signer);
  
  console.log(await DAORegistry.name());
  console.log(await DAORegistry.symbol());
  
  const totalDAOs = await DAORegistry.totalDAOs();
  console.log(totalDAOs);
  
  console.log("/////////////////////////");
  console.log(`DAO #1`);
  console.log("/////////////////////////");
  
  console.log(await DAORegistry.tokenURI(1));
  console.log(await DAORegistry.configOf(1));
  console.log(await DAORegistry.decimals(1)); // 0n
  
  console.log("/////////////////////////");
  console.log(`DAO #2`);
  console.log("/////////////////////////");
  
  console.log(await DAORegistry.tokenURI(2));
  console.log(await DAORegistry.configOf(2));
  console.log(await DAORegistry.decimals(2)); // 0n
  
  console.log("/////////////////////////");
  console.log(`DAO #3`);
  console.log("/////////////////////////");
  
  console.log(await DAORegistry.tokenURI(3));
  console.log(await DAORegistry.configOf(3));
  console.log(await DAORegistry.decimals(3)); // 0n
  
  console.log("/////////////////////////");
  console.log(`DAO #4`);
  console.log("/////////////////////////");

  console.log(await DAORegistry.tokenURI(4));
  console.log(await DAORegistry.configOf(4));
  console.log(await DAORegistry.decimals(4)); // 0n
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
