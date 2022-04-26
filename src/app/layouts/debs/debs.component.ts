import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmationDialogComponent} from '../shared/confirmation-dialog/confirmation-dialog.component';
import {AssetsAndLiabilitiesComponent} from './assets-and-liabilities/assets-and-liabilities.component';
import {MemberFirstNameDetail} from './models/member-first-name-detail';
import {ServiceabilityComponent} from './serviceability/serviceability.component';
import {BrokerDeclarationComponent} from './broker-declaration/broker-declaration.component';
import {BusinessPartnerDetailsDeclarationComponent} from './business-partner-details-declaration/business-partner-details-declaration.component';
import {DebsDataService} from './services/debs-data.service';
import {ValuationComponent} from './valuation/valuation.component';
import {AdditionalAssetsAndLiabilitiesComponent} from './additional-assets-and-liabilities/additional-assets-and-liabilities.component';
import {ServiceAbilityService} from "./services/service-ability.service";
import {AdditionalPersonalInformationComponent} from "./additional-personal-information/additional-personal-information.component";
import {ActivatedRoute} from "@angular/router";
import {LoanApplicationService} from "./services/loan-application.service";
import {ApplicantPersonalInformation} from "./models/applicant-personal-information.model";
import { CreditDecisionComponent } from './credit-decision/credit-decision.component';
import { Router } from '@angular/router';
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {PersonalDetailsComponent} from "./personal-details/personal-details.component";
import {MatStepper} from "@angular/material/stepper";
import { ServicingPageComponent } from './servicing-page/servicing-page.component'
import {
  ADDITIONAL_ASSET_LIABILITY,
  ADDITIONAL_PERSONAL_INFORMATION,
  ASSET_LIABILITY, BROKER_DECLARATION, BUSINESS_PARTNER_DETAILS,
  environment,
  PERSONAL_DETAIL,
  SERVICEABILITY, VALUATION
} from "../../../environments/environment";
import { BrokerReviewComponent } from './broker-review/broker-review.component';
import { ReferComponent } from './refer/refer.component';
import { BehaviorSubject } from 'rxjs';
import { EquifaxServiceService } from './services/equifax-service.service';

@Component({
  selector: 'app-debs',
  templateUrl: './debs.component.html',
  styleUrls: ['./debs.component.css']
})
export class DebsComponent implements OnInit {
  isLoadingResults = true;

  @ViewChild('stepper') stepper!: MatStepper;
  loanApplicationId: string | undefined | null;

  personalDetailFormGroup!: FormGroup;
  clientDeclarationFormGroup!: FormGroup;
  memberDetailList !: FormArray;
  clientDeclarationDetailList!: FormArray;
  dialogRef !: MatDialogRef<ConfirmationDialogComponent>;
  whyCalcFailed : BehaviorSubject<string> = new BehaviorSubject<string>('');

  @ViewChild(ServiceabilityComponent) serviceability ?: ServiceabilityComponent;
  @ViewChild(PersonalDetailsComponent) personalDetailsComponent ?: PersonalDetailsComponent;
  @ViewChild(AssetsAndLiabilitiesComponent) assetsAndLiability ?: AssetsAndLiabilitiesComponent;
  @ViewChild(ValuationComponent) valuation ?: ValuationComponent;
  @ViewChild(AdditionalAssetsAndLiabilitiesComponent) additionalAssetsAndLiabilitiesComponent?: AdditionalAssetsAndLiabilitiesComponent;
  @ViewChild(BrokerDeclarationComponent) brokerdeclaration ?: BrokerDeclarationComponent;
  @ViewChild(BusinessPartnerDetailsDeclarationComponent) businessPartnerDetailsDeclaration ?: BusinessPartnerDetailsDeclarationComponent;
  @ViewChild(AdditionalPersonalInformationComponent) additionalPersonalInformationComponent ?: AdditionalPersonalInformationComponent;
  @ViewChild(CreditDecisionComponent) creditdecision ?: CreditDecisionComponent;
  @ViewChild(ServicingPageComponent) servicingPage ?: ServicingPageComponent;
  @ViewChild(BrokerReviewComponent) brokerReview ?: BrokerReviewComponent;
  @ViewChild(ReferComponent) refer ?:ReferComponent;

  refinanceStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  smsfCalcStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  showClientDeclaration: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  // TO BE USED IN THE FLOW AFTER DATA SAVING IS CONFIRMED
  declarationType: BehaviorSubject<String> = new BehaviorSubject<String>('');
  declarationStatus !: String
  equifaxSearchStatus !: String

  get loanPurpose(): string {
    return this.serviceability?.serviceabilityFormGroup?.value?.loanPurpose != undefined ? this.serviceability?.serviceabilityFormGroup?.value?.loanPurpose : '';
  }

  get memberDetailNames() : ApplicantPersonalInformation[] {
    let memberNames: ApplicantPersonalInformation[] = [];
    (this.personalDetailFormGroup.get('memberDetailList') as FormArray).controls.forEach( member => {
      memberNames.push(member.value)
    })
    return memberNames;
  }
 // @ViewChild(BrokerDeclarationComponent) brokerdeclaration ?: BrokerDeclarationComponent;

  constructor(private formBuilder: FormBuilder, private addressService: DebsDataService, private _snackBar: MatSnackBar,
              private dialog: MatDialog, private serviceAbilityService: ServiceAbilityService, private route: ActivatedRoute,
              private loanApplicationService: LoanApplicationService, private router: Router, private cdr: ChangeDetectorRef, private equifaxService: EquifaxServiceService) { }

  ngOnInit(): void {
    // personal details
    this.personalDetailFormGroup = this.formBuilder.group({
      pageName: PERSONAL_DETAIL,
      propertyTrusteeACN: ['', ],
      propertyTrustName: ['', ],
      propertyTrusteeName: ['', ],
      propertyTrusteeRegistrationDate: [''],
      propertyTrusteeAddress: ['', ],
      smsfAbn: ['', ],
      smsfName: ['', ],
      address: ['', ],
      smsfTrusteeAcn: ['', ],
      smsfRegistrationDate:[''],
      smsfTrusteeRegistrationDate: [''],
      smsfTrusteeName: ['', ],
      smsfTrusteeAddress: ['', ],
      ABNRegisteredAddressCheck: [false],
      ACNSMSFRegisteredAddressCheck: [false],
      ACNPropertyRegisteredAddressCheck: [false],
      memberDetailList: this.formBuilder.array([]),
    }, { validators: [this.acnAbnValidator, this.isMobileAndEmailUnique]});
    this.memberDetailList = this.personalDetailFormGroup.get('memberDetailList') as FormArray;
    this.addressService.searchApiLogin().subscribe({
      next: data =>{
        // console.log(JSON.stringify(data));
      },
      error: err => {

      }
    });
    this.personalDetailFormGroup
      .get('memberDetailList')
      ?.valueChanges?.subscribe((applicants) => {


        for (let index = 0; index < applicants.length; index++) {
          const element = applicants[index];

          let formGroup: FormGroup = this.clientDeclarationDetailList.at(
            index
          ) as FormGroup;
          formGroup?.get('applicantFirstName')?.setValue(element?.firstName);
          formGroup?.get('applicantMiddleName')?.setValue(element?.middleName);
          formGroup?.get('applicantLastName')?.setValue(element?.lastName);
          formGroup?.get('applicantEmailAddress')?.setValue(element?.emailAddress);
        }
      });

    this.clientDeclarationFormGroup = this.formBuilder.group({
      declarationDetailList: this.formBuilder.array([])
    })
    this.clientDeclarationDetailList = this.clientDeclarationFormGroup.get(
      'declarationDetailList'
    ) as FormArray;
    this.loanApplicationId = this.route.snapshot.paramMap.get('id');
    this.serviceAbilityService.updateCurrentLoanApplicationId(this.loanApplicationId || '');
    // this.isLoadingResults = true;
    // this.loanApplicationService.getLoanApplicationById(this.loanApplicationId || '').subscribe((response) => {
    //   this.isLoadingResults = false;
    //   if (this.loanApplicationId === response.id) {
    //     this.serviceAbilityService.updateCurrentLoanApplication(response);
    //   }
    // }, error => {
    //   this.isLoadingResults = false;
    // });

    let tabIndex = this.getQueryParam();

    if (tabIndex != undefined) {
      this.sendNext(tabIndex);
    }
  }

