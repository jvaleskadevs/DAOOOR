import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  
  const DAORegistryAddress = "0x559b00EDacFa5EE8dDD82e1CD53c0D23bc798684";
  const DAORegistry = await ethers.getContractAt("contracts/DAORegistry6909.sol:DAORegistry", DAORegistryAddress, signer);
  
  console.log(await DAORegistry.totalDAOs());
  console.log(await DAORegistry.tokenURI(1));
  console.log(await DAORegistry.configOf(1));

  // paid join
  let tx = await DAORegistry.joinDAO(1, 1, ethers.ZeroAddress, {value: ethers.parseEther("0.001")});
  console.log(tx);

  console.log(`${signer.address} joined the DAO #1`);
  console.log(await DAORegistry.balanceOf(signer.address, 1));
  /*
  // free join
  let tx = await DAORegistry.joinDAO(1, 1, ethers.ZeroAddress);
  console.log(tx);
  
  console.log(`${signer.address} joined the DAO #1`);
  */
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
