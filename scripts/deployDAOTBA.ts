import { ethers } from "hardhat";

async function main() {
  const DAOTBA = await ethers.deployContract("contracts/DAOTBA.sol:DAOTBA", {gasLimit: "0x1000000"});

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
