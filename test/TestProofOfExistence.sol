pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ProofOfExistence.sol";

/*
 Additional tests to make sure that the add and update functionalities are working
 These tests are written as solidity test so that the contract function execution
 result can be tested, unlike from javascript using the transaction receipt
 */
contract TestProofOfExistence {

    /*
     Test adding adding a new proof to the contract
     */
    function testAddingAProofOfExistence() public {
        ProofOfExistence poe = ProofOfExistence(DeployedAddresses.ProofOfExistence());
        // 32 byte string of the ipfs hash of uploaded file
        bytes memory keybytes = "0x7ff213b8b00abfe6d7bd5c29e4f018cdc49a6bc956d9252791c230b0f8442964";
        // type of file
        uint8 fileTypeId = 0;
        bytes32 key;
        // load the bytes string to convert it to bytes32
        assembly {
            key := mload(add(keybytes, 32))
        }
        // Add the proof key and the file typeId
        Assert.equal(poe.addProof(key, fileTypeId), true, "Failed to add proof details by user");
    }

    /*
     Test updating the tags data of a proof
     */
    function testUpdateProofDetails() public {
        ProofOfExistence poe = ProofOfExistence(DeployedAddresses.ProofOfExistence());

        bytes memory keybytes = "0x7ff213b8b00abfe6d7bd5c29e4f018cdc49a6bc956d9252791c230b0f8442964";
        // proof tag string converted to bytes
        bytes memory tag = "0x74616774657374206a73696d616765";
        bytes32 key;
        bytes32 newTag;
        //load the bytes to convert it into bytes32
        assembly {
            key := mload(add(keybytes, 32))
            newTag := mload(add(tag, 32))
        }
        // update the tag for the proof key
        Assert.equal(poe.updateProofDetails(key, newTag), true, "Failed to make proof updates by user");
    }
}