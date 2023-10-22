import { ethers } from "hardhat";


async function main() {
  const [signer] = await ethers.getSigners();
  
  // get the dao registry contract 
  const DAORegistryAddress = "0x53f6DD0d1eb5649Aa3BD65c54e6dA7631F4F22Bb";
  const DAORegistry = await ethers.getContractAt(
    "contracts/DAORegistryS.sol:DAORegistry", DAORegistryAddress, signer
  );
  
  // call the registry to get the config of dao #3 
  const daoConfig = await DAORegistry.configOf(3);
  console.log(daoConfig);
  
  // get the daotba #3 contract
  const DAOTBA = await ethers.getContractAt(
    "contracts/DAOTBA.sol:DAOTBA", daoConfig[1], signer
  );
  
  // get the daoGovernor #3 contract
  const daoGovernor = await ethers.getContractAt(
    "DAOGovernor", daoConfig[2], signer
  );
  
  // the proposalId to vote on
  const proposalId = "109526907613312510489600849065927405992735719805092033223308774408159891184918";
  // voting FOR on proposalId and add the comment EthOnline2023
  let tx = await daoGovernor.castVoteWithReason(
    proposalId, "1", "EthOnline2023"/*, {gasLimit: "0x1000000"}*/
  );
  await tx.wait();
  console.log(tx);
/* executeCall will vote on behalf of the DAOTBA, it may hold voting power
  let tx = await DAOTBA.executeCall(
    daoConfig[2], // daoGovernor
    0n, // value
    voteData
  );
  await tx.wait();
  console.log(tx);
*/
  console.log(`${signer.address} voted for in a proposal from the DAOTBA #3`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
