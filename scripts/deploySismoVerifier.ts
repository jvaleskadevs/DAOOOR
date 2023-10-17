import { ethers } from "hardhat";

async function main() {
  const SismoVerifier = await ethers.deployContract("SismoVerifier");

  await SismoVerifier.waitForDeployment();

  console.log(
    `SismoVerifier deployed to ${SismoVerifier.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
