import { Component, NgZone, OnInit } from '@angular/core';
import { AppstateServiceService } from '../services/appstate-service.service';

@Component({
  selector: 'app-ang-file-upload',
  templateUrl: './ang-file-upload.component.html',
  styleUrls: ['./ang-file-upload.component.css']
})

export class AngFileUploadComponent implements OnInit {
  currentTab: any;
  constructor(
    private _appStateService: AppstateServiceService,
    private zone: NgZone) {
  }

  ngOnInit()  {
    this._appStateService.tabChangedEvent.subscribe((_currentTab: any) => {
      this.zone.run(() => {
        this.currentTab = _currentTab.data;
      });
    });
    this.currentTab = this._appStateService.getTabs()[1];
  }

}
