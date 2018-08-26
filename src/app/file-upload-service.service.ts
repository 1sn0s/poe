import { Injectable } from '@angular/core';
import { ContractService } from './services/contract-service.service';
import { IpfsService } from './ipfs.service';
import { AppstateServiceService } from './services/appstate-service.service';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class FileUploadServiceService {

  constructor(private ipfsService: IpfsService,
    private contractService: ContractService,
    private appStateService: AppstateServiceService) { }

  async uploadFile(files: FileList): Promise<any> {
    if (files.length === 0) {
      return;
    }
    return new Promise( (resolve, reject) => {
      const file: File = files[0];
      console.log('file', file);
      try {
        const reader: FileReader = new FileReader();
        reader.onload = async (evt) => {
          const uploadDetails = await this.ipfsService.uploadFile(reader.result, file.name);
          const myUploads = await this.appStateService.getUploadedFiles();
          console.log('Filter test', myUploads.filter(x => x.hash === uploadDetails[0].hash));
          if ( myUploads.filter(x => x.hash === uploadDetails[0].hash).length > 0 ) {
            swal('This file was uploaded already');
            reject(null);
          } else {
            const fileTypeId = this.appStateService.getfileTypeId(file.type);
            console.log('file type id', fileTypeId);
            this.contractService.addStorageKey(uploadDetails[0].hash, file.name, file.size, fileTypeId)
            .then( () => {
              resolve(uploadDetails[0].hash);
            }, () => {
              reject('Transaction failed due to some reason');
            });
          }
        };
        reader.onerror = (e) => {
          console.log('reader error', e);
          reject(e);
        };
        reader.readAsArrayBuffer(file);
      } catch (e) {
        reject(e);
      }
    });
  }

  async getFileHash(files: FileList): Promise<any> {
    if (files.length === 0) {
      return;
    }
    return new Promise((resolve, reject) => {
      const file: File = files[0];
      console.log('file', file);
      const reader: FileReader = new FileReader();
      reader.onload = async (evt) => {
        const uploadDetails = await this.ipfsService.getFileHash(reader.result);
        resolve(uploadDetails[0].hash);
      };
      reader.onerror = (e) => {
        console.log('reader error', e);
        reject(e);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  async downloadFile(ipfsHash: string) {
    this.ipfsService.getUploadedFile(ipfsHash)
    .then( (data) => {
      const blob = new Blob([data], {type : 'image/jpeg'});
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }
}
