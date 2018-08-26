pragma solidity 0.4.24;

import "zeppelin/contracts/ownership/Ownable.sol";

/** @title Contract provides upgrade mechanism for proof of existence contract */
contract Register is Ownable {
    address[] public previousContracts;
    address public currentContract;

    /** @dev Constructor to set the initial address of Proof of existence contract
      * @param contractAddress initial address of Proof of existence contract
      */
    function Register(address contractAddress) {
        if (contractAddress != address(0)) {
            currentContract = contractAddress;
        }
    }


    /** @dev Change the contract address to a different address
      * @param newContractAddress Latest address of the Proof of existence contract 
      * @return Whether the contract address was changed successfully
      */
    function changeContract(address newContractAddress)
    public onlyOwner returns(bool) 
    {
        if (newContractAddress != currentContract) {
            require(previousContracts.length < 2**256-1, "Previous contracts list exhauseted");
            // Push existing contract address to a array of address history
            previousContracts.push(currentContract);
            // Set the latest contract address
            currentContract = newContractAddress;
            return true;
        }
        return false;
    }
}