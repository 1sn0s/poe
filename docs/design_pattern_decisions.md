Main patterns implemented in the contracts

Registry pattern
A registry design pattern was implemented as an upgrade mechanism for the proof of existence smart contract.
In the context of the application, during a user session of the application, the contract address
of the proof of existence contract is considered to be the same. So the address would be fetched first,
by calling the registry contract and further interactions during the session would made to that contract.
It is assumed that in the case of an upgrade, the existing contract will be paused first.

Emergency stop/Circuit breaker pattern
To pause and unpause a contract completely in case of any critical bugs or other reasons
Only the owner would be able to do this.

Ownership pattern
To set the ownership account for the contracts. This allows for access control for certain functionalities.
For example, only the owner can change the address of the current contract in the registry contract.
Also allows for a safe way to transfer the ownership from the owner to a new account.

Rejector pattern
A fallback function not payable, to reject any ether sent to the contract, since it is irrelevant to the contract logic


Patterns not implemented

Delegate Call Upgrade pattern
Why not:
In the context of the application, during a user session of the application, the contract address
of the proof of existence contract is considered to be the same.
It is assumed that in the case of an upgrade, the existing contract will be paused first.
So for this reason, a delegate call for all contract call seemed less prefereable.

Lazy data migration
A data migration pattern to migrate data to a new contract, when get calls are made for old data.
Why not:
Couldn't figure out a way to let the contract pay for migration instead of user
Came across this pattern, very late in the process.

Mortal pattern
A safe way to destroy a proof of existence smart contract by the owner.
Possibly can be used in case of contract upgrade after data migration
Why not:
It is better to keep the contract in paused state than to destruct the contract.
