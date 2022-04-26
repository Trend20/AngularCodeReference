import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QueenslandService {
  constructor() {}

  /**
   * propertyStepValue object to hold the constant values defining the bounds and rates for classes
   */
  private propertyStepValue: any = {
    BASE: 100, //
    0: [0, 0, 0],
    1: [5000, 1.5, 0],
    2: [75000, 3.5, 1050],
    3: [540000, 4.5, 17325],
    4: [1000000, 5.75, 38025],
  };

 /**
  * 
  * @param property_value 
  * @param stepNumber helps to get the fetched prop values from the object
  * @returns calcculated stamp duty
  */

  calcDuty(property_value: number, stepNumber: number): number {
    let propertyStepValue = this.propertyStepValue[stepNumber];
    let propertyExtraValue = property_value - propertyStepValue[0];
    let partsOfBase = Math.ceil(propertyExtraValue / 100);
    let calculatedDuty = partsOfBase * propertyStepValue[1];
    return propertyStepValue[2] + calculatedDuty;
  }

  /**
   * decide what values to pass to the calculating function
   * @param property_value value of the property
   * @returns duty due for the value of the property
   */
  useStampCalculator(property_value: number): number {
    switch (true) {
      case property_value < this.propertyStepValue[0][0]:
        return 0;
      case property_value <= this.propertyStepValue[1][0]:
        return this.calcDuty(property_value, 0);
      case property_value <= this.propertyStepValue[2][0]:
        return this.calcDuty(property_value, 1);
      case property_value <= this.propertyStepValue[3][0]:
        return this.calcDuty(property_value, 2);
      case property_value <= this.propertyStepValue[4][0]:
        return this.calcDuty(property_value, 3);
      default:
        return this.calcDuty(property_value, 4);
    }
  }
}