import { Component, ElementRef, EventEmitter, OnInit,Output,QueryList,ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import {BrokerDeclarationService} from "../services/broker-declaration.service";
import {LoanApplication} from "../models/loan-application.model";
import {ServiceAbilityService} from "../services/service-ability.service";
import {BROKER_DECLARATION} from "../../../../environments/environment";
import { User } from 'src/app/auth/user';
import { AuthService } from 'src/app/auth/auth.service';
import signatureFontsJson from '../../../../assets/configs/signature-fonts.json';
import { BrokerDeclarationPage } from '../models/declaration-model-revised';
import { Router } from '@angular/router';
import { LoanDetailService, LoanPage } from '../services/loan-detail.service';



@Component({
  selector: 'app-broker-declaration',
  templateUrl: './broker-declaration.component.html',
  styleUrls: ['./broker-declaration.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class BrokerDeclarationComponent implements OnInit {
  // currentLoanApplication: LoanApplication | undefined;
  currentLoanApplicationId: string | undefined;
  currentBrokerDeclarationPage: BrokerDeclarationPage | undefined;

  currentUser: User | undefined;

  maxDate!: Date;
  showCard:Boolean = false;

  signatureImg!: string;

  @Output()
  private moveToClientDeclaration = new EventEmitter();

  @Output()
  private removeClientDeclarationFromFlow = new EventEmitter();

  @ViewChildren('dateOfSignature') dateOfSignature !: QueryList<ElementRef>
  @ViewChildren('bankruptcyDischargeDate') bankruptcyDischargeDate !: QueryList<ElementRef>
  @ViewChildren('firstDateOfChange') firstDateOfChange !: QueryList<ElementRef>
  @ViewChildren('secondDateOfChange') secondDateOfChange !: QueryList<ElementRef>

  signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 400,
    'canvasHeight': 80
  };

  today = new Date();
  myTimestamp = new Date().getTime() + (60 * 24 * 60 * 60 * 1000)
  maxDecDate = new Date(this.myTimestamp);

  fonts: any = signatureFontsJson;
  signatureFontFamilyKey: string = this.fonts[0].key;

  showSignatureArea: boolean = false
  clientDateStr: string = ''
  dischargeDateStr: string = ''
  firstDateOfChangeStr: string = ''
  secondDateOfChangeStr: string = ''

  displaySignatureArea() {
    this.showSignatureArea = true
  }

  toggleShowCard(){
    this.showCard = !this.showCard;
    this.removeClientDeclarationFromFlow.next(!this.showCard)
  }


  changeSignatureFont(event: any) {
    this.signatureFontFamilyKey = event.value
  }


  declarationQuestions: any[] =[
    {
      content: 'Had any unsatisfied judgement entered in any courts or had a property foreclosed upon or given title or deed in lieu thereof?',
      formControlNameValue: 'clientJudgement'
    },
    {
      content: 'Ever had legal action instituted against you for default under any credit contract?',
      formControlNameValue: 'defaultLegalAction'
    },
    {
      content: 'Ever been declared bankrupt or insolvent, or has either estate been assigned for the benefit of creditors?',
      formControlNameValue: 'creditorBenefit'
    },
    {
      content: 'If yes, what was your bankruptcy discharge date if any?',
      formControlNameValue: 'dischargeDate'
    },
    {
      content: 'Ever been shareholders or officers of any company of which a manager or receiver and/or liquidator has been appointed?',
      formControlNameValue: 'liquidatorAppointment'
    },
    {
      content: 'Obtained from borrowings any part of the deposit or the balance required to complete this transaction? If so provide details below.',
      formControlNameValue: 'transactionBalance',
      formControlNameDetails: 'transactionBalanceDetails'
    },
    {
      content: 'Submitted any application in respect of this loan to any other person or to any other lender? If so provide details below including the decision.',
      formControlNameValue: 'lenderApplication',
      formControlNameDetails: 'lenderApplicationDetails'
    },
    {
      content: 'Guaranteed a loan?',
      formControlNameValue: 'loanGuarantee'
    },
    {
      content: 'Do you expect any significant change to your financial situation over the forseable future that would ADVERSELY impact your ability to meet loan repayments or reduce your income as stated in this application?',
      formControlNameValue: 'expectSignificantChange',
      formControlNameDetails: 'expectSignificantChangeDetails'
    },
    {
      content: ' Has any of the applicant (ie guarantors) ever been known by any other name?',
      formControlNameValue: 'applicantFormerName'
    }
  ]

  submissionDeclarations: any[] = [
    {value: 'The information entered is true and correct.'},
    {value: 'All information I have or will provide in connection with the above loan is so far as I am aware correct and not misleading.'},
    {value: 'I have made preliminary assessment that the proposed loan is not unsuitable and is appropriate.'},
    {value: 'That assessment is valid for 90 days from the date below.'},
    {value: 'I have sighted and validated all the original documents and all copies of documents throughout the loan process associated with this loan application forwarded to Mortgage Ezy.'},
    {value: 'I have provided all parties all documents required under the National Consumer Credit Protection Act 2009.'},
    {value: 'I hereby indemnify Mezy Assets Pty Ltd and its founders in respect of any loss claim or expense (including civil and criminal penalties).'},
  ]

  brokerDeclarationFormGroup !: FormGroup;
  electronicDeliveryList = ['Applicants', 'Solicitor', 'Broker'];
  documentsPostList = ['My current address', 'My Solicitor'];

  constructor(private formBuilder: FormBuilder,
    private brokerDeclarationService: BrokerDeclarationService,
    private serviceAbilityService: ServiceAbilityService,
    private authService: AuthService,
    private router: Router,
    private loanDetailService: LoanDetailService) {
    this.maxDate = new Date();
   }


  ngOnInit(): void {

    this.currentUser = this.authService.getCurrentUser();

    this.brokerDeclarationFormGroup = this.formBuilder.group({
      pageName: BROKER_DECLARATION,
      firstDateOfChange: [''],
      secondDateOfChange: [''],
      accreditationNumber: ['', Validators.required],
      creditRepresentativeName: ['', Validators.required],
      licenceNumber: ['', Validators.required],
      licenceHolderNumber: ['', Validators.required],
      aclNumber: ['', Validators.required],
      contactPhoneNumber: ['', Validators.required],
      dateOfSignature: ['', Validators.required],
      formerNameReason: [''],
      applicantFormerName: ['', Validators.required],
      electronicDelivery: ['', Validators.required],
      expectSignificantChange: ['', Validators.required],
      clientJudgement: ['', Validators.required],
      defaultLegalAction: ['', Validators.required],
      creditorBenefit: ['', Validators.required],
      dischargeDate: ['', Validators.required],
      liquidatorAppointment: ['', Validators.required],
      transactionBalance: ['', Validators.required],
      lenderApplication: ['', Validators.required],
      loanGuarantee: ['', Validators.required],
      bankruptcyDischargeDate:[null],
      lenderApplicationDetails:[''],
      transactionBalanceDetails:[''],
      expectSignificantChangeDetails:[''],
      firstCheckboxDeclaration:['', Validators.requiredTrue],
      lastCheckBoxDeclaration:['', Validators.requiredTrue],
      preferredSignatureFont: ['']
    });

    this.brokerDeclarationFormGroup.get('applicantFormerName')?.valueChanges.subscribe(newValue => {
      this.updateFormControlOnBrokerDeclarationReportChange(newValue);
    });

    // this.isFormFieldRequired

    this.brokerDeclarationFormGroup.get('dischargeDate')?.valueChanges.subscribe(newValue => {
      this.updateDischargeValidators(newValue);
    });

    this.brokerDeclarationFormGroup.get('lenderApplication')?.valueChanges.subscribe(newValue => {
      this.updateLenderDetailsValidators(newValue);
    });

    this.brokerDeclarationFormGroup.get('expectSignificantChange')?.valueChanges.subscribe(newValue => {
      this.updateExpectSignificantChangeValidators(newValue);
    });

    this.brokerDeclarationFormGroup.get('transactionBalance')?.valueChanges.subscribe(newValue => {
      this.updateTransactionBalanceDetailsValidators(newValue);
    });


    // this.serviceAbilityService.currentLoanApplication.subscribe(response => {
    //   this.currentLoanApplication = response;
    //   this.updateValues();
    // });
    this.serviceAbilityService.currentLoanApplicationId.subscribe(response => {
      this.currentLoanApplicationId = response;
    });

    let id = this.router.url.split('/').pop()?.split('?')[0];

    if (id !== undefined) {
      this.loanDetailService.loanDetailJourneyfetch(LoanPage.BROKER_DECLARATION, id ).subscribe(response => {
        console.log(response.data);
        this.serviceAbilityService.setCurrentBrokerDeclarationPageData(response.data);
        // this.spinner.hide();
      })
    }

    this.serviceAbilityService.getCurrentBrokerDeclarationPageData().subscribe((response: BrokerDeclarationPage) => {
      this.currentBrokerDeclarationPage = response
      this.updateValues();
    })
  }


  // custom validator

  updateFormControlOnBrokerDeclarationReportChange(reportType: string) {
    this.updateFormControl(reportType === 'Yes', 'firstDateOfChange');
    this.updateFormControl(reportType === 'Yes', 'secondDateOfChange')
    this.updateFormControl(reportType === 'Yes', 'formerNameReason')
  }

  updateLenderDetailsValidators(reportType: string){
    this.updateFormControl(reportType === 'Yes', 'lenderApplicationDetails');
  }

  updateExpectSignificantChangeValidators(reportType: string){
    this.updateFormControl(reportType === 'Yes', 'expectSignificantChangeDetails')
  }

  updateTransactionBalanceDetailsValidators(reportType: string){
    this.updateFormControl(reportType === 'Yes', 'transactionBalanceDetails')
  }

  updateDischargeValidators(reportType: string){
    this.updateFormControl(reportType === 'Yes', 'bankruptcyDischargeDate')
  }



  updateFormControl(activateRequired: Boolean = true, controlName: string) {
    if (activateRequired) {
      this.brokerDeclarationFormGroup.get(controlName)?.setValidators(Validators.required);
    } else {
      this.brokerDeclarationFormGroup.get(controlName)?.setValidators([]);
      this.brokerDeclarationFormGroup.get(controlName)?.setValue('');
    }
    this.brokerDeclarationFormGroup.setControl(controlName, <AbstractControl>this.brokerDeclarationFormGroup.get(controlName));
  }

  moveToClientDeclarationButton() {
    this.removeValidators()
    this.moveToClientDeclaration.next(true)
    this.showCard = false;
  }


  public removeValidators() {
    for (const key in this.brokerDeclarationFormGroup.controls) {
      this.brokerDeclarationFormGroup.get(key)?.clearValidators();
      this.brokerDeclarationFormGroup.get(key)?.updateValueAndValidity();
    }
  }

  saveData() {
    if (this.brokerDeclarationFormGroup.valid) {
      let brokerDeclaration = this.brokerDeclarationService.formatData(this.brokerDeclarationFormGroup.value);
      brokerDeclaration.loanApplicationId = this.currentLoanApplicationId || '';
      this.brokerDeclarationService.save(brokerDeclaration).subscribe(_=>{

      });
    }
  }

  updateValues() {
    let brokerDeclaration = this.currentBrokerDeclarationPage;
    if (brokerDeclaration) {
      this.brokerDeclarationFormGroup.get('id')?.setValue(brokerDeclaration.id);
      this.brokerDeclarationFormGroup.get('creditRepresentativeName')?.setValue(brokerDeclaration.creditRepresentativeName);
      this.brokerDeclarationFormGroup.get('dateOfSignature')?.setValue(brokerDeclaration.dateOfSignature);
      this.brokerDeclarationFormGroup.get('firstDateOfChange')?.setValue(brokerDeclaration.firstDateOfChange);
      this.brokerDeclarationFormGroup.get('secondDateOfChange')?.setValue(brokerDeclaration.secondDateOfChange);
      this.brokerDeclarationFormGroup.get('accreditationNumber')?.setValue(brokerDeclaration.accreditationNumber);
      this.brokerDeclarationFormGroup.get('licenceNumber')?.setValue(brokerDeclaration.licenceNumber);
      this.brokerDeclarationFormGroup.get('licenceHolderNumber')?.setValue(brokerDeclaration.licenceHolderNumber);
      this.brokerDeclarationFormGroup.get('aclNumber')?.setValue(brokerDeclaration.aclNumber);
      this.brokerDeclarationFormGroup.get('contactPhoneNumber')?.setValue(brokerDeclaration.contactPhoneNumber);
      this.brokerDeclarationFormGroup.get('formerNameReason')?.setValue(brokerDeclaration.formerNameReason);
      this.brokerDeclarationFormGroup.get('applicantFormerName')?.setValue(brokerDeclaration.applicantFormerName);
      this.brokerDeclarationFormGroup.get('alternativeDocumentPost')?.setValue(brokerDeclaration.alternativeDocumentPost);
      this.brokerDeclarationFormGroup.get('electronicDelivery')?.setValue(brokerDeclaration.electronicDelivery);
      this.brokerDeclarationFormGroup.get('questionsDetails')?.setValue(brokerDeclaration.questionsDetails);
      this.brokerDeclarationFormGroup.get('expectSignificantChange')?.setValue(brokerDeclaration.expectSignificantChange);
      this.brokerDeclarationFormGroup.get('clientJudgement')?.setValue(brokerDeclaration.clientJudgement);
      this.brokerDeclarationFormGroup.get('defaultLegalAction')?.setValue(brokerDeclaration.defaultLegalAction);
      this.brokerDeclarationFormGroup.get('creditorBenefit')?.setValue(brokerDeclaration.creditorBenefit);
      this.brokerDeclarationFormGroup.get('dischargeDate')?.setValue(brokerDeclaration.dischargeDate);
      this.brokerDeclarationFormGroup.get('liquidatorAppointment')?.setValue(brokerDeclaration.liquidatorAppointment);
      this.brokerDeclarationFormGroup.get('transactionBalance')?.setValue(brokerDeclaration.transactionBalance);
      this.brokerDeclarationFormGroup.get('lenderApplication')?.setValue(brokerDeclaration.lenderApplication);
      this.brokerDeclarationFormGroup.get('loanGuarantee')?.setValue(brokerDeclaration.loanGuarantee);
      this.brokerDeclarationFormGroup.get('lastCheckBoxDeclaration')?.setValue(brokerDeclaration.lastCheckBoxDeclaration=='true');
      this.brokerDeclarationFormGroup.get('firstCheckboxDeclaration')?.setValue(brokerDeclaration.firstCheckboxDeclaration=='true')
      this.brokerDeclarationFormGroup.get('bankruptcyDischargeDate')?.setValue(brokerDeclaration.bankruptcyDischargeDate);
      this.brokerDeclarationFormGroup.get('preferredSignatureFont')?.setValue(brokerDeclaration. preferredSignatureFont);
      this.brokerDeclarationFormGroup.get('expectSignificantChangeDetails')?.setValue(brokerDeclaration.expectSignificantChangeDetails);
      this.brokerDeclarationFormGroup.get('lenderApplicationDetails')?.setValue(brokerDeclaration.lenderApplicationDetails);
      this.brokerDeclarationFormGroup.get('transactionBalanceDetails')?.setValue(brokerDeclaration.transactionBalanceDetails);

      if(brokerDeclaration.preferredSignatureFont == '' || typeof brokerDeclaration.preferredSignatureFont == undefined || brokerDeclaration.preferredSignatureFont == null){
        this.brokerDeclarationFormGroup.patchValue({
          preferredSignatureFont:  this.signatureFontFamilyKey
        });
      }else if(brokerDeclaration.preferredSignatureFont != '' && typeof brokerDeclaration.preferredSignatureFont != undefined && brokerDeclaration.preferredSignatureFont != null){
        this.brokerDeclarationFormGroup.get('preferredSignatureFont')?.setValue(brokerDeclaration.preferredSignatureFont);
      }
    }
  }

  // testing the formcontrols validity
  // uicheck() {
  //   // console.log(this.brokerDeclarationFormGroup.errors);
  //   Object.keys(this.brokerDeclarationFormGroup.controls).forEach(key => {

  //   console.log(key + ' validity = ' + this.brokerDeclarationFormGroup.get(key)?.valid);

  //   });

  //   }

    // SIGNATURE  DATE FORMATTER
    clientSignatureDateFormatter(event: any, value: number): void {

      let brokerDeclarationFormGroup = this.brokerDeclarationFormGroup;

      let lengthOfText = this.clientDateStr.length + 1;
      let domRef: ElementRef = this.dateOfSignature.get(value)!;

        if (event.data.includes('null')) {
          domRef.nativeElement.value = '';
          return;
        }

        if (isNaN(event.data) && lengthOfText < 10) {
          brokerDeclarationFormGroup.get('dateOfSignature')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.clientDateStr;

          return;
        }

        if (!isNaN(event.data) && lengthOfText == 2 || !isNaN(event.data) && lengthOfText== 5 ) {
          this.clientDateStr += event.data;
          this.clientDateStr += '/';
          brokerDeclarationFormGroup.get('dateOfSignature')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.clientDateStr;

          return;

        }

        if (!isNaN(event.data) && lengthOfText < 10) {
          this.clientDateStr += event.data;
          brokerDeclarationFormGroup.get('dateOfSignature')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.clientDateStr;

          return;
        }

        if (lengthOfText == 10) {
            this.clientDateStr += event.data;
            brokerDeclarationFormGroup.get('dateOfSignature')?.setValue(this.clientDateStr)
            domRef.nativeElement.value = this.clientDateStr;
            this.clientDateStr = "";
          return
        }

    }


    // DISCHARGE DATE FORMATTER
    dischargeDateFormatter(event: any, value: number): void {

      let brokerDeclarationFormGroup = this.brokerDeclarationFormGroup;

      let lengthOfText = this.dischargeDateStr.length + 1;
      let domRef: ElementRef = this.bankruptcyDischargeDate.get(value)!;

        if (event.data.includes('null')) {
          domRef.nativeElement.value = '';
          return;
        }

        if (isNaN(event.data) && lengthOfText < 10) {
          brokerDeclarationFormGroup.get('bankruptcyDischargeDate')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.dischargeDateStr;

          return;
        }

        if (!isNaN(event.data) && lengthOfText == 2 || !isNaN(event.data) && lengthOfText== 5 ) {
          this.dischargeDateStr += event.data;
          this.dischargeDateStr += '/';
          brokerDeclarationFormGroup.get('bankruptcyDischargeDate')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.dischargeDateStr;

          return;

        }

        if (!isNaN(event.data) && lengthOfText < 10) {
          this.dischargeDateStr += event.data;
          brokerDeclarationFormGroup.get('bankruptcyDischargeDate')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.dischargeDateStr;

          return;
        }

        if (lengthOfText == 10) {
            this.dischargeDateStr += event.data;
            brokerDeclarationFormGroup.get('bankruptcyDischargeDate')?.setValue(this.dischargeDateStr)
            domRef.nativeElement.value = this.dischargeDateStr;
            this.dischargeDateStr = "";
          return
        }

    }

    // FIRST & SECOND DATE OF CHANGE
    firstDateOfChangeFormatter(event: any, value: number): void {

      let brokerDeclarationFormGroup = this.brokerDeclarationFormGroup;

      let lengthOfText = this.firstDateOfChangeStr.length + 1;
      let domRef: ElementRef = this.firstDateOfChange.get(value)!;

        if (event.data.includes('null')) {
          domRef.nativeElement.value = '';
          return;
        }

        if (isNaN(event.data) && lengthOfText < 10) {
          brokerDeclarationFormGroup.get('firstDateOfChange')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.firstDateOfChangeStr;

          return;
        }

        if (!isNaN(event.data) && lengthOfText == 2 || !isNaN(event.data) && lengthOfText== 5 ) {
          this.firstDateOfChangeStr += event.data;
          this.firstDateOfChangeStr += '/';
          brokerDeclarationFormGroup.get('firstDateOfChange')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.firstDateOfChangeStr;

          return;

        }

        if (!isNaN(event.data) && lengthOfText < 10) {
          this.firstDateOfChangeStr += event.data;
          brokerDeclarationFormGroup.get('firstDateOfChange')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.firstDateOfChangeStr;

          return;
        }

        if (lengthOfText == 10) {
            this.firstDateOfChangeStr += event.data;
            brokerDeclarationFormGroup.get('firstDateOfChange')?.setValue(this.firstDateOfChangeStr)
            domRef.nativeElement.value = this.firstDateOfChangeStr;
            this.firstDateOfChangeStr = "";
          return
        }

    }

    // FIRST & SECOND DATE OF CHANGE
    secondDateOfChangeFormatter(event: any, value: number): void {

      let brokerDeclarationFormGroup = this.brokerDeclarationFormGroup;

      let lengthOfText = this.secondDateOfChangeStr.length + 1;
      let domRef: ElementRef = this.secondDateOfChange.get(value)!;

        if (event.data.includes('null')) {
          domRef.nativeElement.value = '';
          return;
        }

        if (isNaN(event.data) && lengthOfText < 10) {
          brokerDeclarationFormGroup.get('secondDateOfChange')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.secondDateOfChangeStr;

          return;
        }

        if (!isNaN(event.data) && lengthOfText == 2 || !isNaN(event.data) && lengthOfText== 5 ) {
          this.secondDateOfChangeStr += event.data;
          this.secondDateOfChangeStr += '/';
          brokerDeclarationFormGroup.get('secondDateOfChange')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.secondDateOfChangeStr;

          return;

        }

        if (!isNaN(event.data) && lengthOfText < 10) {
          this.secondDateOfChangeStr += event.data;
          brokerDeclarationFormGroup.get('secondDateOfChange')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.secondDateOfChangeStr;

          return;
        }

        if (lengthOfText == 10) {
            this.secondDateOfChangeStr += event.data;
            brokerDeclarationFormGroup.get('secondDateOfChange')?.setValue(this.secondDateOfChangeStr)
            domRef.nativeElement.value = this.secondDateOfChangeStr;
            this.secondDateOfChangeStr = "";
          return
        }

    }

}
