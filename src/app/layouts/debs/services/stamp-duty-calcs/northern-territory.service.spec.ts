import { TestBed } from '@angular/core/testing';

import { NorthernTerritoryService } from './northern-territory.service';

describe('NorthernTerritoryService', () => {
  let service: NorthernTerritoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NorthernTerritoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('value less than 525000', () => {
    expect(service.useStampCalculator(44000)).toBe(787.22);
  });


  it('value less than 525,000', () => {
    expect(service.useStampCalculator(440000)).toBe(19322.31);
  });

  it('value less than 525,000', () => {
    expect(service.useStampCalculator(500000)).toBe(23928.60);
  });

  it('value less than 2.9M', () => {
    expect(service.useStampCalculator(2000000)).toBe(99000);
  });
});
