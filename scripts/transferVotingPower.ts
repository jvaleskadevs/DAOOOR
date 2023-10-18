import { ethers } from "hardhat";

// using this abi, I just compiled a new contract version
// losing my working artifacts... hopefully the app is outdated
import { DAO_REGISTRY_ABI } from "../app/constants/daoRegistry";

async function main() {
  const [signer] = await ethers.getSigners();
  
  const DAORegistryAddress = "0x559b00EDacFa5EE8dDD82e1CD53c0D23bc798684";
  const DAORegistry = await ethers.getContractAt(
    DAO_REGISTRY_ABI, DAORegistryAddress, signer
  );
  
  const daoConfig = await DAORegistry.configOf(1);
  console.log(daoConfig);
  
  const DAOTBA = await ethers.getContractAt(
    "contracts/DAOTBA6909.sol:DAOTBA", daoConfig[2], signer
  );
  
  // it will be necessary to delegate votes first.
  let delegateTx = await DAOTBA.delegate(signer.address);
  await delegateTx.wait();
  console.log(delegateTx);
  
  const delegate = await DAOTBA.delegates(signer.address);
  console.log(delegate);

  const votingPower = await DAOTBA.getVotes(signer.address);
  console.log(`Voting Power: ${votingPower}`);
  
  const balance = await DAORegistry.balanceOf(signer.address, 1);
  console.log(`Voting Power (balance): ${balance}`);

  let tx = await DAORegistry.transfer(
    "0x0000000000000000000000000000000000000000",
    1,
    1
  );
  await tx.wait();
  console.log(tx);

  console.log(`${signer.address} transferred to zero address of DAOTBA #1 token`);
  
  const newVotingPower = await DAOTBA.getVotes(signer.address);
  console.log(`New Voting Power: ${newVotingPower}`);
  
  const newBalance = await DAORegistry.balanceOf(signer.address, 1);
  console.log(`New Voting Power (balance): ${newBalance}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
