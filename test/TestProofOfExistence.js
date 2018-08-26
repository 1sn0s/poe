var ProofOfExistence = artifacts.require('./ProofOfExistence.sol');

/* 
 Testing for Proof of existence contract using web3
 There are three kinds of accounts assumed to using the contract
 A smart contract owner, user, and any other user
 The tests below are assumed to be operations done in the contract life cycle.
 The order of the tests are such that, one test might depend on result of 
 previous test, for the current state of the contract.
 The input proof details are defined in the 'proof' object
 State changing transactions are initially tested with their transaction receipts
 for their validity and status.
 The state changes made by the transaction is tested in different tests afterwards.
 */
contract('ProofOfExistence', (accounts) => {
    // account of owner
    const ownerAccount  = accounts[0];
    // account of app user
    const userAccount   = accounts[1];
    // an external account
    const othersAccount = accounts[2];
    // To identify transactions done from the contract account
    const fromOwner     = {from: ownerAccount}
    // To identify transactions done from a user of the application
    const fromUser      = {from: userAccount};
    // To identify transactions done from any user that is not owner or user
    const fromOthers    = {from: othersAccount};

    // Test proof - Proof used for testing, with key and tag data for testing
    const proof = {
        // proof key which is the bytes32 converted ipfs hash of the uploaded file
        key: "0x7ff213b8b00abfe6d7bd5c29e4f018cdc49a6bc956d9252791c230b0f8442964",
        // Type of file uploaded. (1 - image, 2 - video)
        filetypeId: 1,
        // tag for the proof file
        tag: "tagtest jsimage",
        transactionId: '',
        createdBlock: 0,
    }

    /*
     Test that a user is able to upload proof data
     and make sure that the owner and proper block number is recorded.
     Deploys the proof of existence contract.
     The proof is bytes32 converted ipfs hash of the uploaded file and 
     fileTypeId is the id of the proof file
     Adds the test proof to the contract from the user account, checks the transaction receipt
     to see if the transaction is valid.
     Stores the transactionId and the block number on the receipt for further tests
     */
    it('should upload proof by the user', () => {
        let poe;
        return ProofOfExistence.deployed()
        .then( (instance) => {
            poe = instance;
            return (poe.addProof(proof.key, proof.filetypeId, fromUser));
        })
        .then( (transaction) => {
            assert.isNotNull(transaction.receipt, "Failed to add proof");
            assert.equal(1, transaction.receipt.status, "Proof addition transaction failed");
            return transaction.receipt;
        })
        .then( (txReceipt) => {
            assert.isNotEmpty(txReceipt.transactionHash, "Failed to add proof. No transaction hash");
            proof.transactionId = txReceipt.transactionHash;
            proof.createdBlock = txReceipt.blockNumber;
        })
        
    });

    /*
     Test if the transactionId is stored along with the proof data,
     after the transaction receipt is received
     Updates the transactionId that was received from the previous step
     to the contract, from the user account.
     Checks the transaction receipt to make sure the transaction went through
     and has succeeded.
     */
    it('should store the transactionId of the proof upload for reference', () => {
        return ProofOfExistence.deployed().then((instance) => {
            return (instance.updateProofTransactionId(proof.key, proof.transactionId, fromUser));
        })
        .then( (transactionIdUpdatetx) => {
            assert.isNotNull(transactionIdUpdatetx.receipt,
                "Failed to add proof transactionId");
            assert.equal(1, transactionIdUpdatetx.receipt.status,
                "Transaction to update the proof transactionId failed");
        })
    });

    /*
     Test if the count of proofs have increased for the user
     There should be 1 proof for the user from the previous step
     Gets the number of proofs for the user account and checks
     if it is 1 (added in the previous step)
     */
    it('should get the total proofs count for the user', () => {
        return ProofOfExistence.deployed().then((instance) => {
            return (instance.getUserProofsCount(fromUser));
        })
        .then( (totalProofsCount) => {
            assert.equal(totalProofsCount, 1, "Total proofs uploaded by the user is 1");
        });
    });

    /*
     Test if the user is able to update tags, for the proof that they uploaded
     Update the tag for the proof (from the previous step), using the user account.
     Check the transaction receipt and its status to see if it succeeded
     */
    it('should let the owner of a proof to update tags for proofs', () => {
        return ProofOfExistence.deployed().then((instance) => {
            return (instance.updateProofDetails(proof.key, web3.fromAscii(proof.tag), fromUser));
        })
        .then( (tagUpdateTx) => {
            assert.isNotNull(tagUpdateTx.receipt, "Tag update transaction failed");
            assert.equal(1, tagUpdateTx.receipt.status,
                "Transaction to update the proof tag failed");
        });
    });

    /* 
     Test if no one other than the owner of a proof is able to update tags for a proof
     Converts the proof to bytes32 before making update call to contract as other user
     Expects the transaction to throw exception of type Error. Checks for the same
     */
    it('should not let anyone other than owner to update tags for proofs', () => {
        return ProofOfExistence.deployed()
        .then( async (instance) => {
            let err = null;
            try {
                await instance.updateProofDetails(proof.key, web3.fromAscii(proof.tag), fromOthers);
            } catch(error) {
                err = error;
            }
            assert.ok(err instanceof Error, "Valid tag update transaction done by an account that is not owner");
        })
    });

    /* 
     Test if user is able to get a proof uploaded by them
     Uses the index from the users list of proofs stored to get the proof key
     Get the proof hash, tags and fileTypeId at position 0, using the user account
     Matches the results with the values uploaded in previous step
     */
    it('should let a user to pull the proof uploaded by them', () => {
        const position = 0;
        return ProofOfExistence.deployed().then((instance) => {
            return (instance.getUserProofs(position, fromUser));
        })
        .then( (proofDetails) => {
            assert.equal(proofDetails[0], proof.key,
                "Proof key fetched desnot match with the stored one from user");
            assert.equal(web3.toAscii(proofDetails[1]).replace(/\u0000/g, ''), proof.tag,
                "Tags fetched desnot match with the stored one from user");
            assert.equal(proofDetails[2], proof.filetypeId,
                "Proof filetypeId fetched desnot match with the stored one from user");
        });
    });

    /*
     Test if any one is able to get reference data about a proof
     Gets all the data available for a proof using its bytes 32 converted hash key,
     using other account
     Matches the user account of the proof with the user account used from testing
     Matches the bytes32 decoded tag value, proof transactionId, filetypeId, proof created block
     with the values that were stored/updated in the previous steps
     */
    it('should let anyone pull details of a proof to verify', () => {
        return ProofOfExistence.deployed().then((instance) => {
            return (instance.getProofDetails(proof.key, fromOthers));
        })
        .then( (proofDetails) => {
            assert.equal(proofDetails[4], userAccount,
                "Owner doesnot match with the uploaded user");
            assert.equal(web3.toAscii(proofDetails[0]).replace(/\u0000/g, ''), proof.tag,
                "Tags doesnot match with tags of the proof");
            assert.equal(proofDetails[1], proof.transactionId,
                "TransactionId doesnot match with transaction id of the proof");
            assert.equal(proofDetails[2], proof.filetypeId,
                "FiletypeId doesnot match with timestamp id of the proof");
            assert.equal(proofDetails[3], proof.createdBlock,
                "Block number doesnot match with block id of the proof");
            });
        });

    /*
     Test if any one other than the owner account is able to pause the contract
     Make contract call to pause the function from other account.
     Expect the contract call to throw exception.
     Make call to get user proof at position 0.
     Match the proof key returned to be same as proof key stored earlier
     */
    it('should not let anyone other than contract owner to pause the contract', () => {
        const position = 0;
        return ProofOfExistence.deployed()
        .then(async (instance) => {
            let err = null;
            try{
                await instance.pause(fromOthers);
            } catch (error){
                err = error;
            }
            assert.ok(err instanceof Error, "pause contract transaction not revereted for not owner account");
            return (instance.getUserProofs(position, fromUser));
        })
        .then( (proofDetails) => {
            assert.equal(proofDetails[0], proof.key,
                "Proof key fetched desnot match with the stored one from user");
        });
    });
        
    /* 
     Test if the owner is able to pause the contract
     Make call to the pause function from the owner account and check if it fails
     Try to get proof details from the owner account
     Try to update proof details from user account
     Try to total proofs count from the user account
     Try to get proof details as other account
     Expect all the four operations above to throw exceptions
     */
    it('should let the contract owner to pause the contract', () => {
        let poe;
        return ProofOfExistence.deployed()
        .then(async (instance) => {
            let err = null;
            poe = instance;
            try{
                return await instance.pause(fromOwner);
            } catch (error){
                err = error;
            }
            assert.ifError(err instanceof Error, "Pause contract failed");
        })
        .then(async ()=>{
            let errGetProofDetails = null;
            let errUpdateProofDetails = null;
            let errGetProofCount = null;
            let errUpdateTagDetails = null;
            try{
                await poe.getProofDetails(proof.key, fromOwner);
            } catch (error){
                errGetProofDetails = error;
            }
            try{
                await poe.updateProofDetails(proof.key, web3.fromAscii(proof.tag), fromUser);
            } catch (error){
                errUpdateProofDetails = error;
            }
            try{
                await poe.getUserProofsCount(fromUser);
            } catch (error){
                errGetProofCount = error;
            }
            try{
                await poe.getProofDetails(proof.key, fromOthers);
            } catch (error){
                errUpdateTagDetails = error;
            }
            assert.ok(errGetProofDetails instanceof Error, "Owner able to get proof details when paused");
            assert.ok(errUpdateProofDetails instanceof Error, "User able to update proof when paused");
            assert.ok(errGetProofCount instanceof Error, "User able to get proofs count when paused");
            assert.ok(errUpdateTagDetails instanceof Error, "Others able to get proof details when paused");
        })
    });

    /*
     Test if any one other than the owner account is able to unpause the contract
     Make contract call to unpause the function from owner account.
     Expect the contract call to throw exception.
     Make call to get user proof at position 0.
     Match the proof key returned to be same as proof key stored earlier
     */
    it('should let the contract owner to unpause a paused contract', () => {
        const position = 0;
        return ProofOfExistence.deployed()
        .then(async (instance) => {
            let err = null;
            try{
                await instance.unpause(fromOwner);
            } catch (error){
                err = error;
            }
            assert.ifError(err instanceof Error, "Unpause contract failed");
            return (instance.getUserProofs(position, fromUser));
        })
        .then( (proofDetails) => {
            assert.equal(proofDetails[0], proof.key,
                "Not able to get the right proof key");
        });
    });

})