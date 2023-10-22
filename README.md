# DAOOOR
DAOOOR is a powerful tool for creating, joining and managing DAOs.

Create a DAO with a treasury and a governance system in less than 2 minutes.
## Project Info
DAOOOR was built by J.Valeska and JP in the EthOnline2023 hackathon organized by EthGlobal.

This is a project bootstrapped with Hardhat, following the Hardhat's structure.
The `app` folder contains our frontend dapp.

### Experimenting with
- DAOs and governance (OZ Governor).
- Account Abstraction, tokens as wallets (EIP 6551).
- New Multi-token standard (EIP 6909).
- EIP6909 meets EIP6551, semifungible tokens as DAO TBAs.
- A TBA with multiple owners is not a problem, it is a DAO.
- The problem is how to manage this DAO, we have 3 schemas availables:
  1. **1-of-n, no governor**: Every holder/member can call `executeCall`. A transparent treasury for family, friends or any other trusted environment.
  2. **1-of-n and governor**: Two treasuries, one trusted and one trustless adding an OZ Governor on top of the previous one schema.
  3. **m-of-n with governor**: Two treasuries but the `executeCall` function only can have the Governor as destination, ensuring every call goes trough the governance. (100% trustless)
- Sponsored DAO memberships with Zero Knowledge proofs powered by Sismo.
- Easy, fast and reliable indexed data access with The Graph.
### Deployed on
- Polygon Mumbai
- Polygon zkEVM
- Mantle
- Scroll
  
*Looking for contracts addressess, verified contracts and transaction hashes? Check `deployments.info`.*

## DAPP
### Create DAO
- Connect your wallet pointing to the Polygon Mumbai network.
- Press `Create DAO` button.
- Fill the required fields: name, description, image and governance schema. (Price and Sismo GroupId can be empty, default to 0)
- Press `Create` button and confirm the transaction in your wallet.
- Done!

But, what happened?
- The metadata of your DAO was uploaded to IPFS.
- Call to `createDAO` function of the `DAORegistry.sol` contract.
- The `DAORegistry` created a token (erc6909).
- The `DAORegistry` created a TBA, token bound account (erc6551).
- The `DAORegistry` deployed an OZ Governor (if requested).
- The `DAORegistry` stored the DAOConfig.
- The `DAORegistry` minted a token to the DAO founder.

### Join DAO
- Connect your wallet pointing to the Polygon Mumbai network.
- Press the `Join` button of the desired DAO.
- Confirm the transaction (make sure you have enough ether).
- Done!
### Join DAO (sponsored with Sismo)
When a founder creates a DAO can selecta a data soruce groupId.This groupId will get free access to the DAO.
Sponsored memberships makes sense in several scenarios, for example combined with a high price to create private communities or give away memberships to students, artists or contributors. Currently, the impersonation mode is on to skip complexity on testing.
- Connect your wallet pointing to the Polygon Mumbai network.
- Press `Join with Sismo` button.
- Generate the Zero Knowledge proof with Sismo (impersonation mode).
- Press `Join` button (this time it will use the ZKP instead ask you for a payment).
- Confirm the transaction in your wallet.
- Enjoy your sponsored DAO membership.

Under the hood:
- The `DAORegistry` minted the DAO membership token to the caller.
- The `DAORegistry` sent the funds from the payment, if any, to the DAO treasury.
- The `DAORegistry` updated the voting power of the minter calling the DAOTBA.

## Scripts flow

Make sure you change the required contract addresses to the ones matching your network in `deployments.info`.  
**Polygon Mumbai**: make sure the DAORegistry is pointing to DAORegistry to get Sismo support. 
**Polygon zkEVM**: make sure the DAORegistry is pointing to DAORegistryS or the deployment will fail.  
**Mantle**: make sure {gasLimit: "0x.."} is no commented out and the DAORegistry is pointing to DAORegistryS or the deployment will fail.  
**Scroll**: make sure {gasLimit: "0x.."} is commented out and the DAORegistry is pointing to DAORegistryS or the deployment will fail.  

- deployERC6551Registry
- deployDAOTBA
- deployGovernanceDeployer
- deployDAORegistry (the 3 previous addresses are sent here as constructor parameters)
- transferOwnership of GovernanceDeployer to DAORegistry (called from deployDAORegistry, you can skip)
- createDAO (called from deployDAORegistry, you can skip)
- joinDAO (make sure you are pointing to the right DAO)
- infoDAO (show info (configDAO) about DAOs)

### DAOTBA scripts (daotba #1 #2, schema 1-of-n)
- executeCallFromDaoTba (change the daoId, configOf(daoId), to point to the desired DAO, schema m-of-n will fail if destination is not the governor)

### Governor scripts flow (daotba #3, schema m-of-n)
This schema ensures that all the calls to the `executeCall` function are sent to the Governor, deal with that requires hashing the transaction calldata of the proposal flow and sending it to the Governor trough the `executeCall` function of the DAOTBA, giving the DAO members a full trustless environment even if any holder can call the `executeCall` function.

