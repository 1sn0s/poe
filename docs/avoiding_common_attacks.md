Call to external contract codes are avoided to prevent any **reentrancy vulnerabilities and race conditions**, except
in the case of libraries.

Community audited Zeppelin libraries are used for implementing **pause functionality** and handling the **ownership of contracts**.
All the most common 20 cases of integer overflow and underflow are not applicable in the contracts.
Contract has **no timestamp dependencies**. Storing timestamp of a block was removed, and done from application code
using the block number.

Contract **analysed for DoS attacks**. Not found any, except when the contract is in paused state, which is the desired
state of the contract at that time.

**Access restrictions** and are put in for making state changes, that aligns with application logic to prevent those kind of attacks.
For example, only the user account of a proof can update the tags associated with it.

The smart contracts were analysed for security vulnerabilities using the **Mythril security analysis tool**.
Based on the analysis :
Checks were put in for array lengths to check Integer overflows and out of range address.

Smart contracts were analysed using the **Smart Check security tool**.
Based on the analysis :
Solidity compiler version was fixed to one version.
Payable fallback function was removed since it is redundant in newer solidity verisons.

Double checked on the code on zeppelin pausible modifiers for any issues.

Assumed conditions about smart contract function parameters and the state of the contract
are checked in **require conditions** to make sure they align with the smart contract assumptions about them.
For example, only ipfs hashes converted to 32 bytes are accepted as proof (keys).

Transaction Ids of proof upload are updated in the contract for extra reference for the data stored.

**Fallback function** is implemented, that reverts and not payable to prevent any unwanted function calls or ethers sent.
Also, no assumption about the balance of the contract is used. So any ether sent to the contract by other possible ways,
would not have cause any threat to the contract.
