pragma solidity 0.4.24;

//rinkeby POE- 0x6594264cddfdd9bf1d1dd600b3c2b5ab57713f1e
// Register - 0x042ce02d98365c5762143454ce82e986eb327aa8

import "zeppelin/contracts/lifecycle/Pausable.sol";

/** @title Contract keeps the refrences of proofs as proof of existence */
contract ProofOfExistence is Pausable {
    struct Store {
        // Owner of the proof
        address owner;
        // Tags associated with the proof
        bytes32 tags;
        // TransactionId of the proof upload
        bytes32 transactionId;
        // Format of the file
        uint8 fileTypeId;
        // Block number of the proof upload
        uint createdBlock;
    }
    // keyStore stores the data of a proof key
    mapping(bytes32=>Store) private keyStore;
    // userStore stores the proof keys uploaded by an account
    mapping(address=>bytes32[]) private userStore;

    /** @dev Fallback function that throws error
      */
    function () public { revert(); }

    /** @dev Adds a new proof hash to the contract.
      * @param newKey ipfs hash of the uploaded file converted to bytes32
      * @param fileTypeId fileTypeId of the proof file
      * @return whether the proof addition succeeded
      */
    function addProof(bytes32 newKey, uint8 fileTypeId) public
    whenNotPaused returns (bool) 
    {
        // bytes32 converted ipfs hash should be 32 bytes in length
        require(newKey.length == 32, "Invalid length for key");
        // Only keys that are not already added can be added
        require(keyStore[newKey].owner == address(0), "Owner of the fileHash not empty");
        Store memory newProof = Store(msg.sender, "", "0x", fileTypeId, block.number);
        keyStore[newKey] = newProof;
        userStore[msg.sender].push(newKey);
        return true;
    }

    /** @dev Updates the transactionid of proof upload to its referece data.
      * @param proof ipfs hash of the uploaded file converted to bytes32
      * @param transactionId transactionid of the proof adding transaction
      * @return whether the transactionId update succeeded
      */
    function updateProofTransactionId(bytes32 proof, bytes32 transactionId) 
    public whenNotPaused returns(bool) 
    {
        /* Cannot update the transactionId more than once
         * Once a proof is uploaded, that transactionId is updated
         */
        require(keyStore[proof].transactionId == "0x", "TransactionId already updated");
        // The transactionId can only be updated from the account of the proof owner
        require(keyStore[proof].owner == msg.sender, "Only owner can update transactionId");
        keyStore[proof].transactionId = transactionId;
        return true;
    }

    /** @dev Adds tags to a proof
      * @param proof ipfs hash of the uploaded file converted to bytes32
      * @param tags tags for the proof converted to bytes32
      * @return whether the tags update succeeded
      */
    function updateProofDetails(bytes32 proof, bytes32 tags)
    public whenNotPaused returns(bool) 
    {
        require(keyStore[proof].owner == msg.sender, "Only the owner can update the tags");
        require(bytes32(tags).length > 0, "No tags to update");
        keyStore[proof].tags = tags;
        return true;
    }

    /** @dev Gets the total number of proofs uploaded by the sender
      * @return total number of proofs uploaded by the sender
      */
    function getUserProofsCount() 
    public whenNotPaused view returns(uint) 
    {
        return userStore[msg.sender].length;
    }
    
    /** @dev Gets a proof, and its tags uploaded by the sender
      * @param position Index of the uploaded proof in the senders list of uploads
      * @return proof proof stored by sender at the requested index
      * @return tags format of the uploaded proof
      * @return format tags stored for the requested proof
      */
    function getUserProofs(uint position) 
    public whenNotPaused view 
    returns(bytes32 proof, bytes32 tags, uint8 fileTypeId) 
    {
        require(position < userStore[msg.sender].length, "Invalid proof index");
        proof = userStore[msg.sender][position];
        // Get the tag details of the user
        tags = keyStore[proof].tags;
        fileTypeId = keyStore[proof].fileTypeId;
        return (proof, tags, fileTypeId);
    }

    /** @dev Get all the reference details of a proof
      * @param proof ipfs hash of the uploaded file converted to bytes32
      * @return tags tags stored for the requested proof
      * @return transactionId transactionId of the proof upload
      * @return fileTypeId fileTypeId of the uploaded proof
      * @return createdBlock block number of the proof upload
      * @return owner address that uploaded the proof
      */
    function getProofDetails(bytes32 proof) 
    public whenNotPaused view 
    returns(bytes32 tags, bytes32 transactionId, uint8 fileTypeId, uint createdBlock,
    address owner) 
    {
        return (
            keyStore[proof].tags,
            keyStore[proof].transactionId,
            keyStore[proof].fileTypeId,
            keyStore[proof].createdBlock,
            keyStore[proof].owner
        );
    }
}
