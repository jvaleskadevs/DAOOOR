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

  // get the balance of daotba #3
  const daotbaBalance = await ethers.provider.getBalance(DAOTBA.target);
  console.log(`Balance TBA: ${daotbaBalance}`);

  // delegate votes myself
  let tx = await DAOTBA.delegate(signer.address/*, {gasLimit: "0x1000000"}*/);
  await tx.wait();
  console.log("Delegate transaction receipt:");
  console.log(tx);  

  const daoGovernor = await ethers.getContractAt(
    "DAOGovernor", daoConfig[2], signer
  );
  const { data: proposeTransferData } = await daoGovernor.propose.populateTransaction(
    [signer.address], [ethers.parseEther("0.001")], ["0x"], "Transfer daotba balance proposal!"
  );
 
  // transfer daotba funds to the governor
  tx = await DAOTBA.executeCall(
    daoConfig[2], // daoGovernor
    daotbaBalance,
    "0x"
    //,{gasLimit: "0x1000000"}
  );
  await tx.wait();
  console.log(tx);

  // create proposal
  tx = await DAOTBA.executeCall(
    daoConfig[2], // daoGovernor
    0n, //daotbaBalance,
    proposeTransferData
    /*,{gasLimit: "0x1000000"}*/
  );
  await tx.wait();
  console.log(tx);

  console.log(`${signer.address} proposed a transfer call from the DAOTBA #3`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
