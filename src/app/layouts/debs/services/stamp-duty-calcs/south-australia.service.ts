import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SouthAustraliaService {
  /**
   * Declare any vars here
   * This var holds the different steps and the values of
   * step minimum property value (exclusive), stamp duty cost for 100 parts, fixed stamp duty cost
   * In that order
   * It also holds the base part divider
   */
  private propertyValueSteps: any = {
    base: 100,
    0: [0, 1, 0],
    1: [12000, 2, 120],
    2: [30000, 3, 480],
    3: [50000, 3.5, 1080],
    4: [100000, 4, 2830],
    5: [200000, 4.25, 6830],
    6: [250000, 4.75, 8955],
    7: [300000, 5, 11330],
    8: [500000, 5.5, 21330],
  };

  /**
   * TODO: Add dependencies as
   * attributes in the consturcto
   */
  constructor() {}


  /**
   * 
   * @param propertyValue 
   * @param stepNumber 
   * @returns number
   * 
   * use the step property values to calculate the stamp duty
   */
  calculateAmount(propertyValue: number, stepNumber: number): number {
    let currentStep: any = this.propertyValueSteps[stepNumber];

    let extraPropertyValue: number = propertyValue - currentStep[0];

    let numberOfPartsOf100: number = Math.ceil(extraPropertyValue / this.propertyValueSteps['base']);

    let calculatedExtraStampCost: number = numberOfPartsOf100 * currentStep[1];
    let totalStampCost: number = calculatedExtraStampCost + currentStep[2];
    return totalStampCost;
  }


  /**
   * 
   * @param propertyValue 
   * @returns number
   * 
   * step decider to help pass the correct variables to the calculate function
   */
  useStampCalculator(propertyValue: number): number {
    let step = this.propertyValueSteps;
    switch (true) {
      case propertyValue <= step[0][0]:
        return 0;

      case propertyValue <= step[1][0]:
        return this.calculateAmount(propertyValue, 0);

      case propertyValue <= step[2][0]:
        return this.calculateAmount(propertyValue, 1);

      case propertyValue <= step[3][0]:
        return this.calculateAmount(propertyValue, 2);

      case propertyValue <= step[4][0]:
        return this.calculateAmount(propertyValue, 3);

      case propertyValue <= step[5][0]:
        return this.calculateAmount(propertyValue, 4);

      case propertyValue <= step[6][0]:
        return this.calculateAmount(propertyValue, 5);

      case propertyValue <= step[7][0]:
        return this.calculateAmount(propertyValue, 6);

      case propertyValue <= step[8][0]:
        return this.calculateAmount(propertyValue, 7);

      default:
        return this.calculateAmount(propertyValue, 8);
    }
  }
}