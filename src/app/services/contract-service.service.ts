import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
import bs58 from 'bs58';
import * as TruffleContract from 'truffle-contract';
import { Subject } from '../../../node_modules/rxjs';
import swal from 'sweetalert';

declare let require: any;
declare let window: any;
declare const Buffer;
const registerABI = require('../../../build/contracts/Register.json');
const poeABI = require('../../../build/contracts/ProofOfExistence.json');

@Injectable({
  providedIn: 'root'
})

export class ContractService {
  private _web3Provider: any;
  private _contract: any;
  private registerContract = TruffleContract(registerABI);
  private poeContract = TruffleContract(poeABI);
  private _currentAccount = new Subject<object>();
  private _defaultAccount: string;
  public accountChangedEvent = this._currentAccount.asObservable();

  constructor() {
    this.connectToProvider();
   }

  // Add an ipfs hash to contract storage
  public async addStorageKey(ipfsHash, name, size, fileTypeId): Promise<any> {
    const bytes32Hex = this.getBytes32HexFromIpfsHash(ipfsHash);
    return new Promise( (resolve, reject) => {
      try {
        this._contract.addProof.estimateGas(bytes32Hex, fileTypeId)
        .then( async (estimatedGas) => {
          console.log('Estimated gas', estimatedGas);
          this._contract
          .addProof(bytes32Hex, fileTypeId, { gas: estimatedGas + 2300 })
          .then((addStorageKeyResponse) => {
            console.log('here');
            swal({
              text: 'Do you want to keep the transactionId as a reference',
              buttons: {
                cancel: true,
                confirm: true,
              }
            }).then((resp) => {
              if (resp == null) {
                resolve(addStorageKeyResponse.tx);
              } else {
                console.log('approved', resp);
                this._contract
                .updateProofTransactionId(bytes32Hex, addStorageKeyResponse.tx, { gas: estimatedGas + 2300 })
                .then(() => {
                  resolve(addStorageKeyResponse.tx);
                }, () => {
                  resolve('TransactionId update failed, Upload success');
                });
              }
            }, () => {
              resolve('TransactionId update failed, Upload success');
            });
          }, () => {
            reject('Transaction Failed');
          });
          // console.log('add key response', addStorageKeyResponse);
        }, () => {
          swal('Gas estimation failed. Please check your account/network');
          reject('Gas estimation failed');
        } );
      } catch (e) {
        console.log('add key error', e);
        reject(e);
      }
    });
  }

  // Retrive an ipfs hash from the contract storage based on its position
  public async getStorageKey(position: Number): Promise<any> {
    const proofData = await this._contract
     .getUserProofs(position);
   const ipfsHash = this.getIpfsHashFromBytes32Hex(proofData[0]);
   const filesInfo = {
     name : ipfsHash,
     hash : ipfsHash,
     tags : window.web3.utils.toUtf8(proofData[1]),
     fileTypeId : proofData[2]
   };
   return filesInfo;
  }

  public async getStorageKeyDetails(ipfsHash): Promise<any> {
    return new Promise( async (resolve, reject) => {
      const bytes32Hex = this.getBytes32HexFromIpfsHash(ipfsHash);
      try {
        if (this._contract === undefined) {
          reject();
        } else {
          const proofDetails = await this._contract
          .getProofDetails(bytes32Hex);
          const tags = window.web3.utils.toUtf8(proofDetails[0]).split(' ');
          const transactionId = proofDetails[1];
          const fileTypeId = proofDetails[2];
          const createdBlock = proofDetails[3];
          const createdTime = ((await window.web3.eth.getBlock(createdBlock)).timestamp) * 1000;
          const uploadedBy = proofDetails[4];
          const proofInfo = {
            hash : ipfsHash,
            tags: tags,
            transactionId: transactionId,
            fileTypeId: fileTypeId,
            createdBlock: createdBlock,
            createdTime: new Date(createdTime),
            uploadedBy: uploadedBy
          };
          resolve(proofInfo);
        }
      } catch (e) {
        throw e;
      }
    });
  }

  public async updateStorageKeyDetails(filesInfo: any): Promise<any> {
    const bytes32Hex = this.getBytes32HexFromIpfsHash(filesInfo.hash);
    const response = await this._contract
      .updateProofDetails(bytes32Hex, window.web3.utils.asciiToHex(filesInfo.tags), filesInfo.description);
     return response;
    }

