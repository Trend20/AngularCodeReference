import { TestBed } from '@angular/core/testing';

import { VictoriaService } from './victoria.service';

describe('VictoriaService', () => {
  let service: VictoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VictoriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  // tests for the different property values

  // 25000
  it('should return 350 for 25000', () => {
    expect(Math.ceil(service.getVictoriaStampDuty(25000)) === 350).toBeTruthy();
  });

  // 130000
  it('should return 2870 for 130000', () => {
    expect(Math.ceil(service.getVictoriaStampDuty(130000)) === 2870).toBeTruthy();
  });

  // 960,000
  it('should return 52670 for 960000', () => {
    expect(Math.ceil(service.getVictoriaStampDuty(960000)) === 52670).toBeTruthy();
  });
});