  deleteMember(i: any) {
    this.memberDetailList.removeAt(i);
    this.personalDetailFormGroup.setControl("memberDetailList", this.memberDetailList);

    this.clientDeclarationDetailList.removeAt(i);
    this.clientDeclarationFormGroup.setControl(
      'declarationDetailList',
      this.clientDeclarationDetailList
    );
    this.serviceAbilityService.deleteMember(i);
  }

  updatedPersonalDetailMember(i: string) {
    let params = i.split(',');
    (this.memberDetailList?.at(params[0] as unknown as number) as FormGroup).get('firstName')?.setValue(params[1]);
  }

  updateClientDeclMemberId(event: any) {

    let {newId, memberPosition} = event

    console.log(newId, memberPosition)
    this.clientDeclarationDetailList = this.clientDeclarationFormGroup.get(
      'declarationDetailList'
    ) as FormArray;

    this.clientDeclarationDetailList?.at(memberPosition)?.get('applicantId')?.setValue(newId);

  }

  addMember(applicantId: string) {
    this.memberDetailList = this.personalDetailFormGroup.get("memberDetailList") as FormArray;
    this.memberDetailList.push(this.createMemberDetailsFormGroup(applicantId));
    this.personalDetailFormGroup.setControl("memberDetailList", this.memberDetailList);

    this.clientDeclarationDetailList = this.clientDeclarationFormGroup.get(
      'declarationDetailList'
    ) as FormArray;
    this.clientDeclarationDetailList.push(
      this.createClientDeclarationFormGroup(applicantId)
    );
    this.serviceAbilityService.addMember(applicantId);
  }


  isPreapproved(event: String) {

    let formGroup = this.personalDetailFormGroup
    let formControls = ['propertyTrusteeACN', 'propertyTrustName', 'propertyTrusteeName', 'propertyTrusteeAddress', 'smsfAbn', 'smsfName', 'address', 'smsfTrusteeAcn' , 'smsfTrusteeName', 'smsfTrusteeAddress'  ]
    this.validatorControllers(event, formControls, formGroup)

  }

  validatorControllers(instruction: String, formControls: string[], formGroup: FormGroup) {

    if (instruction === "Yes") {

      for (let i = 0; i < formControls.length; i++) {
        let required = formGroup.get(formControls[i])
          required?.clearValidators()
      }

    }else {
      for (let i = 0; i < formControls.length; i++) {
        let required = formGroup.get(formControls[i])
        required?.setValidators([Validators.required])
        required?.updateValueAndValidity()
      }
    }

  }

