import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormControlOpsService {
  constructor() {}

  /**
   *
   * @param formGroup
   */
  addOptionalValidators(formGroup: FormGroup | FormArray): FormGroup | FormArray | any {
    Object.keys(formGroup.controls).forEach((key: string) => {
      const control: AbstractControl = formGroup.get(key) as
        | FormControl
        | FormGroup
        | FormArray;
      if (control instanceof FormControl) {
      
        let validators =
          this.personalDetailsValidationRequiredControlChecker(key);
        if (validators !== null ) {
          control.setValidators(validators);
          control.updateValueAndValidity();
        }
       
      } else if (control instanceof FormGroup || control instanceof FormArray) {       
        this.addOptionalValidators(control);
      } else {
      }
    });
    return formGroup
  }

  /**
   * Private function to check which controllers should get validators
   */
  personalDetailsValidationRequiredControlChecker(key: string): any {
    switch (key) {
      case 'propertyTrusteeAddress':
        return [Validators.required];
      case 'smsfTrusteeName':
        return [Validators.required];
      case 'smsfTrusteeAddress':
        return [Validators.required];
      case 'firstName':
        return [Validators.required];
      case 'dataEntryOption':
        return [Validators.required];
      case 'lastName':
        return [Validators.required];
      case 'dateOfBirth':
        return [Validators.required];
      case 'mobilePhoneNumber':
        return [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ];
      case 'emailAddress':
        return [Validators.required, Validators.email];
      case 'address':
        return [Validators.required];
      case 'title':
        return [Validators.required];
      case 'smsfName':
        return [Validators.required];
      case 'propertyTrustName':
        return [Validators.required];

      case 'propertyTrusteeName':
        return [Validators.required];

      default:
        return null;
    }
  }
}
