import { TestBed } from '@angular/core/testing';

import { SouthAustraliaService } from './south-australia.service';

describe('SouthAustraliaService', () => {
  let service: SouthAustraliaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SouthAustraliaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('Value less than 0', () => {
    expect(service.useStampCalculator(-2)).toBe(0);
  });

  it('Value less than 12,000', () => {
    expect(service.useStampCalculator(2890)).toBe(29);
  });


  it('value less than 30,000', () => {
    expect(service.useStampCalculator(26514)).toBe(412);
  });

  it('value less than 50000', () => {
    expect(service.useStampCalculator(34333.26)).toBe(612);
  });


  it('value is 50,000', () => {
    expect(service.useStampCalculator(50000)).toBe(1080);
  });


  it('value is between 200K to 250K', () => {
    expect(service.useStampCalculator(208407)).toBe(7191.25);
  });

  it('value more than 500K', () => {
    expect(service.useStampCalculator(4333333)).toBe(232167);
  });


});