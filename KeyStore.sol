pragma solidity ^0.4.21;

library KeyStoreLibrary {

    struct Store {
        address owner;
        bytes32 tags;
        bytes32 transactionId;
        uint createdTimeStamp;
        uint createdBlock;
    }

    struct StoreGroup {
        mapping(bytes32=>Store) keyStore;
        mapping(address=>bytes32[]) userStore;
    }
    
    modifier keyPresent(bytes32[] keysList, uint position){
        require(keysList.length > 0, "No data present at the position");
        _;
    }
    
    function addKey(StoreGroup storage self, bytes32 newKey) 
    public returns(bool) 
    {
        require(self.keyStore[newKey].owner == address(0), "Owner of the fileHash not empty");
        Store memory newProof = Store(msg.sender, "", "0x", block.timestamp, block.number);
        self.keyStore[newKey] = newProof;
        self.userStore[msg.sender].push(newKey);
        return true;
    }
        
    function getKey(StoreGroup storage self, uint position) 
    public keyPresent(self.userStore[msg.sender], position) view returns(bytes32)
    {
        return self.userStore[msg.sender][position];
    }

    function getNumberOfKeys(StoreGroup storage self) 
    public view returns(uint)
    {
        return self.userStore[msg.sender].length;
    }

    function getTags(StoreGroup storage self, bytes32 key) 
    public view returns(bytes32)
    {
        return self.keyStore[key].tags;
    }

    function getKeyDetails(StoreGroup storage self, bytes32 proof) public view 
    returns(bytes32 tags, bytes32 transactionId, uint createdTimeStamp, uint createdBlock,
    address owner)
    {
        return (
            self.keyStore[proof].tags,
            self.keyStore[proof].transactionId,
            self.keyStore[proof].createdTimeStamp,
            self.keyStore[proof].createdBlock,
            self.keyStore[proof].owner
        );
    }

    function updateTags(StoreGroup storage self, bytes32 key, bytes32 tags) 
    public returns(bool)
    {
        require(self.keyStore[key].owner == msg.sender, "Only the owner can update the tags");
        require(bytes32(tags).length > 0, "No tags to update");
        self.keyStore[key].tags = tags;
        return true;
    }

    function updateTransactionId(StoreGroup storage self, bytes32 key, bytes32 transactionId)
    public returns(bool) 
    {
        require(self.keyStore[key].transactionId == "0x", "TransactionId already updated");
        require(self.keyStore[key].owner == msg.sender, "Only owner can update transactionId");
        self.keyStore[key].transactionId = transactionId;
        return true;
    }
}