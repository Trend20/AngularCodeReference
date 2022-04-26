import { TestBed } from '@angular/core/testing';

import { AustralianCapitalTerrService } from './australian-capital-terr.service';

describe('AustralianCapitalTerrService', () => {
  let service: AustralianCapitalTerrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AustralianCapitalTerrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it ('value less than 0', () => {
    expect(service.useStampCalculator(-72)).toBe(0);
  })

  it ('value less than 600000', () => {
    expect(service.useStampCalculator(433456.2)).toBe(3907.26);
  })

  it ('value less than 2000000', () => {
    expect(service.useStampCalculator(1987654)).toBe(15344.18);
  })

  it ('value less than 3650000', () => {
    expect(service.useStampCalculator(3187555)).toBe(25812.47);
  })

  it ('value less than 4850000', () => {
    expect(service.useStampCalculator(4000009)).toBe(33106.88);
  })

  
  it ('huge value', () => {
    expect(service.useStampCalculator(17878901)).toBe(168470.99);
  })


});