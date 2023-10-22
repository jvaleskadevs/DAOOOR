import { ethers } from "hardhat";
/*
// using this abi, I just compiled a new contract version
// losing my working artifacts... hopefully the app is outdated
import { DAO_REGISTRY_ABI } from "../app/constants/daoRegistry";
*/
async function main() {
  const [signer] = await ethers.getSigners();
  
  const DAORegistryAddress = "0x53f6DD0d1eb5649Aa3BD65c54e6dA7631F4F22Bb";
  const DAORegistry = await ethers.getContractAt(
    "contracts/DAORegistryS.sol:DAORegistry", DAORegistryAddress, signer
  );
  
  const daoConfig = await DAORegistry.configOf(2);
  console.log(daoConfig);
  
  const DAOTBA = await ethers.getContractAt(
    "contracts/DAOTBA.sol:DAOTBA", daoConfig[1], signer
  );

  const daotbaBalance = await ethers.provider.getBalance(DAOTBA.target);
  console.log(`Balance TBA: ${daotbaBalance}`);

  let tx = await DAOTBA.executeCall(
    signer.address,
    daotbaBalance,
    "0x",
    {gasLimit: "0x1000000"}
  );
  await tx.wait();
  console.log(tx);

  console.log(`${signer.address} executed call from the DAOTBA #1`);
  console.log(`Balance TBA: ${await ethers.provider.getBalance(DAOTBA.target)}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
