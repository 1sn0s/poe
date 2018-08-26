import { Component, OnInit} from '@angular/core';
import { FileUploadServiceService } from '../../file-upload-service.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-upload-area',
  templateUrl: './upload-area.component.html',
  styleUrls: ['./upload-area.component.css'],
})
export class UploadAreaComponent implements OnInit {

  uploadFilesList = [];
  metaData = {
    hash: '',
    tags: ''
  };
  uploading = false;

  constructor(private fileUploadService: FileUploadServiceService) { }

  ngOnInit() {
  }

  async onDropFile(event: DragEvent) {
    event.preventDefault();
    this.upload(event.dataTransfer.files);
  }

  onDragOverFile(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  selectFile(event) {
    this.upload(event.target.files);
  }

  async upload(files) {
    try {
      this.uploading = true;
      this.fileUploadService.uploadFile(files)
      .then( (fileHash) => {
        if (fileHash) {
          this.uploading = false;
          swal('File uploaded. Please go to dashboard to view your uploaded files');
        }
      }, (rejectedReason) => {
        console.log('rejected');
        this.uploading = false;
      });
    } catch (e) {
      this.uploading = false;
      swal('Failed to upload data');
    }
  }

}
