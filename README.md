# daos6551 (looking for a better name)
description placeholder.

## Project Setup

- Project bootstrapped with Hardhat, following the Hardhat's structure.
The `app` folder contains our frontend dapp.

### Env variables
- Copy `.env.sample` to `.env`. Fill env variables. Private key is required while the other ones are not.
```
PRIVATE_KEY=
ALCHEMY_POLYGON_ZK=
SCAN_ZKEVM=
```
### How to: Join a DAO
- Run the `joinDAO.ts` script to join the DAO #1:
```
npx hardhat run scripts/joinDAO.ts --network zkEVM
```
- After run this script the membership token of the DAO will be minted to your wallet and you will get voting power on the DAO.
Then, you may go to the TallyUI to propose, delegate, vote and get access to all the Governance stuff.
This script can be configured to join any other DAO, just change the tokenId parameter (1st one) of the joinDAO function.

### How to: Create a DAO
- Missing the createDAO script. Actually, the deployDAOTBA script created DAO #1 after deployment.

### Create a DAO flow
- Anyone may call the createDAO function on the DAORegistry contract.
- The DAORegistry will create the DAO, minting a membership nft to the founder (caller).
- The DAORegistry will create a TBA for this tokenId and deploy an OZ Governor.
### Join a DAO flow
- Anyone may join the DAO calling the joinDAO function on the DAORegistry paying the right price, if any.
- The DAORegistry contract will mint the dao membership nft to the caller.
- The DAORegistry contract will send the funds from the payment to the DAO treasury.
- The DAORegistry will update the voting power of the minter calling the DAOTBA.

### Two treasuries, why?
Currently, the DAO has 2 treasuries.
One controlled by the DAOTBA, and one controlled by the OZ Governor. While the one controlled by the Governor has a proposal and voting system,
the one controlled by the DAOTBA has a 1-of-n schema, allowing any member of the DAO to execute arbitrary transactions.
Why?, the trustless environment of the OZ Governor is useful for big communities while the 1-of-n schema gives enough flexibility for smaller
and trusted communities like a group of friends or a family.

### OZ Governor
- The Open Zeppelin Governor is a standard for creating DAOs. Nouns DAO style DAOs are also leveraging a modified version of this Governor.
- The OZ Governor does not support ERC1155, so we had to write some interfaces to support it.
- The DAORegistry has the info for every tokenId and it maintains the DAOTBA updated with the right voting power after every token transfer,
while the DAOTBA bound to an specific tokenID gives us enough flexibility to bypass all the ERC1155 support problems by having proxy functions
pointing to the right tokenID.
- With that info in mind we can rely on the DAOTBA as the external token contract (this will make more sense in the Tally section), while the original token contract tracks the supply
and updated the DAOTBA. 

### Tally
- Tally is an user interface for DAOs leveraging the OZ Governor. It is an easy way to test and play with our contracts and daos.
- TallyUI does not support ERC1155 because the OZ Governor does not support it, so we had to write some functions to fake the ERC721 behaviour on our DAOTBA,
in order to make Tally believes our 1155 is a 721. (name, symbol...)
- Also, we had to tell Tally that our DAOTBA was the token contract instead the token itself to make sure it get access to the right tokenID functions knowing nothing about tokenIDs.
```
  Tally -> totalSupply() -> DAOTBA
  DAOTBA -> totalSupply(tokenId) -> DAORegistry
```
- This applies to every other function depending on the tokenId like URI.

## Deploy
### ERC6551Registry
- Run the `deployERC6551Registry.ts` to deploy the ERC6551Registry, or use any other previously deployed:
```
npx hardhat run scripts/deployERC6551Registry.ts
// Take note of your deployment contract address.
```
### DAOTBA implementation
- Run the `deployDAOTBA.ts` to deploy the DAOTBA implementation, or use any other previously deployed:
```
npx hardhat run scripts/deployDAOTBA.ts
// Take note of your deployment contract address.
```
### DAORegistry
- Edit the `deployDAORegistry.ts` script to include your previously deployed `ERC6551Registry` and `DAOTBA` addresses and run it:
```
npx hardhat run scripts/deployDAORegistry.ts
```
- This script also creates a DAO. Take a look on the console, take note of the tx hash and check the event logs on the explorer to get
any important info like the DAOTBA and OZ Governor addresses. You will need them to link your DAO with TallyUI.

### Deployments

Polygon zkEVM testnet:
- **DAORegistry**: 0x919aa365BE3b0eACf3e5d9d8933338D5DF93C1aC
- **ERC6551Registry**: 0x6efa9246af1f6f1f9577990ffe7d07fa0d7101b5
- **DAOTBA implementation**: 0xE6e2A8DE7893E2B458Ef132BfecCfBE83Ebc7675
- **DAOTBA proxy #1**: 0xb43df4837ef489c2d5217de30c7bc98167c5aed1
- **OZ Governor #1**: 0x30be3f5968f269c540a836c5153780be3d045dbc
- **TallyUI**: [https://www.tally.xyz/gov/erc1155-dao](ERC1155DAO)
