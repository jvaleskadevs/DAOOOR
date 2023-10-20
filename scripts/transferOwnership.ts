import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  
  const GovernanceDeployerAddress = "0xDf223b69512796D871eF24fCd48D6fa3130559bA";
  const GovernanceDeployer = await ethers.getContractAt("GovernanceDeployer", GovernanceDeployerAddress, signer);
  
  const DAORegistry = "0xeBD0bb6f463971044fB07b91C5B6eD191795a5D9";
  
  let tx = await GovernanceDeployer.transferOwnership(DAORegistry);
  await tx.wait();
  console.log(tx);
  
  console.log("/////////////////////////");
  console.log(`Transferred ownership of ${GovernanceDeployer.target} to ${DAORegistry}.`);
  console.log("/////////////////////////");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
