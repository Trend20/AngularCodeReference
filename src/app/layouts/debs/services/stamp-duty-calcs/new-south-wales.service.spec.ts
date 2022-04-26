// Test
import { TestBed } from '@angular/core/testing';

import { NewSouthWalesService } from './new-south-wales.service';

describe('NewSouthWalesService', () => {
  let service: NewSouthWalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewSouthWalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('ten', () => {
    expect(service.useStampCalculator(10)).toBe(10);
  });

  it('more than 7k', () => {
    expect(service.useStampCalculator(7500)).toBe(93.75);
  });

  it('more than 25k', () => {
    expect(service.useStampCalculator(28889)).toBe(398.5);
  });

  it('more than 0.1m', () => {
    expect(service.useStampCalculator(100001)).toBe(1900.5);
  });

  it('more than 0.5m', () => {
    expect(service.useStampCalculator(500001)).toBe(17711.5);
  });

  it('more than 1m', () => {
    expect(service.useStampCalculator(1000005)).toBe(40211.5);
  });

  it('more than 2m', () => {
    expect(service.useStampCalculator(2000005)).toBe(94572.5);
  });

  it('more than 3m', () => {
    expect(service.useStampCalculator(10000005)).toBe(534572.5);
  });

  it('zero', () => {
    expect(service.useStampCalculator(0)).toBe(0);
  });
});
