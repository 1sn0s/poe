import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './dashboard/detail/detail.component';
import { AngFileUploadComponent } from './ang-file-upload/ang-file-upload.component';

const routes: Routes = [
  { path: '', redirectTo: '/app', pathMatch: 'full'},
  { path: 'file/:hash', component: DetailComponent },
  { path: 'verify', component: DetailComponent },
  { path: 'app', component: AngFileUploadComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
