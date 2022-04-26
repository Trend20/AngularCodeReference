import { AfterViewInit, Component, ElementRef, Input, OnInit,QueryList,ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {BusinessPartnerService} from "../services/business-partner.service";
import {LoanApplication} from "../models/loan-application.model";
import {ServiceAbilityService} from "../services/service-ability.service";
import {Amount} from "../../shared/currency/currency.component";
import {BUSINESS_PARTNER_DETAILS} from "../../../../environments/environment";
import signatureFontsJson from '../../../../assets/configs/signature-fonts.json';
import { BusinessPartnerPage } from '../models/declaration-model-revised';
import { Router } from '@angular/router';
import { LoanDetailService, LoanPage } from '../services/loan-detail.service';
import { ReusableErrorService } from 'src/app/services/reusable-error.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-business-partner-details-declaration',
  templateUrl: './business-partner-details-declaration.component.html',
  styleUrls: ['./business-partner-details-declaration.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BusinessPartnerDetailsDeclarationComponent implements OnInit, AfterViewInit {
  // currentLoanApplication: LoanApplication | undefined;
  currentLoanApplicationId: string | undefined;
  currentBusinessPartnerPage: BusinessPartnerPage | undefined;


  loanPurpose !: string;
  partnerName: string | undefined;

  maxDate!: Date;
  amount: any;

  fonts: any = signatureFontsJson;
  signatureFontFamilyKey: string = this.fonts[0].key;

  businessPartnerDateStr = '';
  @ViewChildren('dateOfSignature') dateOfSignature !: QueryList<ElementRef>


  singleChoiceQuestions: any [] =[
   {
    question: 'I have met the client face to face and verified their identity.',
    formControl:'clientFace',
    detailsFormControlName: 'clientFaceDetails'
   },
   {
    question: 'The applicant(s) have demonstrated sufficient English fluency to understand the loan and its implications.',
    formControl:'sufficientEnglish',
    detailsFormControlName: 'sufficientEnglishDetails'
   },
   {
    question: 'The financial position of the applicant(s) is verified in the loan application and the income and outgoings, assets and liabilities are specified.',
    formControl:'financialPosition',
    detailsFormControlName: 'financialPositionDetails'
   },
   {
    question: 'Customers borrowing requirements and objectives and resulting benefits (e.g refinance at a lower interest rate to reduce loan payments).',
    detailsFormControlName: 'customerBorrowingsDetails'
  },
  {
    question: 'Will the applicant(s) retire within the term of the loan? If YES, what is the Retirement and Exit Strategy?',
    detailsFormControlName: 'exitStrategyDetails'
  },
  {
    question: 'Specific features requested, and any associated risks or costs (e.g fixed rate, offset account).',
    detailsFormControlName: 'featuresRequestedDetails'
  },
  {
    question: 'How does the loan product(s) selected meet the customers requirements and objectives? (e.g. fixed rate provides repayment stability and access to offset for budgeting flexibility).',
    detailsFormControlName: 'loanProductsDetails'
  },
  {
   question: 'Exist if refinance'
  },
  {
    question: "Are any persons named in this form or any of their close personal business relationships, associates or family members, politically exposed persons (PEPs) e.g. Head of States,senior politicians,senior government officials (including local government), judicial or military officials, senior executives of state owned corporations, or senior political party officials? Are they members of international organizations, being senior management, i.e. directors, deputy directors and members of the board or who have been entrusted with equivalent functions?",
    formControl:'closePersonal',
    detailsFormControlName: 'closePersonalDetails'
  },
  {
    question: "Are the applicants experiencing any financial stress from existing commitments, applied for hardship through their existing lender, or has the borrower identified anything that may adversely affect their ability to meet their current and future financial obligations? If 'Yes', provide explanation and strategy to continue to make repayments.",
    formControl:'existingCommitments',
    detailsFormControlName: 'existingCommitmentsDetails'
  }
  ]

  confirmationQuestions: any[] =[
    {
      content: "The income and expense information provided within the application are those obtained from the applicant(s) during my preliminary assessment."
    },
    {
      content: "I collected the individual documents and verified the identity of the applicant(s). I also confirm that copies of all documents sent to Mortgage Ezy are held by us. We will retain these documents and will make them available to Mortgage Ezy if requested. We are aware this application will be audited by Mortgage Ezy."
    },
    {
      content: "I have made reasonable enquires and based on the information provided to me by the applicant/s the recommended product is NOT UNSUITABLE on the basis that it is consistent with the applicant/s requirements and objectives, the applicant/s will be able to comply with their financial obligations under the proposed loan product, the applicant/s has the requisite capacity to service all financial commitments and without substantial hardship and the applicant/s has the requisite authority/ capacity to grant the supporting securities."
    },
    {
      content: "For interest only term loans and line of credit: a) The interest only period aligns with the applicant(s) requirements. b) I have explained the following additional risks and costs of an interest only term to the applicants: interest only repayments will not pay off any principal during the interest only term, the repayments required to pay out the loan will increase after the interest only period ends to cover both interest and principal reductions; and the apllicant/s may pay more over the life of their loan than if there was no interest only term."
    },
    {
      content: "The applicant(s) is not disadvantaged by any conflict of interest in relation to any incentives or commissions that I may receive for writing this loan."
    },
    {
      content: "No conflicts of interest exist between the applicant(s) and myself (e.g. the transaction is at arm's length and the applicant(s) is not a friend, partner or family member). If a conflict exists, please provide details below: "
    }
  ]

  businessPartnerDetailsDeclarationFormGroup !: FormGroup;
  refinanceReasons = [
          {
            reason: 'Consolidate financials',
            value: 'consolidate'
          },
          {
            reason: 'Quality of service',
            value: 'quality'
          },
          {
            reason: 'Convenience / flexibility',
            value: 'convenience'
          },
          {
            reason: 'Cost reduction',
            value: 'cost'
          },
          {
            reason: 'Specific features',
            value: 'features'
          }
        ];

  constructor(private formBuilder: FormBuilder, private businessPartnerService: BusinessPartnerService,private authService: AuthService,
    private serviceAbilityService: ServiceAbilityService, private router: Router, private loanDetailService: LoanDetailService, private reusableErrorService: ReusableErrorService) {
    this.maxDate = new Date();
   }

   checkBusinessPartnerFormValidity(){
    this.reusableErrorService.openValidationModal(this.businessPartnerDetailsDeclarationFormGroup);
  }

  setPartnerName(brokerDetails: any){
    if(brokerDetails !== undefined){
      this.partnerName = brokerDetails.Data.FullName;
      this.businessPartnerDetailsDeclarationFormGroup.get('businessPartnerName')?.setValue(this.partnerName);
    }
  }

  ngOnInit(): void {
    this.businessPartnerDetailsDeclarationFormGroup = this.formBuilder.group({
      pageName: BUSINESS_PARTNER_DETAILS,
      clientFace: ['', Validators.required],
      sufficientEnglish: ['', Validators.required],
      financialPosition: ['', Validators.required],
      closePersonal: ['', Validators.required],
      closePersonalDetails: [''],
      existingCommitmentsDetails: [''],
      existingCommitments: ['', Validators.required],
      dateOfSignature: ['', Validators.required],
      businessPartnerName: ['', Validators.required],
      loanPurposeAndBenefits: [''],
      refinanceReasons: [''],
      enterLiability: [''],
      exitCost: [''],
      clientFaceDetails: [''],
      sufficientEnglishDetails: [''],
      financialPositionDetails: [''],
      customerBorrowingsDetails: ['', Validators.required],
      exitStrategyDetails: ['', Validators.required],
      featuresRequestedDetails: ['', Validators.required],
      loanProductsDetails: ['', Validators.required],
      ifConflictExistDetails: [''],
      agreeToSignDigitally: ['', Validators.requiredTrue],
      selectPreferredSignature: ['']
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
      this.loanDetailService.loanDetailJourneyfetch(LoanPage.PARTNER_DECLARATION, id ).subscribe(response => {
        console.log(response.data);
        this.serviceAbilityService.setCurrentBusinessPartnerPageData(response.data);
        // this.spinner.hide();
      })
    }

    this.serviceAbilityService.getCurrentBusinessPartnerPageData().subscribe((response: BusinessPartnerPage) => {
      this.currentBusinessPartnerPage= response
      this.updateValues();
    })

    this.businessPartnerDetailsDeclarationFormGroup.get('closePersonal')?.valueChanges.subscribe(newValue => {
      this.updateClosePersonalDetailsValidators(newValue);
    });

    this.businessPartnerDetailsDeclarationFormGroup.get('existingCommitments')?.valueChanges.subscribe(newValue => {
      this.updateExistingCommitmentsDetailsValidators(newValue);
    });

    this.businessPartnerDetailsDeclarationFormGroup.get('clientFace')?.valueChanges.subscribe(newValue => {
      this.updateClientFaceDetailsValidators(newValue);
    });

    this.businessPartnerDetailsDeclarationFormGroup.get('sufficientEnglish')?.valueChanges.subscribe(newValue => {
      this.updateSufficientEnglishDetailsValidators(newValue);
    });

    this.businessPartnerDetailsDeclarationFormGroup.get('financialPosition')?.valueChanges.subscribe(newValue => {
      this.updateFinancialPositionDetailsValidators(newValue);
    });

    // loan purpose
    this.serviceAbilityService.loanPurpose.subscribe(loanPurpose => {
      if (loanPurpose) {
        this.loanPurpose = loanPurpose;
        this.businessPartnerDetailsDeclarationFormGroup.get('loanPurposeAndBenefits')?.setValue(loanPurpose)
      }
    })

  }

  ngAfterViewInit(): void{
    this.addRefinanceQuestion();

    let brokerDetails = this.authService.getCurrentBroker();
    this.setPartnerName(brokerDetails);
  }

  // add refinance quiz
  addRefinanceQuestion(){
    if(this.loanPurpose === 'Refinance'){
     this.singleChoiceQuestions.splice(7, 1, {
      question: "If refinancing or consolidating debts, please provide details of the debts being refinanced or consolidated and the resulting benefit for all the applicant's existing loans and those being refinanced or consolidated."
  })
     console.log(this.singleChoiceQuestions);
    }else{
      this.singleChoiceQuestions.splice(7, 1, {question: "Exist if refinance"});
    }
  }


  // custom validation

  updateClientFaceDetailsValidators(reportType: string){
    this.updateFormControl(reportType === 'No', 'clientFaceDetails');
  }

  updateSufficientEnglishDetailsValidators(reportType: string){
    this.updateFormControl(reportType === 'No', 'sufficientEnglishDetails');
  }

  updateFinancialPositionDetailsValidators(reportType: string){
    this.updateFormControl(reportType === 'No', 'financialPositionDetails');
  }

  updateClosePersonalDetailsValidators(reportType: string){
    this.updateFormControl(reportType === 'Yes', 'closePersonalDetails');
  }

  updateExistingCommitmentsDetailsValidators(reportType: string){
    this.updateFormControl(reportType === 'Yes', 'existingCommitmentsDetails');
  }
  // end custom validation


  updateFormControl(activateRequired: Boolean = true, controlName: string) {
    if (activateRequired) {
      this.businessPartnerDetailsDeclarationFormGroup.get(controlName)?.setValidators(Validators.required);
    } else {
      this.businessPartnerDetailsDeclarationFormGroup.get(controlName)?.setValidators([]);
      this.businessPartnerDetailsDeclarationFormGroup.get(controlName)?.setValue('');
    }
    this.businessPartnerDetailsDeclarationFormGroup.setControl(controlName, <AbstractControl>this.businessPartnerDetailsDeclarationFormGroup.get(controlName));
  }


  public removeValidators() {
    for (const key in this.businessPartnerDetailsDeclarationFormGroup.controls) {
      this.businessPartnerDetailsDeclarationFormGroup.get(key)?.clearValidators();
      this.businessPartnerDetailsDeclarationFormGroup.get(key)?.updateValueAndValidity();
    }
  }


  getFormValidationErrors() {
    console.log('businessPartnerDetailsFormGroup valid?', this.businessPartnerDetailsDeclarationFormGroup.valid)
    Object.keys(this.businessPartnerDetailsDeclarationFormGroup.controls).forEach(key => {
      const controlErrors = this.businessPartnerDetailsDeclarationFormGroup.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          if (controlErrors) {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          }
        });
      }
    });
  }

  changeSignatureFont(event: any) {
    this.signatureFontFamilyKey = event.value
  }

  saveData() {
    if (this.businessPartnerDetailsDeclarationFormGroup.valid) {
      let businessPartner = this.businessPartnerService.formatData(this.businessPartnerDetailsDeclarationFormGroup.value);
      businessPartner.loanApplicationId = this.currentLoanApplicationId || '';
      this.businessPartnerService.save(businessPartner).subscribe(() => {
      });
    }
  }
  updateValues() {
    let businessPartner = this.currentBusinessPartnerPage;
    if (businessPartner) {
      this.businessPartnerDetailsDeclarationFormGroup.get('id')?.setValue(businessPartner.id);
      this.businessPartnerDetailsDeclarationFormGroup.get('businessPartnerName')?.setValue(businessPartner.businessPartnerName);
      this.businessPartnerDetailsDeclarationFormGroup.get('exitCost')?.setValue(new Amount(businessPartner.exitCost));
      this.businessPartnerDetailsDeclarationFormGroup.get('loanProductsDetails')?.setValue(businessPartner.loanProductsDetails);
      this.businessPartnerDetailsDeclarationFormGroup.get('clientFaceDetails')?.setValue(businessPartner.clientFaceDetails);
      this.businessPartnerDetailsDeclarationFormGroup.get('ifConflictExistDetails')?.setValue(businessPartner.ifConflictExistDetails);
      this.businessPartnerDetailsDeclarationFormGroup.get('featuresRequestedDetails')?.setValue(businessPartner.featuresRequestedDetails);
      this.businessPartnerDetailsDeclarationFormGroup.get('dateOfSignature')?.setValue(businessPartner.dateOfSignature);
      this.businessPartnerDetailsDeclarationFormGroup.get('agreeToSignDigitally')?.setValue(businessPartner.agreeToSignDigitally=="true");
      this.businessPartnerDetailsDeclarationFormGroup.get('customerBorrowingsDetails')?.setValue(businessPartner.customerBorrowingsDetails);
      this.businessPartnerDetailsDeclarationFormGroup.get('financialPositionDetails')?.setValue(businessPartner.financialPositionDetails);
      this.businessPartnerDetailsDeclarationFormGroup.get('clientFaceDetails')?.setValue(businessPartner.clientFaceDetails);
      this.businessPartnerDetailsDeclarationFormGroup.get('clientFace')?.setValue(businessPartner.clientFace);
      this.businessPartnerDetailsDeclarationFormGroup.get('sufficientEnglish')?.setValue(businessPartner.sufficientEnglish);
      this.businessPartnerDetailsDeclarationFormGroup.get('sufficientEnglishDetails')?.setValue(businessPartner.sufficientEnglishDetails);
      this.businessPartnerDetailsDeclarationFormGroup.get('financialPosition')?.setValue(businessPartner.financialPosition);
      this.businessPartnerDetailsDeclarationFormGroup.get('financialPositionDetails')?.setValue(businessPartner.financialPositionDetails);
      this.businessPartnerDetailsDeclarationFormGroup.get('exitStrategyDetails')?.setValue(businessPartner.exitStrategyDetails);
      this.businessPartnerDetailsDeclarationFormGroup.get('enterLiability')?.setValue(businessPartner.enterLiability);
      this.businessPartnerDetailsDeclarationFormGroup.get('refinanceReasons')?.setValue(businessPartner.refinanceReasons);
      this.businessPartnerDetailsDeclarationFormGroup.get('closePersonalDetails')?.setValue(businessPartner.closePersonalDetails);
      this.businessPartnerDetailsDeclarationFormGroup.get('closePersonal')?.setValue(businessPartner.closePersonal);
      this.businessPartnerDetailsDeclarationFormGroup.get('existingCommitments')?.setValue(businessPartner.existingCommitments);
      this.businessPartnerDetailsDeclarationFormGroup.get('existingCommitmentsDetails')?.setValue(businessPartner.existingCommitmentsDetails);
      // this.businessPartnerDetailsDeclarationFormGroup.get('selectPreferredSignature')?.setValue(businessPartner.selectPreferredSignature);

      // checking for the font value
      if(businessPartner.selectPreferredSignature == '' || typeof businessPartner.selectPreferredSignature == undefined || businessPartner.selectPreferredSignature == null){
        this.businessPartnerDetailsDeclarationFormGroup.patchValue({
          selectPreferredSignature:  this.signatureFontFamilyKey
        })
      }else if(businessPartner.selectPreferredSignature != '' && typeof businessPartner.selectPreferredSignature != undefined && businessPartner.selectPreferredSignature != null){
        this.businessPartnerDetailsDeclarationFormGroup.get('selectPreferredSignature')?.setValue(businessPartner.selectPreferredSignature);
      }
    }

  }

  // checks the validity of the form controls
  //  uicheck() {

  //   Object.keys(this.businessPartnerDetailsDeclarationFormGroup.controls).forEach(key => {

  //   console.log(key + ' validity = ' + this.businessPartnerDetailsDeclarationFormGroup.get(key)?.valid);

  //   });

  //   }
  businessPartnerDateFormatter(event: any, value: number): void {

    let businessPartnerDetailsDeclarationFormGroup = this.businessPartnerDetailsDeclarationFormGroup;

    let lengthOfText = this.businessPartnerDateStr.length + 1;
    let domRef: ElementRef = this.dateOfSignature.get(value)!;

      if (event.data.includes('null')) {
        domRef.nativeElement.value = '';
        return;
      }

      if (isNaN(event.data) && lengthOfText < 10) {
        businessPartnerDetailsDeclarationFormGroup.get('dateOfSignature')?.setValue('99/99/9999')
        domRef.nativeElement.value = this.businessPartnerDateStr;

        return;
      }

      if (!isNaN(event.data) && lengthOfText == 2 || !isNaN(event.data) && lengthOfText== 5 ) {
        this.businessPartnerDateStr += event.data;
        this.businessPartnerDateStr += '/';
        businessPartnerDetailsDeclarationFormGroup.get('dateOfSignature')?.setValue('99/99/9999')
        domRef.nativeElement.value = this.businessPartnerDateStr;

        return;

      }

      if (!isNaN(event.data) && lengthOfText < 10) {
        this.businessPartnerDateStr += event.data;
        businessPartnerDetailsDeclarationFormGroup.get('dateOfSignature')?.setValue('99/99/9999')
        domRef.nativeElement.value = this.businessPartnerDateStr;

        return;
      }

      if (lengthOfText == 10) {
          this.businessPartnerDateStr += event.data;
          businessPartnerDetailsDeclarationFormGroup.get('dateOfSignature')?.setValue(this.businessPartnerDateStr)
          domRef.nativeElement.value = this.businessPartnerDateStr;
          this.businessPartnerDateStr = "";
        return
      }

  }

}