- delegateVotes to yourself (called from executeCallCreateProposal, can skip)
- send funds from the daotba to the governor (called from executeCallCreateProposal, can skip)
- executeCallCreateProposal (then, go to explorer and take note of the prosalId)
- executeCallVoteOnProposal (you will need the previous proposalId)
- executeCallExecuteProposal (after voting period, only if the proposal passed)

### Governor Tally flow (UI) (daotba #2 and #3, schema m-of-n)
You may go to the Tally UI to propose, delegate, vote and get access to all the Governance stuff.
- Visit https://tally.xyz
- Connect your wallet.
- Add DAO.
- Add the Governor address and the block height.
- Add the token, use the DAOTBA address here and the same block height.
- Once your DAO is ready, delegate votes to yourself before doing anything.
- Create a proposal. It must be unique.
- Cast your vote. (make sure the proposal is active and you had delegated voting power)
- If the proposal passes, execute the proposal.

## Project Development

### Env variables
- Copy `.env.sample` to `.env`. Fill env variables. Private key is required while the other ones are not.
```
PRIVATE_KEY=
```
### Dapp flow
- Fill the `.env` file with nft.storage token.
- Update and deploy the Subgraph.
- Update constants/daoRegistry.ts abi and address.
- Enjoy creating and joining DAOs from the dapp.

## Extra thoughts
### Two treasuries, why?
Currently, the DAOTBA #2 has 2 treasuries with 2 different schemas, 1-of-n and m-of-n.
One controlled by the DAOTBA, and one controlled by the OZ Governor. While the one controlled by the Governor has a proposal and voting system,
the one controlled by the DAOTBA has a 1-of-n schema, allowing any member of the DAO to execute arbitrary transactions.
Why?, the trustless environment of the OZ Governor is useful for big communities while the 1-of-n schema gives enough flexibility for smaller
and trusted communities like a group of friends or a family.

### Schema m-of-n, onlyGovernor, daotba #3
The limited executeCall function inside our DAOTBA #3 is probably the most important line of code of this project.
Connecting all pieces together, allowing 6551 to support 6909 semifungibility and solving the 1-of-n to m-of-n schema problem for trustless environments.
And, it will open endless possibilities with 6551 and 6909 as primitives. Creating DAOs is just a little proof of what can be done playing around with them.

### OZ Governor
- The Open Zeppelin Governor is a standard for creating DAOs. Nouns style DAOs are also leveraging a modified version of this Governor and they can be easily supported pointing to a different GovernorDeployer and changing the TBA implementation.
- The OZ Governor does not support ERC6909 (nor ERC1155), so we had to write some interfaces to support it.
- The DAORegistry has the info for every tokenId and it maintains the DAOTBA updated with the right voting power after every token transfer,
while the DAOTBA bound to an specific tokenID gives us enough flexibility to bypass all the ERC6909/ERC1155 support problems by having proxy functions
pointing to the right tokenID. (the implementation of the erc1155 can be found on the oldVersions folder and it is outdated)
- With that info in mind we can rely on the DAOTBA as the external token contract (this will make more sense in the Tally section), while the original token contract tracks the supply
and updates the DAOTBA. 

### Tally
- Tally is an user interface for DAOs leveraging the OZ Governor. It is an easy way to test and play with our contracts and daos.
- TallyUI does not support ERC6909 (nor ERC1155) because the OZ Governor does not support it, so we had to write some functions to fake the ERC721 behaviour on our DAOTBA,
in order to make Tally believes our 6909 is a 721. (name, symbol...)
- Also, we had to tell Tally that our DAOTBA was the token contract instead the token itself to make sure it get access to the right tokenID functions knowing nothing about tokenIDs.
```
  Tally -> totalSupply() -> DAOTBA
  DAOTBA -> totalSupply(tokenId) -> DAORegistry
```
- This applies to every other function depending on the tokenId like URI.

### Contracts
- **DAORegistry**: the core of our project, also called the DAOR. Create, join and manage all DAOs.
- **DAORegistryS**: an small version of DAOR, with no Sismo support.
- **ERC6551Registry**: the erc 6551 Registry. Create TBAs.
- **DAOTBA implementation**: a custom implementation of the a 6551 TBA, the DAOTBA.
- **DAOTBA proxy #1**: a DAOTBA of type 1 with a high price and sponsored by ZKP, ideal for trusted and private communities.
- **DAOTBA proxy #2**: a DAOTBA of type 2 with a low price and sponsored by ZKP, ideal for testing purposes.
- **DAOTBA proxy #3**: a DAOTBA of type 3 with a low price and sponsored by ZKP, ideal for big communities and trustless environments.
- **OZ Governor #2 #3**: an standard OZ Governor supporting the multi-token erc6909 as governance token.
- **ERC6909**: a custom implementation of the ERC6909, mixing the both reference implemantations availables (solmate and jtriley).
- **TallyUI**: a cool and ready to use interface to interact with the OZ Governor (we had a hard work to make the erc6909 and the DAOTBA look like an ERC721)
