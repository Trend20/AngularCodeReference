import { TestBed } from '@angular/core/testing';

import { QueenslandService } from './queensland.service';

describe('QueenslandService', () => {
  let service: QueenslandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueenslandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Value less than 0', () => {
    expect(service.useStampCalculator(-2)).toBe(0);
  });

  it('Value less than 75000', () => {
    expect(service.useStampCalculator(63896)).toBe(883.50);
  });


  it('value less than 540K', () => {
    expect(service.useStampCalculator(499000)).toBe(15890);
  });

  it('value less than 100000', () => {
    expect(service.useStampCalculator(1467564)).toBe(64912);
  });

});