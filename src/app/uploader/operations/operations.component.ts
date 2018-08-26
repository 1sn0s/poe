import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpParams, HttpRequest, HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import { FileUploadServiceService } from '../../file-upload-service.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {

  constructor(private fileUploadService: FileUploadServiceService) { }

  ngOnInit() {
  }

  // At the file input element
  // (change)="selectFile($event)"
  selectFile(event) {
    this.fileUploadService.uploadFile(event.target.files);
  }

}
