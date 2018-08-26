import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngFileUploadComponent } from './ang-file-upload.component';

describe('AngFileUploadComponent', () => {
  let component: AngFileUploadComponent;
  let fixture: ComponentFixture<AngFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
