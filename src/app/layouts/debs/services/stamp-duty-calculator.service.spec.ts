import { TestBed } from '@angular/core/testing';

import { StampDutyCalculatorService } from './stamp-duty-calculator.service';

describe('StateCodeStampDutyService', () => {
  let service: StampDutyCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StampDutyCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
