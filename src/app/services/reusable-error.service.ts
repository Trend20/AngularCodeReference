import { Injectable, Optional } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root',
})
export class ReusableErrorService {
  constructor(@Optional() public matDialog: MatDialog) {}

  openValidationModal(formGroup: FormGroup) {
    if (!formGroup.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Complete all the fields marked in RED before proceeding!',
        timer: 2000
      })
    }
  }

  /**
   * Loop through all the form group elements
   * While looking for errors
   * We stop at the first found error for efficiency purposes
   */
  showFormControlErrors(form: FormGroup | FormArray): any {

    let newArray = []
    for (const control of Object.keys(form.controls)) {
      let controlType = form.get(control);

      /**
       * If value is a control
       * proceed with instant check
       */
      if (controlType instanceof FormControl) {
        const controlErrors: ValidationErrors | null = controlType.errors;

        if (controlErrors !== null) {
          // console.log(this.showErroMessage(control, controlErrors));
          newArray.push(this.populateErrorMessage(control, controlErrors))
        } else {
          continue;
        }
      } else if (
        controlType instanceof FormGroup ||
        controlType instanceof FormArray
      ) {
        /**
         * If value is a form Group or a form Array
         * Call the function recursively
         * check if returned is not null
         */

        let check = this.showFormControlErrors(controlType);

        if (check === null) {
          continue;
        } else {
          newArray.push(check)
        }
      } else {
        /**
         * Can be removed
         */
        continue;
      }
    }
    return newArray;
  }
  /**
   * Add all the errors to  new object/Array
   */
  populateErrorMessage(control: string, error: any) {
    control = control.replace(/([A-Z])/g, ' $1');
    const finalControlText = control.charAt(0).toUpperCase() + control.slice(1);
    if (error.message) {
      return error.message;
    } else if (error.errorMessage) {
      return error.errorMessage;
    } else if (error.required) {
      return `Please fill in the:  ${finalControlText} field`;
    } else if (error.min) {
      return `Field ${finalControlText} has a required minimum value of ${error.min.min}`;
    }else if (error.max) {
      return `Field ${finalControlText} has a required maximum value of ${error.max.max}`;
    }

  }
}
