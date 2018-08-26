import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AngFileUploadComponent } from './ang-file-upload/ang-file-upload.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UploaderComponent } from './uploader/uploader.component';
import { FooterComponent } from './footer/footer.component';
import { UploadAreaComponent } from './uploader/upload-area/upload-area.component';
import { OperationsComponent } from './uploader/operations/operations.component';
import { OcticonsDirective } from './octicons.directive';
import { AppRoutingModule } from './/app-routing.module';
import { DetailComponent } from './dashboard/detail/detail.component';
import { MetadataPopupComponent } from './uploader/metadata-popup/metadata-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UploaderComponent,
    AngFileUploadComponent,
    FooterComponent,
    UploadAreaComponent,
    OperationsComponent,
    OcticonsDirective,
    DetailComponent,
    MetadataPopupComponent
  ],
  imports: [
    HttpModule,
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
