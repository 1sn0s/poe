import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataPopupComponent } from './metadata-popup.component';

describe('MetadataPopupComponent', () => {
  let component: MetadataPopupComponent;
  let fixture: ComponentFixture<MetadataPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadataPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
