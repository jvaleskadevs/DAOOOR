import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  
  const DAORegistryAddress = "0x599D3d303d70b23f80a4Be7db4E6E701663034D8";
  const DAORegistry = await ethers.getContractAt("contracts/DAORegistry6909.sol:DAORegistry", DAORegistryAddress, signer);
  
  console.log(await DAORegistry.name());
  console.log(await DAORegistry.symbol());
  console.log(await DAORegistry.decimals());
  
  const totalDAOs = await DAORegistry.totalDAOs();
  console.log(totalDAOs);
  
  console.log(await DAORegistry.tokenURI(1));
  console.log(await DAORegistry.configOf(1));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
