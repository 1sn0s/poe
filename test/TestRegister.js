var Register = artifacts.require('./Register.sol');
var ProofOfExistence = artifacts.require('./ProofOfExistence.sol');

/* 
 Tests for the register contract .
 The register contract provides the current address of the
 proof of existence contract
 */
contract('Register', (accounts) => {
    // Owner of the contract
    const ownerAccount = accounts[0];
    // Any account
    const otherAccount = accounts[1];
    const fromOwner = {from: ownerAccount};
    const fromOther = {from: otherAccount};
    let registerContract;
    let initalAddress;
    let currentAddress;

    /* 
     Test that the register contract is deployed properly and the initial 
     proof of existence contract address is recorder
     First deploy the proof of existence contract
     Deploy the register contract with the address of the proof of existence contract,
     from the owner account.
     Make a call to the register contract to get the current contract address
     The returned result should be the address of the proof of existence contract
     */
    it('Should set the initial contract address on deployment when provided', () => {
        return ProofOfExistence.deployed()
        .then( (poeInstance) => {
            initalAddress = poeInstance.address;
            Register.new(initalAddress, fromOwner)
            .then( async (registerInstance) => {
                registerContract = registerInstance;
                assert.equal(await registerInstance.currentContract(), poeInstance.address,
                'Initial contract address not set on deployment');
            })
        });
    })

    /*
     Check if the register contract have no previous address initially
     */
    it('Should not have any previous contract addresses initially', () => {
        return (async () => {
            const previousContracts = await registerContract.previousContracts();
            assert.equal(previousContracts.length, 0,
            'Previous contract addresses present initially');
        })
    })

    /* 
     Test to make sure that the owner can change the current contract address
     Deploy a new proof of existence contract.
     Make call to registry contract to change current address to the new one,
     from the user account.
     Get the current contract address and the first one in the previous
     contract address list to check if it matches
     */
    it('Should let owner to change current active contract address', () => {
        return ProofOfExistence.new()
        .then(async (newPoeInstance) => {
            currentAddress = newPoeInstance.address;
            assert.ok(await registerContract.changeContract(currentAddress, fromOwner),
            'Owner not able to change current contract address');
            return;
        })
        .then(async () => {
            const currentContract = await registerContract.currentContract(fromOwner);
            assert.equal(currentContract, currentAddress,
            'Wrong current address received from the contract');
            const previousContract = await registerContract.previousContracts(0);
            assert.equal(previousContract, initalAddress,
            'Previous contracts history not updated');
        });
    })

    /*
     Test to make sure any account can get the current address of the
     proof of existence contract.
     Make a call to query the current contract address as other account.
     Match it with the current address stored in the previous test.
     */
    it('Should let anyone to get the current address correctly', () => {
        return (async () => {
            const currentContract = await registerContract.currentContract(fromOther);
            assert.equal(currentContract, currentAddress,
            'Wrong current address received from the contract');
        })
    })    

    /*
     Test to make sure that only the owner can changes the current contract address
     Deploy a new proof of existence contract
     Make transaction to register contract, as other account, to change the current 
     contract address to the new proof of existence contract
     The test expects the transaction to throw an error
     */
    it('Should let only the owner to change current active contract address', () => {
        return ProofOfExistence.deployed()
        .then(async (newPoeInstance) => {
            let err = null;
            try {
                await registerContract.changeContract(newPoeInstance.address, fromOther)
            } catch (error) {
                err = error;
            }            
            assert.ok(err instanceof Error, 'Current address changed by account without ownership');
            return;
        })
    })
})