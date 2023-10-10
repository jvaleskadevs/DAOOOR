import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  
  const DAORegistryAddress = "0x919aa365BE3b0eACf3e5d9d8933338D5DF93C1aC";
  const DAORegistry = await ethers.getContractAt("contracts/DAORegistryX.sol:DAORegistry", DAORegistryAddress, signer);
  
  console.log(await DAORegistry.totalDAOs());
  console.log(await DAORegistry.uri(1));
  
  let tx = await DAORegistry.joinDAO(1, 1, ethers.ZeroAddress, {value: ethers.parseEther("0.001")});
  console.log(tx);
  
  console.log(`${signer.address} joined the DAO #1`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
