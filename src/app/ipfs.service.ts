import { Injectable } from '@angular/core';
import * as IPFS from 'ipfs';
// import IPFSFactory from 'ipfsd-ctl';
import { Buffer } from 'buffer/';
import { Observable } from '../../node_modules/rxjs';
import { ContractService } from './services/contract-service.service';

@Injectable({
  providedIn: 'root'
})
export class IpfsService {
  ipfs;
  contractService;
  uploadedCid: string;
  public ipfsWebReadAPI = 'https://ipfs.infura.io/api/v0/cat';

  // port = 9090;
  // server = IPFSFactory.createServer(this.port);
  // f = IPFSFactory.create({ remote: true, port: this.port });

  fileChanged = Observable.create((observer) => {
    observer.next(this.uploadedCid);
  });

  constructor(contractService: ContractService) {
    this.contractService = contractService;
    this.ipfs = new IPFS({host: 'ipfs.infura.io', port: '5001', protocol: 'https'});
   }

  // serverStart() {
  //   this.server.start((err) => {
  //     if (err) { throw err }
  //     this.f.spawn((err, ipfsd) => {
  //       if (err) { throw err }
  //       ipfsd.api.id(function (err, id) {
  //         if (err) { throw err }
  //         console.log(id);
  //         this.ipfs = new IPFS({host: 'ipfs.infura.io', port: '5001', protocol: 'https'});
  //         ipfsd.stop(this.server.stop);
  //       });
  //     });
  //   });
  // }

  async getUploadedFile(ipfsHash: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ipfs.files.get(ipfsHash, (error, files) => {
        if (error) {
          throw error;
        }
        files.forEach(file => {
          resolve(file.content);
        });
      });
    });
  }

  async uploadFile(file, fileName): Promise<any> {
    const fileBuf = Buffer.from(file);
    return new Promise((resolve, reject) => {
      this.ipfs.files.add([{
        path: '/' + fileName,
        content: fileBuf,
      }],
      { progress: this.progress },
      (error, files) => {
        if (error) {
          throw error;
        }
        this.setUploadedFileCid(files[0].path);
        resolve(files);
      });
    });
  }

  progress(data) {
  }

  async getFileHash(file): Promise<any> {
    const fileBuf = Buffer.from(file);
    return new Promise((resolve, reject) => {
      this.ipfs.files.add([{
        path: file.name,
        content: fileBuf,
      }], {'onlyHash': true},
      (error, files) => {
        if (error) {
          throw error;
        }
        resolve(files);
      });
    });
  }

  async getFileStats(hash): Promise<any> {
    const fileBuf = Buffer.from(hash);
    return new Promise((resolve, reject) => {
      this.ipfs.object.stat(
        hash,
      (error, stats) => {
        console.log('file stats error', error);
        if (error) {
          throw error;
        }
        console.log('filestat result', stats);
        resolve(stats);
      });
    });
  }

  getUploadedFileCid() : string {
    return this.uploadedCid;
  }

  setUploadedFileCid(cid) : void{
    //this.contractService.get
    this.uploadedCid = cid;
  }
}
