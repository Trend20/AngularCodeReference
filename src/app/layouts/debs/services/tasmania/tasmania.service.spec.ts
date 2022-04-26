import { TestBed } from '@angular/core/testing';

import { TasmaniaService } from './tasmania.service';

describe('TasmaniaService', () => {
  let service: TasmaniaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasmaniaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // tests for the different property values

  // 3000
  it('should return 50 for 3000', () => {
    expect(Math.ceil(service.getTasmaniaStampDuty(3000)) === 50).toBeTruthy();
  });

  // 25000
  it('should return 435 for 25000', () => {
    expect(Math.ceil(service.getTasmaniaStampDuty(25000)) === 435).toBeTruthy();
  });

  // 75000
  it('should return 1560 for 75000', () => {
    expect(Math.ceil(service.getTasmaniaStampDuty(75000)) === 1560).toBeTruthy();
  });


  // 200000
  it('should return 5935 for 200000', () => {
    expect(Math.ceil(service.getTasmaniaStampDuty(200000)) === 5935).toBeTruthy();
  });

  // 375000
  it('should return 12935 for 375000', () => {
    expect(Math.ceil(service.getTasmaniaStampDuty(375000)) === 12935).toBeTruthy();
  });

  // 750000
  it('should return 28935 for 750000', () => {
    expect(Math.ceil(service.getTasmaniaStampDuty(750000)) === 28935).toBeTruthy();
  });
});
