import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NorthernTerritoryService {

  constructor() { }

  useStampCalculator(propertyValue: number) {

    if (propertyValue <= 525000) {
      let v = propertyValue/1000;
      return Math.round(((0.06571441*(v**2)) + (15*v))*100)/100
    }

    if (propertyValue <= 2999999) {
        return Math.round((propertyValue * 0.0495)*100)/100
    }

    if (propertyValue <= 4999999) {
        return Math.round((propertyValue * 0.0575)*100)/100
    }

    return Math.round((propertyValue * 0.0595)*100)/100

  }
}
