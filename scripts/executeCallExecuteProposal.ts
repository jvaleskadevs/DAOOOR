import { ethers } from "hardhat";


async function main() {
  const [signer] = await ethers.getSigners();
  
  // get the dao registry contract 
  const DAORegistryAddress = "0x43FDf679DCb7cF5D9469dC9Ca4D3915a64633568";
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
  
  const daoGovernor = await ethers.getContractAt(
    "DAOGovernor", daoConfig[2], signer
  );

  const { data: executeData } = await daoGovernor.execute.populateTransaction(
    [signer.address], [ethers.parseEther("0.001")], ["0x"], ethers.solidityPackedKeccak256(["string"], ["Transfer daotba balance proposal!!"])
  );
  //console.log(executeData);
  // get the balance of daoGov #3
  const daoGovernorBalance = await ethers.provider.getBalance(daoGovernor.target);
  console.log(`Balance Governor: ${daoGovernorBalance}`);

  let tx = await DAOTBA.executeCall(
    daoConfig[2], // daoGovernor
    0n, // value
    executeData
    /*,{gasLimit: "0x1000000"}*/
  );
  await tx.wait();
  console.log(tx);

  console.log(`${signer.address} executed governor proposal from the DAOTBA #3`);
  console.log(`Balance Governor: ${await ethers.provider.getBalance(daoGovernor.target)}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
