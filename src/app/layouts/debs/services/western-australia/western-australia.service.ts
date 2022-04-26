import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WesternAustraliaService {

  constructor() {
  }

  getStampDuty(value: number): number {
    if (value > 725000) {
      return 28453 + (value - 725000) / 100 * 5.15
    } else if (value > 360000) {
      return 11115 + (value - 360000) / 100 * 4.75
    } else if (value > 150000) {
      return 3135 + (value - 150000) / 100 * 3.80
    } else if (value > 120000) {
      return 2280 + (value - 120000) / 100 * 2.85
    } else {
      return value / 100 * 1.9
    }

  }
}
