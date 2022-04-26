//  Service
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NewSouthWalesService {
  constructor() {}

  private steps: any = {
    BASE: [10, 100],
    step1: [0, 14000, 0, 1.25],
    step2: [175, 32000, 14000, 1.5],
    step3: [445, 85000, 32000, 1.75],
    step4: [1372, 319000, 85000, 3.5],
    step5: [9562, 1064000, 319000, 4.5],
    step6: [43087, 0, 1064000, 5.5],
  };

  /**
   *
   * @param fixed
   * @param property_value
   * @param lower_bound
   * @param base
   * @param multiplier
   * @returns
   */

  calc_ts_duty(property_value: number, step: number[]): number {
    return (
      step[0] +
      Math.ceil((property_value - step[2]) / this.steps.BASE[1]) * step[3]
    );
  }

  /**
   *
   * @param property_value
   * @returns
   */
   useStampCalculator(property_value: number): number {
    switch (true) {
      case property_value < this.steps.step1[2]:
        console.log('Enter a numeric value greater than $0, for ex: 15000');
        return 0;
      case property_value > this.steps.step1[2] &&
        property_value <= this.steps.step1[1]:
        if (
          this.calc_ts_duty(property_value, this.steps.step1) <=
          this.steps.BASE[0]
        ) {
          return 10;
        } else {
          return this.calc_ts_duty(property_value, this.steps.step1);
        }
      case property_value > this.steps.step2[2] &&
        property_value <= this.steps.step2[1]:
        return this.calc_ts_duty(property_value, this.steps.step2);
      case property_value > this.steps.step3[2] &&
        property_value <= this.steps.step3[1]:
        return this.calc_ts_duty(property_value, this.steps.step3);
      case property_value > this.steps.step4[2] &&
        property_value <= this.steps.step4[1]:
        return this.calc_ts_duty(property_value, this.steps.step4);
      case property_value > this.steps.step5[2] &&
        property_value <= this.steps.step5[1]:
        return this.calc_ts_duty(property_value, this.steps.step5);
      case property_value > this.steps.step6[2]:
        return this.calc_ts_duty(property_value, this.steps.step6);
      default:
        return 0;
    }
  }
}
