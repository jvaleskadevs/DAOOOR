import { ethers } from "hardhat";

async function main() {
  const DAOTBA = await ethers.deployContract("DAOTBA");

  await DAOTBA.waitForDeployment();

  console.log(
    `DAOTBA deployed to ${DAOTBA.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