  // Get the total number of keys stored for this address
  public async getTotalNumberOfKeys(): Promise<any> {
    return new Promise( async (resolve, reject) => {
      const transactionParams = this.getTransactionInfo();
      try {
        const totalNumberResponse = await this._contract
        .getUserProofsCount();
        resolve(totalNumberResponse);
      } catch (e) {
        console.log('Error getTotalNumberOfKeys', e);
        reject(e);
      }
    });
  }

  public getDefaultAccount(): string {
    return this._defaultAccount;
  }

  /*
   Connect to the web3 provider
   */
  private async connectToProvider(): Promise<void> {
    if (typeof window.web3 !== 'undefined') {
      this._web3Provider = window.web3.currentProvider;
    } else {
      this._web3Provider = new Web3.default.providers.HttpProvider('http://localhost:8545');
    }
    try {
      window.web3 = await new Web3.default(this._web3Provider);
      if (this.checkWeb3()) {
        this.registerContract.setProvider(window.web3.currentProvider);
        this.poeContract.setProvider(window.web3.currentProvider);
        this.registerContract = this.hackTruffleContractForTestrpc(this.registerContract);
        this.poeContract = this.hackTruffleContractForTestrpc(this.poeContract);
        this._contract = await this.connectToContract(null);
        window.web3.currentProvider.publicConfigStore.on('update', (data) => {
          this.listenAccountChange(data, this);
        });
      }
    } catch {
        // alert("Please use a dapp browser or install plugin like metamask");
    }
   }

  private isRinkebyTestNet(web3Instance: any): boolean {
    return web3Instance.version.network !== '4';
  }

  /*
   Connect to the registry contract and get the latest
   proof of existence contract address.
   Then make a connection to the contract at that address
   */
  private async connectToContract(currentAccount): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this._defaultAccount = currentAccount != null ? currentAccount : (await window.web3.eth.getAccounts())[0];
      this.registerContract.defaults ({
        from: this._defaultAccount
      });
      this.poeContract.defaults ({
        from: this._defaultAccount
      });
      this.accountChange(this._defaultAccount);
      const deployed = this.registerContract.deployed();
      deployed.then(async (registerInstance) => {
        const poeContractAddress = await this.getLatestPoeContract(registerInstance);
        console.log('Latest poe contract fetched', poeContractAddress);
        const poeInstance = await this.poeContract.at(poeContractAddress);
        resolve(poeInstance);
      })
      .catch( e => {
        console.log('connectToContract', e);
        swal('Could not deploy/connect to contract');
      });
    });
  }

  private async getLatestPoeContract(registerContract): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const poeContractAddress = await registerContract.currentContract();
      resolve(poeContractAddress);
    });
  }

  private hackTruffleContractForTestrpc(storageContract): void {
    // dirty hack for web3@1.0.0 support for localhost testrpc
    if (typeof storageContract.currentProvider.sendAsync !== 'function') {
      storageContract.currentProvider.sendAsync = function() {
        return storageContract.currentProvider.send.apply(
          storageContract.currentProvider, arguments
        );
      };
    }
    return storageContract;
  }

   private checkWeb3(): Boolean {
    if (window.web3) {
      return true;
    } else {
      swal('Please use a dapp browser or install plugin like metamask');
      return false;
    }
   }

   private getBytes32HexFromIpfsHash(ipfsKey): ByteString {
    return  '0x' + bs58.decode(ipfsKey).slice(2).toString('hex');
   }

   private getIpfsHashFromBytes32Hex(hexString): string {
     const hashHex = '1220' + hexString.slice(2);
     const bytesString = Buffer.from(hashHex, 'Hex');
     const hash = bs58.encode(bytesString);
     return hash;
   }

   private getTransactionInfo(): any {
    return {
      from : this._defaultAccount
    };
   }

  private listenAccountChange(data, thisInstance): void {
    if (data.selectedAddress === this._currentAccount) {
      return;
    }
    const currentAccount = data.selectedAddress;
    thisInstance.connectToContract(currentAccount)
    .then((contractInstance) => {
      thisInstance._contract = contractInstance;
    });
  }

  public accountChange(data: any) {
    console.log('account changed', data);
    this._currentAccount.next(data);
  }
}
