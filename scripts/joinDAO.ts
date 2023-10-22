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

  const daoId = 3;  
  console.log(await DAORegistry.totalDAOs());
  console.log(await DAORegistry.tokenURI(daoId));
  console.log(await DAORegistry.configOf(daoId));
  console.log(await DAORegistry.balanceOf(signer.address, daoId));
  
  // paid join only, sponsored one requires zkp (use the frontend)
  let tx = await DAORegistry.joinDAO(
    daoId, 
    1, // amount
    ethers.ZeroAddress, // data
    {value: ethers.parseEther("0.001"), gasLimit: "0x1000000"}
  );
  await tx.wait();
  console.log(tx);

  console.log(`${signer.address} joined the DAO`);
  console.log(await DAORegistry.balanceOf(signer.address, daoId));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
