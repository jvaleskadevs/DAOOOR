import { ethers } from "hardhat";

// using this abi, I just compiled a new contract version
// losing my working artifacts... hopefully the app is outdated
import { DAO_REGISTRY_ABI } from "../app/constants/daoRegistry";

async function main() {
  const [signer] = await ethers.getSigners();
  
  const DAORegistryAddress = "0x559b00EDacFa5EE8dDD82e1CD53c0D23bc798684";
  const DAORegistry = await ethers.getContractAt(DAO_REGISTRY_ABI, DAORegistryAddress, signer);
  
  console.log(await DAORegistry.totalDAOs());
  console.log(await DAORegistry.tokenURI(1));
  console.log(await DAORegistry.configOf(1));
  console.log(await DAORegistry.balanceOf(signer.address, 1));
  
  // paid join
  let tx = await DAORegistry.joinDAO(1, 1, ethers.ZeroAddress, {value: ethers.parseEther("0.001")});
  await tx.wait();
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