  createMemberDetailsFormGroup(applicantId: String): FormGroup {
    let memberDetailFormGroup = this.formBuilder.group({
      firstName: ['', ],
      dataEntryOption: ['', ],
      middleName: [''],
      lastName: ['', ],
      dateOfBirth: ['', ],
      countryOfIssue: ['', ],
      stateOfIssue: ['', ],
      passportNumber: ['', ],
      licenseNumber: ['', ],
      passportImage: [''],
      licenceFrontImage: [''],
      licenceBackImage: [''],
      homePhoneNumber: [''],
      mobilePhoneNumber: ['', [Validators.minLength(10),Validators.maxLength(10)]],
      emailAddress: ['', [ Validators.email]],
      address: ['', ],
      title: ['', ],
      gender: [''],
      citizenOrResident: [''],
      country: [''],
      areaCode: [''],
      applicantId: [applicantId]
    }, { validators: this.isAddressPresent});
    memberDetailFormGroup.get("dataEntryOption")?.valueChanges?.subscribe(newValue => {
      this.updateMemberDetail(memberDetailFormGroup, newValue);
    });
    memberDetailFormGroup.get("homePhoneNumber")?.valueChanges?.subscribe(newValue => {
      if (newValue.length > 0) {
        memberDetailFormGroup.get("homePhoneNumber")?.setValidators([Validators.minLength(8), Validators.maxLength(8)]);
      } else {
        memberDetailFormGroup.get('homePhoneNumber')?.clearValidators();
      }
      this.personalDetailFormGroup.setControl("memberDetailList", this.memberDetailList);
    });
    memberDetailFormGroup.get('countryOfIssue')?.valueChanges.subscribe(newValue => {
      if(newValue==='Australia') {
        memberDetailFormGroup.get('citizenOrResident')?.setValue("Yes");
      }
    });

    return memberDetailFormGroup;
  }

  createClientDeclarationFormGroup(applicantId: String): FormGroup {
    let clientDeclarationFormGroup = this.formBuilder.group({
      unsatisfiedJudgement: [null],
      unsatisfiedJudgementIfYes: [''],
      legalAction: [null],
      legalActionIfYes: [''],
      declaredBankrupt: [null],
      declaredBankruptIfYes: [''],
      bankruptDischargeDate: [''],
      shareHolderOrOfficer: [null],
      shareHolderOrOfficerIfYes: [''],
      borrowingDeposit: [null],
      borrowingDepositIfYes: [''],
      anotherLender: [null],
      anotherLenderIfYes: [''],
      guaranteedLoan: [null],
      guaranteedLoanIfYes: [''],
      adverseChange: [null],
      adverseChangeIfYes: [''],
      ifYesDetails: [''],
      applicantNameChange: [false],
      applicantReasonForFormerName: [''],
      applicantDateOfNameChange: [''],
      guarantorNameChange: [false],
      guarantorReasonForFormerName: [''],
      guarantorDateOfNameChange: [''],
      deliveryEmailMyself: ['', Validators.required],
      deliveryEmailSolicitor: [false],
      deliveryEmailBroker: [false],
      postedAddress: ['', Validators.required],
      postedSolicitor: [false],
      confirmCheckBox: [false, Validators.requiredTrue],
      over18CheckBox: [false, Validators.requiredTrue],
      eSignatureCheckBox: [false, Validators.requiredTrue],
      signatureApplicant: ['', Validators.required],
      signatureGuarantor: ['', Validators.required],
      dateSignatureApplicant: ['', Validators.required],
      dateSignatureGuarantor: ['', Validators.required],
      applicantFirstName: [''],
      applicantMiddleName: [''],
      applicantLastName: [''],
      applicantEmailAddress: [''],
      applicantSignDate: [''],
      applicantEmailSentDate: [''],
      applicantId: [applicantId]
    });


    /**
     * TODO: Add more listeners
     */
    clientDeclarationFormGroup.get('unsatisfiedJudgement')?.valueChanges?.subscribe(newValue => {

      if (newValue){

        clientDeclarationFormGroup
          .get('unsatisfiedJudgementIfYes')
          ?.setValidators([Validators.minLength(10), Validators.required]);

      } else {

        clientDeclarationFormGroup
          .get('unsatisfiedJudgementIfYes')
          ?.clearValidators()
      }
    })

    return clientDeclarationFormGroup;
  }

