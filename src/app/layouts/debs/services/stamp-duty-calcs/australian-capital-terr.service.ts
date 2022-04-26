import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AustralianCapitalTerrService {
  private propertyStepValue: any = {
    fireAndAmergencyServicesLevy: 350,
    saferFamiliesLevy: 35,
    fixed: 850,
    0: [0, 0.6165, 0],
    1: [600000, 0.7502, 3699],
    2: [2000000, 0.8737, 14201.8],
    3: [3650000, 0.9297, 28617.85],
    4: [4850000, 0.9783, 39774.25],
  };

  constructor() {}

  calcDuty(propertyValue: number, stepNumber: number) {
    let currentStep: number[] = this.propertyStepValue[stepNumber];

    let fixedValue: number = this.propertyStepValue['fixed'];
    let overPropertyValueBound: number = propertyValue - currentStep[0];
    let dutyOnOverPropValue: number =
      (overPropertyValueBound * currentStep[1]) / 100;
    let valuatedValue: number = dutyOnOverPropValue + currentStep[2];
    let levies: number =
      this.propertyStepValue['fireAndAmergencyServicesLevy'] +
      this.propertyStepValue['saferFamiliesLevy'];
    return Math.round((fixedValue + valuatedValue + levies + Number.EPSILON) * 100) / 100;
  }

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