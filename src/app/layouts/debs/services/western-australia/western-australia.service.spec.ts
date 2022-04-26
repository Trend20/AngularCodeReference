import { TestBed } from '@angular/core/testing';

import { WesternAustraliaService } from './western-australia.service';

describe('WesternAustraliaService', () => {
  let service: WesternAustraliaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WesternAustraliaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



  // tests for the different property values

  // 120000
  it('should return 2280 for 120000', () => {
    expect(Math.ceil(service.getStampDuty(120000)) === 2280).toBeTruthy();
  });

  // 150000
  it('should return 3135 for 150000', () => {
    expect(Math.ceil(service.getStampDuty(150000)) === 3135).toBeTruthy();
  });

  // 360,000
  it('should return 11115 for 360000', () => {
    expect(Math.ceil(service.getStampDuty(360000)) === 11115).toBeTruthy();
  });


  // 725000
  it('should return 28453 for 725000', () => {
    expect(Math.ceil(service.getStampDuty(725000)) === 28453).toBeTruthy();
  });
});
