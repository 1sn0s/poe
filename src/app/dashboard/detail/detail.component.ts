import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../services/contract-service.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { FileUploadServiceService } from '../../file-upload-service.service';
import { IpfsService } from '../../ipfs.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  fileDetails = {
    hash : '',
    tags: [],
    transactionId: '',
    createdTime: 0,
    createdBlock: 0,
    uploadedBy: '',
    size: '',
    fileTypeId: 0
  };

  verifyDetails = {
    hash : '',
    tags: [],
    transactionId: '',
    createdTime: 0,
    createdBlock: 0,
    uploadedBy: '',
    size: '',
    fileTypeId: 0
  };

  private imagebaseUrl: string;

  constructor(private route: ActivatedRoute,
    private location: Location,
    private contractService: ContractService,
    private fileUploadService: FileUploadServiceService,
    private ipfsService: IpfsService) {
      this.imagebaseUrl = this.ipfsService.ipfsWebReadAPI;
    }

  async ngOnInit() {
    const hash = this.route.snapshot.paramMap.get('hash');
    if (hash) {
      this.fileDetails.hash = hash;
      try {
        this.fileDetails = await this.getUploadedFile(hash);
      } catch {
        setTimeout( async () => {
          this.fileDetails = await this.getUploadedFile(hash);
        }, 5000);
      }
    }

  }

  async selectFile(event) {
    this.fileUploadService.getFileHash(event.target.files)
      .then( async (fileHash) => {
        console.log('thisFileHash', fileHash);
        this.verifyDetails.hash = fileHash;
        this.verifyDetails = await this.getUploadedFile(fileHash);
      });
  }

  public async getUploadedFile(fileHash: string): Promise<any> {
    return new Promise( async (resolve, reject) => {
      try {
        const fileInfo = await this.contractService.getStorageKeyDetails(fileHash);
        const fileStats = await this.ipfsService.getFileStats(fileHash);
        fileInfo.size = fileStats.DataSize;
        fileInfo.hash = fileStats.Hash;
        console.log('stats', fileInfo);
        resolve(fileInfo);
      } catch (e) {
        reject(e);
      }
    });
  }

  public goBack($event) {
    this.location.back();
  }

  public async verifyHash($event, hash) {
    if (hash) {
      this.verifyDetails.hash = hash;
      this.verifyDetails = await this.getUploadedFile(hash);
    }
  }

}
