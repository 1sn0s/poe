import { Component, OnInit, Input } from '@angular/core';
import { AppstateServiceService } from '../services/appstate-service.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  @Input() activeTabId: Number;

  private tabs: any;

  constructor(private tabStateService: AppstateServiceService) { }

  ngOnInit() {
    this.tabs = this.tabStateService.getTabs();
  }
  
  showTab(event, currentTab) {
    console.log("active tab", this.activeTabId);
    this.tabStateService.tabChange({data : currentTab});
  }
}
