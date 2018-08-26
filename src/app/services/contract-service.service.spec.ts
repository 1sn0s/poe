import { TestBed, inject } from '@angular/core/testing';

import { ContractService } from './contract-service.service';

describe('ContractServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContractService]
    });
  });

  it('should be created', inject([ContractService], (service: ContractService) => {
    expect(service).toBeTruthy();
  }));

  it('should add storageKeys to contract', inject([ContractService], (service: ContractService) => {
    expect<any>(service.addStorageKey('0xaaaaaaaaaaaaaaaaaaaaaaa'))
    .toEqual(service.getStorageKey(0));
  }));

  it('should get stored keys from the contract', inject([ContractService], (service: ContractService) => {
    expect<any>(service.getStorageKey(0))
    .toEqual('0xaaaaaaaaaaaaaaaaaaaaaaa');
  }));

  it('should return total number of keys stored', inject([ContractService], (service: ContractService) => {
    expect<any>(service.getTotalNumberOfKeys()).toEqual(0);
  }));
});