  updateMemberDetailFormControl(formGroup: FormGroup, activateRequired: Boolean = true, controlName: string) {
    if (activateRequired) {
      formGroup.get(controlName)?.setValidators(Validators.required);
    } else {
      formGroup.get(controlName)?.setValidators([]);
    }
    formGroup.setControl(controlName, <AbstractControl>formGroup.get(controlName));
    this.personalDetailFormGroup.setControl("memberDetailList", this.memberDetailList);
  }
  updateMemberDetail(formGroup: FormGroup, dataEntryOption: string) {
    this.updateMemberDetailFormControl(formGroup, dataEntryOption === '3', 'licenseNumber')
    this.updateMemberDetailFormControl(formGroup, dataEntryOption === '3', 'stateOfIssue')
    this.updateMemberDetailFormControl(formGroup, dataEntryOption === '4', 'passportNumber')
    this.updateMemberDetailFormControl(formGroup, dataEntryOption === '4', 'countryOfIssue')
  }

  compareMemberListFirstName(fnDetail: MemberFirstNameDetail){
    // compare with what was set on serviceability
    let serviceabilityFn : string = ((this.serviceability?.serviceabilityFormGroup?.get('members') as FormArray)?.get(`${fnDetail.memberArrayControlId}`) as FormGroup)?.get('firstName')?.value;
    if (!serviceabilityFn)
      return;
    if(serviceabilityFn?.toLowerCase() != fnDetail.firstName.toLowerCase()){
      // show confirmation dialog
      this.showConfirmationDialog('Update firstname on serviceability page?');
      this.dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed', result);
        if (result) {
          ((this.serviceability?.serviceabilityFormGroup?.get('members') as FormArray)?.get(`${fnDetail.memberArrayControlId}`) as FormGroup)?.get('firstName')?.patchValue(fnDetail.firstName, {emitEvent: false});
        }
      });
    }
  }


  showConfirmationDialog(message: String) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: { message: message
      },
      panelClass: ['animate__animated', 'animate__slideInLeft']
    });
  }


  acnAbnValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const smsfTrusteeAcn = control.get('smsfTrusteeAcn');
    const propertyTrusteeACN = control.get('propertyTrusteeACN');

    return smsfTrusteeAcn?.value !== '' && smsfTrusteeAcn?.value?.number !== '' && propertyTrusteeACN?.value !== '' && propertyTrusteeACN?.value?.number !== '' && smsfTrusteeAcn?.value?.number === propertyTrusteeACN?.value?.number ? { acnSimilar: true } : null;
  };

  isAddressPresent:ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    const address = control.get('address');

     return address?.value?.city == null || address?.value?.city == '' ? { addressEmpty: true } : null;

  }

  isMobileAndEmailUnique:ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const members = control.get('memberDetailList') as FormArray;
    let arrayHoldingEmails : String[] = []
    let arrayHoldingMobiles: String[] = []

    for (let i = 0; i < members.length; i++) {

      let email = members.at(i).get('emailAddress')?.value;
      let mobile = members.at(i).get('mobilePhoneNumber')?.value;

      if (email != null && arrayHoldingEmails.includes(email) && mobile != '' && arrayHoldingMobiles.includes(mobile) ) {
          return {emailNotUnique: true, emailErrorMessage: "Emails must be unique", mobileNotUnique: true, mobileErrorMessage: "Mobile phone numbers must be unique" }
      }

      if (email != null && arrayHoldingEmails.includes(email)) {
        return {emailNotUnique: true, emailErrorMessage: "Emails must be unique"}
      }

      if (mobile != '' && arrayHoldingMobiles.includes(mobile)) {
        return {mobileNotUnique: true, mobileErrorMessage: "Mobile phone numbers must be unique"}
      }

      arrayHoldingMobiles.push(mobile);
      arrayHoldingEmails.push(email);

    }

    return null;

  }

  switchToFirstStep() {
    let newStep = this.stepper

    if (newStep) {
      newStep.selectedIndex = 0;
    }

  }

  getQueryParam() {
    let tabIndex = null;
    this.route.queryParams.subscribe(params => {
      tabIndex = params.tabIndex;
    });

    return tabIndex;
  }
  updateUrlQueryParam(index: number) {

    this.router.navigate([], {
      queryParams: {
        tabIndex: index
      },
      queryParamsHandling: 'merge',
    });
  }



  sendNext(index: number) {
    let runNext = () => this.stepper.next();
    setTimeout(() => {
      for (let i = 0; i < index; i++) {
        runNext();
      }
    }, 1000);
  }

  /**
   * GENERIC FUNCTION BUT CURRENTLY USED ONCE THE
   * PLEASE UPDATE IT IF REUSE NEED ARISES
   */
  moveToNextStep() {
    this.showClientDeclaration.next(true)
    let newStep = this.stepper

    if (newStep) {
      newStep.selectedIndex = newStep.selectedIndex + 1
    }

  }

  moveToNextOrPreviousFromPersonal(event: boolean) {
    let newStep = this.stepper

    if (newStep && event) {
      newStep.selectedIndex = newStep.selectedIndex + 1
      return
    }

    if (newStep && !event) {
      newStep.selectedIndex = newStep.selectedIndex - 1
      return
    }

  }

  showOrHideClientDeclaration(event: any) {
      this.showClientDeclaration.next(event)
  }

  updateFullCalcDetails(event: any) {
    this.refinanceStatus.next(event)
    this.isLoadingResults = false;
  }

  updateLoadingStatus(event: any) {
    this.isLoadingResults = event
}

