import { Component, OnInit, NgZone } from '@angular/core';
import { ContractService} from '../services/contract-service.service';
import { FileUploadServiceService } from '../file-upload-service.service';
import { AppstateServiceService } from '../services/appstate-service.service';
import { Router } from '../../../node_modules/@angular/router';
import { IpfsService } from '../ipfs.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  myUploads: { name: string, hash: string, tags: string, fileTypeId: Number }[];
  currentAccount: any = 'Empty';
  private imagebaseUrl: string;

  constructor(private fileService: FileUploadServiceService ,
    private contractService: ContractService,
    private appStateService: AppstateServiceService,
    private zone: NgZone,
    private router: Router,
    private ipfsService: IpfsService) {
      this.imagebaseUrl = this.ipfsService.ipfsWebReadAPI;
     }

  async ngOnInit() {
    try {
      setTimeout(async () => {
        this.myUploads = await this.getUploadedFiles();
      }, 1000);
      this.currentAccount = this.contractService.getDefaultAccount();
      this.updateCurrentAccount();
    } catch {
      this.myUploads = [];
    }
  }

  async getUploadedFiles(): Promise<any> {
    return this.appStateService.getUploadedFiles();
  }

  async downloadFile(fileHash: string) {
    await this.fileService.downloadFile(fileHash);
  }

  updateCurrentAccount() {
    this.contractService.accountChangedEvent.subscribe( (account) => {
      console.log('account change captured in dashboard', account);
      if (account === this.currentAccount) return;
      this.zone.run( () => {
        // this.currentAccount = account;
        this.ngOnInit();
      });
    });
  }

  updateMetaData(data) {
    this.contractService.updateStorageKeyDetails(data)
    .then(async () => {
      this.myUploads = await this.getUploadedFiles();
      console.log('myUploads', this.myUploads);
    });
  }

  public splitTags(tags): any {
    return tags.toString().split(' ');
  }

}
