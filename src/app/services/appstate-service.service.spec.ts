import { TestBed, inject } from '@angular/core/testing';

import { AppstateServiceService } from './appstate-service.service';

describe('AppstateServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppstateServiceService]
    });
  });

  it('should be created', inject([AppstateServiceService], (service: AppstateServiceService) => {
    expect(service).toBeTruthy();
  }));
});