whyDidLoanFail(event: any) {
    console.log(event)
    this.whyCalcFailed = event
}


  updateFullCalcDetailsAtAssets(event: any) {
    this.smsfCalcStatus.next(event)
    this.isLoadingResults = false;
  }

  publishCalcFailureMessage(event: any) {
    this.whyCalcFailed.next(event);
  }

  passApplicantIdToApplicantDetailsFormGroup(nameApplicantIdData: any) {
    const {name, applicantId} = nameApplicantIdData;
    console.log(nameApplicantIdData)

    let membersArray: FormArray =  this.personalDetailFormGroup?.get('memberDetailList') as FormArray;
    let clientMembersArray: FormArray = this.clientDeclarationFormGroup?.get('declarationDetailList') as FormArray;

    for (let i = 0; i < membersArray.length; i++) {

      const singleMember: FormGroup = membersArray?.at(i) as FormGroup;
      const singleCliemtMember: FormGroup = clientMembersArray?.at(i) as FormGroup;

      if (singleMember?.get('firstName')?.value == name ) {
          singleMember?.get('applicantId')?.setValue(applicantId);
        // membersArray.at(i)?.get('applicantId')?.setValue(applicantId)
        singleCliemtMember?.get('applicantId')?.setValue(applicantId);
      }

    }

  }

  check(stepperSelectionEvent: StepperSelectionEvent) {
    let step = this.stepper?.steps.get(stepperSelectionEvent.previouslySelectedIndex);
    this.updateUrlQueryParam(stepperSelectionEvent.selectedIndex)

    switch (step?.stepControl?.value?.pageName) {
      case SERVICEABILITY:
        this.serviceability?.serviceabilityCheck()
        this.serviceability?.saveData();
        break;
      case PERSONAL_DETAIL:
        console.log(2)
        // this.personalDetailsComponent?.saveData();
        break;
      case ASSET_LIABILITY:
        this.assetsAndLiability?.smsfFullCalcCheck()
        this.assetsAndLiability?.saveData();
        break;
      case ADDITIONAL_PERSONAL_INFORMATION:
        this.additionalPersonalInformationComponent?.saveData();
        break;
      case ADDITIONAL_ASSET_LIABILITY:
        this.additionalAssetsAndLiabilitiesComponent?.saveData();
        break;
      case VALUATION:
        this.valuation?.saveData();
        break;
      case BUSINESS_PARTNER_DETAILS:
        this.businessPartnerDetailsDeclaration?.saveData();
        break;
      case BROKER_DECLARATION:
        this.brokerdeclaration?.saveData();
        // this.equifaxService?.postToEquifax(this.serviceability?.serviceabilityFormGroup!!).subscribe(x => {
          // TODO -> Add an activity here
        // })
        break;
      default:
        console.log('Not implemented');
        break;
    }
  }

}
