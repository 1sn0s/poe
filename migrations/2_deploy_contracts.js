var POE = artifacts.require("./ProofOfExistence.sol");
var Register = artifacts.require("./Register.sol");

module.exports = function(deployer) {
  // Deploy the contract
  deployer.deploy(POE);
  deployer.then( ()=>{
    return POE.deployed();
  }).then( (poeInstance)=>{
    /* 
    Set the  address of the deployed contract 
    as initial  address in registration contract 
    */
    return deployer.deploy(Register, poeInstance.address);
  });
};
