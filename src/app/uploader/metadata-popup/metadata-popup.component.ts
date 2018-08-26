import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModalModule,  NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-metadata-popup',
  templateUrl: './metadata-popup.component.html',
  styleUrls: ['./metadata-popup.component.css']
})
export class MetadataPopupComponent {

  @Input() meta: any;
  @Output() metaEvent = new EventEmitter();

  constructor(private modalService: NgbModal) {}

  open(content) {
    console.log('open modal');
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
    .result.then( (result) => {
      this.metaEvent.emit(result);
    });
  }

}
