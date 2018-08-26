import { Component, OnInit } from '@angular/core';
import { AppstateServiceService } from '../services/appstate-service.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  private tabs: any;

  constructor(private tabStateService: AppstateServiceService) { }

  ngOnInit() {
    this.tabs = this.tabStateService.getTabs();
  }

  showTab(event, currentTab) {
    this.tabStateService.tabChange({data : currentTab});
  }
}
