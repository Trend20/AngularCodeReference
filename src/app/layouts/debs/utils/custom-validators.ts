import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import { Amount } from "../../shared/currency/currency.component";

export const validCurrentAddressStay: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const currentAddressYear = control.get('currentAddressYear');
  const currentAddressMonth = control.get('currentAddressMonth');
  if (currentAddressMonth && currentAddressMonth?.value && currentAddressYear && currentAddressYear?.value) {
    let today = new Date()
    const currentAddressStart = new Date(parseInt(currentAddressYear.value), parseInt(currentAddressMonth.value.index) - 1, today.getDate());
    return today.getTime() <= currentAddressStart.getTime() ? {validCurrentAddressStay: today.getTime() <= currentAddressStart.getTime()} : null
  }
  return null
};
export const previousAddressFromNotGreaterThanToday: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const previousAddressYearFrom = control.get('previousAddressYearFrom');
  const previousAddressMonthFrom = control.get('previousAddressMonthFrom');
  if (previousAddressMonthFrom && previousAddressMonthFrom?.value && previousAddressYearFrom && previousAddressMonthFrom?.value) {
    let today = new Date()
    const currentAddressStart = new Date(parseInt(previousAddressYearFrom.value), parseInt(previousAddressMonthFrom.value.index) - 1, today.getDate());
    return today.getTime() <= currentAddressStart.getTime() ? {previousAddressFromNotGreaterThanToday: today.getTime() <= currentAddressStart.getTime()} : null
  }
  return null
};
export const previousAddressToNotGreaterThanToday: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const previousAddressYearTo = control.get('previousAddressYearTo');
  const previousAddressMonthTo = control.get('previousAddressMonthTo');
  if (previousAddressMonthTo && previousAddressMonthTo?.value && previousAddressYearTo && previousAddressMonthTo?.value) {
    let today = new Date()
    const currentAddressStart = new Date(parseInt(previousAddressYearTo.value), parseInt(previousAddressMonthTo.value.index) - 1, today.getDate());
    return today.getTime() <= currentAddressStart.getTime() ? {previousAddressToNotGreaterThanToday: today.getTime() <= currentAddressStart.getTime()} : null
  }
  return null
};

export const previousAddressFromNotGreaterThanPreviousAddressTo: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const previousAddressYearFrom = control.get('previousAddressYearFrom');
  const previousAddressMonthFrom = control.get('previousAddressMonthFrom');
  const previousAddressYearTo = control.get('previousAddressYearTo');
  const previousAddressMonthTo = control.get('previousAddressMonthTo');
  if (previousAddressMonthFrom && previousAddressMonthFrom?.value
    && previousAddressYearFrom && previousAddressMonthFrom?.value
    && previousAddressMonthTo && previousAddressMonthTo?.value
    && previousAddressYearTo && previousAddressMonthTo?.value) {
    let today = new Date()
    const start = new Date(parseInt(previousAddressYearFrom.value), parseInt(previousAddressMonthFrom.value.index) - 1, today.getDate());
    const end = new Date(parseInt(previousAddressYearTo.value), parseInt(previousAddressMonthTo.value.index) - 1, today.getDate());
    return end.getTime() < start.getTime() ? {previousAddressFromNotGreaterThanPreviousAddressTo: end.getTime() < start.getTime()} : null
  }
  return null
};

export const previousEmployerFromNotGreaterThanToday: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const previousEmployerYearFrom = control.get('previousEmployerYearFrom');
  const previousEmployerMonthFrom = control.get('previousEmployerMonthFrom');
  if (previousEmployerMonthFrom && previousEmployerMonthFrom?.value && previousEmployerYearFrom && previousEmployerMonthFrom?.value) {
    let today = new Date()
    const currentAddressStart = new Date(parseInt(previousEmployerYearFrom.value), parseInt(previousEmployerMonthFrom.value.index) - 1, today.getDate());
    return today.getTime() <= currentAddressStart.getTime() ? {previousEmployerFromNotGreaterThanToday: today.getTime() <= currentAddressStart.getTime()} : null
  }
  return null
};
export const previousEmployerToNotGreaterThanToday: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const previousEmployerYearTo = control.get('previousEmployerYearTo');
  const previousEmployerMonthTo = control.get('previousEmployerMonthTo');
  if (previousEmployerMonthTo && previousEmployerMonthTo?.value && previousEmployerYearTo && previousEmployerMonthTo?.value) {
    let today = new Date()
    const currentAddressStart = new Date(parseInt(previousEmployerYearTo.value), parseInt(previousEmployerMonthTo.value.index) - 1, today.getDate());
    return today.getTime() <= currentAddressStart.getTime() ? {previousEmployerToNotGreaterThanToday: today.getTime() <= currentAddressStart.getTime()} : null
  }
  return null
};
export const previousEmployerFromNotGreaterThanPreviousEmployerTo: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const previousEmployerYearTo = control.get('previousEmployerYearTo');
  const previousEmployerMonthTo = control.get('previousEmployerMonthTo');
  const previousEmployerYearFrom = control.get('previousEmployerYearFrom');
  const previousEmployerMonthFrom = control.get('previousEmployerMonthFrom');
  if (previousEmployerMonthTo && previousEmployerMonthTo?.value && previousEmployerYearTo && previousEmployerMonthTo?.value
    && previousEmployerMonthFrom && previousEmployerMonthFrom?.value && previousEmployerYearFrom && previousEmployerMonthFrom?.value) {
    let today = new Date()
    const start = new Date(parseInt(previousEmployerYearFrom.value), parseInt(previousEmployerMonthFrom.value.index) - 1, today.getDate());
    const end = new Date(parseInt(previousEmployerYearTo.value), parseInt(previousEmployerMonthTo.value.index) - 1, today.getDate());
    return end.getTime() < start.getTime() ? {previousEmployerFromNotGreaterThanPreviousEmployerTo: end.getTime() < start.getTime()} : null
  }
  return null
};


export const isNetProfitEmpty: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const employmentType = control.get('employmentType')?.value;
  const netProfit =  (control.get('netProfit')?.value as Amount)

  if (employmentType == "Self-employed") {
    if (netProfit == null || netProfit.amount == null || netProfit.amount == 0 ) {
        return {netProfitError: true}
    }
  }

  return null
};


// // employerABN and employerName
export const employerABNAndEmployerName: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const employerName = control.get('employerName')?.value;
  const employerAbn = control.get('employerAbn')?.value;
  const employmentType = control.get('employmentType')?.value;
  console.log(employerName, employerAbn);
  if(employmentType == "PAYG"){
     employerName.addValidators(Validators.required)
     employerAbn.addValidators(Validators.required)
  }else{
    employerName.clearValidators();
    employerAbn.clearValidators();
  }
  return null
};

