import { ethers } from "hardhat";

async function main() {
  const GovernanceDeployer = await ethers.deployContract("GovernanceDeployer", {gasLimit: "0x1000000"});

  await GovernanceDeployer.waitForDeployment();

  console.log(
    `GovernanceDeployer deployed to ${GovernanceDeployer.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
