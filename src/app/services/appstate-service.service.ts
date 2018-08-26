import { Injectable } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';
import { ContractService } from './contract-service.service';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})

// class FileTypes {
//   public static IMAGE = {name: 'image', id: 1};
//   public static VIDEO = {name: 'video', id: 2};
// }

export class AppstateServiceService {
  private _tabs = [
    { 'id' : 1, 'name' : 'Dash', 'icon' : {'name': 'person', 'width': 32 } },
    { 'id' : 2, 'name' : 'Upload', 'icon' : { 'name': 'cloud-upload', 'width': 42} },
  ];
  private _uploadedFiles: any;
  private _tabState = new Subject<object>();
  public tabChangedEvent = this._tabState.asObservable();

  constructor(private contractService: ContractService) {

  }

  public tabChange(data: any) {
    this._tabState.next(data);
  }

  public getTabs(): any {
    return this._tabs;
  }

  public async getUploadedFiles(): Promise<any> {
    return new Promise( async (resolve, reject) => {
      try {
        const filesCount = await this.contractService.getTotalNumberOfKeys();
        const uploadedFiles = [];
        for (let filePosition = 0; filePosition < filesCount; ++ filePosition) {
          const filesInfo = await this.contractService.getStorageKey(filePosition);
          const uploadData = {
            name : filesInfo.hash,
            hash : filesInfo.hash,
            tags : filesInfo.tags,
            fileTypeId: filesInfo.fileTypeId
          };
          uploadedFiles.push(uploadData);
        }
        this._uploadedFiles = uploadedFiles;
        resolve(uploadedFiles);
      } catch (e) {
        swal('Failed to get the latest files');
        resolve(this._uploadedFiles);
      }
    });
  }

  public getfileTypeId(fileTypeName: string): Number {
    if ( fileTypeName.toLowerCase().search('image') !== -1) {
      return 1;
    } else if ( fileTypeName.toLowerCase().search('video') !== -1) {
      return 2;
    }
    return -1;
  }
}
