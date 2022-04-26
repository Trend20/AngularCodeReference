import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user';
import { Amount } from '../../shared/currency/currency.component';
import { ServiceAbilityService } from '../services/service-ability.service';


@Component({
  selector: 'app-servicing-page',
  templateUrl: './servicing-page.component.html',
  styleUrls: ['./servicing-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ServicingPageComponent implements OnInit {

  showCalc: boolean = true
  currentUser: User | undefined;
  loanTermYrs: number[] = new Array(30);

  calcInputData !: BehaviorSubject<any>;
  calcOutputData !: BehaviorSubject<any>;

  servicingPageFormGroup!: FormGroup;

  @Input()
  refinanceServicingStatus !: BehaviorSubject<boolean>

  @Input()
  fullServicingStatus !: BehaviorSubject<boolean>

  @Input()
  calcServicingFailureReason !: BehaviorSubject<string>

  private _serviceabilityFormGroup !: FormGroup;
  get serviceabilityFormGroup(): FormGroup {
    return this._serviceabilityFormGroup;
  }

  @Input()
  set serviceabilityFormGroup(value: FormGroup | undefined) {
    if (value) {
      this._serviceabilityFormGroup = value
      this.setUpServicingPageFormGroup(value)
    }
  }


  setUpServicingPageFormGroup(incoming: FormGroup) {

    this.servicingPageFormGroup = this.fb.group({

    })

    this.servicingPageFormGroup?.addControl("totalLoanFromSubAccounts", incoming.controls['totalLoanFromSubAccounts'])

    this.servicingPageFormGroup?.addControl("loanTerm", incoming.controls['loanTerm'])

  }

  @Output()
  private moveToFirst = new EventEmitter();

  myjson: any = JSON;

  calculatorLinks = ['Ezy Express Calculator', 'SMSF Servicing Calculator', 'Standard Servicing Calculator'];

  constructor(private fb: FormBuilder, private authService: AuthService, private serviceAbilityService: ServiceAbilityService) { }

  editDetails() {

    this.moveToFirst.emit(true)
  }

  showCalcToggle() {
    this.showCalc = !this.showCalc
  }

  formatCalculatorOutput(){
     let newObject:any = {};
     const entries = Object.entries(this.calcOutputData);
     entries.forEach((key,i)=>{
      newObject[key[0]]=Math.round((key[1] + Number.EPSILON) * 100) / 100

}); 

this.calcOutputData=newObject
//console.log(newObject)

  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    this.serviceAbilityService.currentCalculatorData.subscribe(res => {
    
      this.calcInputData = res
    })

    this.serviceAbilityService.currentCalculatorResult.subscribe(res => {
      this.calcOutputData = res
    })

    this.formatCalculatorOutput();
  }


  logLoanTerm(subForm: AbstractControl) {
    console.log(subForm)
  }

  isRefinanceOrNot(): boolean {

    let serviceability = this.serviceabilityFormGroup;
    let loanPurpose = serviceability.get('loanPurpose')?.value == 'Refinance'
    let isIncomeContinuous = serviceability.get('isIncomeContinuous')?.value == 'Yes'
    let twoYearLoanRepayment = serviceability.get('twoYearLoanRepayment')?.value == 'Yes'

    if (loanPurpose && isIncomeContinuous && twoYearLoanRepayment) {
      return true
    } else {
      return false
    }

  }

  // send email
  sendEmailToAccountManager() {
    window.open('mailto:xyz@abc.com');
  }


}


