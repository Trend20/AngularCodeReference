import {
  Component,
  ElementRef,
  EventEmitter,
  NgModule,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DebsDataService } from '../services/debs-data.service';
import { isNumeric } from 'rxjs/internal-compatibility';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { AbnAcnService } from '../services/abn-acn.service';
import { AddressService } from '../services/address.service';
import { StampDutyCalculatorService } from '../services/stamp-duty-calculator.service';
import { PlaceAddress } from '../models/PlaceAddress';
import { StateService } from '../services/state.service';
import { ServiceAbilityService } from '../services/service-ability.service';
import { AbnSearchDetails } from '../../shared/abn/abn.component';
import { InterestRateService } from '../services/interest-rate-service';
import { BehaviorSubject, Observable, Observer, Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Amount } from '../../shared/currency/currency.component';
import { RateType, RateTypeService } from '../services/rate-type.service';
import {
  RepaymentType,
  RepaymentTypeService,
} from '../services/repayment-type.service';
import {
  ApplicantType,
  ApplicantTypeService,
} from '../services/applicant-type.service';
import { PaygType, PaygTypeService } from '../services/payg-type.service';
import {
  NotEmployedType,
  NotEmployedTypeService,
} from '../services/not-employed-type.service';
import {
  RetiredType,
  RetiredTypeService,
} from '../services/retired-type.service';
import { Frequency, FrequencyService } from '../services/frequency.service';
import {
  LoanDetailService,
  LoanPage,
  ServiceAbility,
  ServiceAbilityForLoanDetailPage,
} from '../services/loan-detail.service';
import { LoanApplication } from '../models/loan-application.model';
import { defKSUID32 } from '@thi.ng/ksuid';
import { SubAccount } from '../models/sub-account.model';
import { SERVICEABILITY } from '../../../../environments/environment';
import { Router } from '@angular/router';
import {
  LoanDetailPage,
  LoanDetailPageSubAccout,
} from '../models/LoanDetailModelPageRevised';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { SubAccountDataUpdate } from '../models/loan-detail-model';
import { HttpBackend } from '@angular/common/http';
import { HttpUtilService } from '../utils/http-util.service';
import { environment } from '../../../../environments/environment';
import { ReusableErrorService } from 'src/app/services/reusable-error.service';
import { ObserversModule } from '@angular/cdk/observers';

@Component({
  selector: 'app-serviceability',
  templateUrl: './serviceability.component.html',
  styleUrls: ['./serviceability.component.css'],
})


export class ServiceabilityComponent implements OnInit, OnDestroy {
  currentLoanApplication: LoanApplication | undefined;
  currentLoanApplicationId: string | undefined;
  currentLoanApplicationPage: LoanDetailPage | undefined;
  // private currentLoanApplicationSubscription: Subscription | undefined;
  private currentLoanApplicationIdSubscription: Subscription | undefined;
  serviceabilityFormGroup!: FormGroup;
  subAccounts!: FormArray;
  members!: FormArray;
  dialogRef!: MatDialogRef<ConfirmationDialogComponent>;
  loanPurposeList = ['Purchase', 'Refinance']; //Express
  loanTermYrs: number[] = new Array(30);
  applicantTypeList: ApplicantType[] = [];
  paygTypeList: PaygType[] = [];
  notEmployedTypeList: NotEmployedType[] = [];
  retiredTypeList: RetiredType[] = [];
  frequencyList: Frequency[] = [];
  rateTypeList: RateType[] = [];
  repaymentTypeList: RepaymentType[] = [];
  addressApplicable: Boolean |null=null;
  @Output() deleteMemberNotification: EventEmitter<number> = new EventEmitter();
  @Output() updatedPersonalDetailMemberNotification: EventEmitter<string> =
    new EventEmitter();
  @Output() addMemberNotification: EventEmitter<string> = new EventEmitter();
  @Output() isPreapproved: EventEmitter<String> = new EventEmitter();
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter();
  @Output() moveToPersonalDetails = new EventEmitter();
  @Output() updateWhyCalcFailed: EventEmitter<string> = new EventEmitter();
  loading = false;
  maximumLVR = 80;
  @Output() isRefinanceable: EventEmitter<boolean> = new EventEmitter();
  @Output() updateMemberId: EventEmitter<any> = new EventEmitter();
  @Output() updateApplicantIdToApplicantDetailsFormGroup: EventEmitter<any> = new EventEmitter();
  @ViewChildren('paygStartDate') paygStartDate !: QueryList<ElementRef>
  dateStr: string  = ''
  id: string | undefined;
  securityAddress: string | undefined;
  loanDetailsABNSearchErrorMessage : string = '';
  timeout: any = null;

  get isExpress(): boolean {
    return (
      this.serviceabilityFormGroup.get('isIncomeContinuous')?.value === 'Yes' &&
      this.serviceabilityFormGroup.get('twoYearLoanRepayment')?.value ===
      'Yes' &&
      this.serviceabilityFormGroup.get('loanPurpose')?.value === 'Refinance'
    );
  }

  constructor(
    private debsDataService: DebsDataService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private abnAcnService: AbnAcnService,
    private addressService: AddressService,
    private stampDutyCalculatorService: StampDutyCalculatorService,
    private stateService: StateService,
    private serviceAbilityService: ServiceAbilityService,
    private interestRateService: InterestRateService,
    private cdr: ChangeDetectorRef,
    private rateTypeService: RateTypeService,
    private repaymentService: RepaymentTypeService,
    private applicantTypeService: ApplicantTypeService,
    private paygTypeService: PaygTypeService,
    private notEmployedTypeService: NotEmployedTypeService,
    private retiredTypeService: RetiredTypeService,
    private frequencyService: FrequencyService,
    private loanDetailService: LoanDetailService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private http: HttpUtilService,
    private reusableErrorService: ReusableErrorService
  ) {}

  addSubAccount() {
    this.subAccounts = this.serviceabilityFormGroup.get(
      'subAccounts'
    ) as FormArray;
    let subAccountFormGroup: FormGroup = this.createSubAccountFormGroup();
    subAccountFormGroup
      .get('loanTerm')
      ?.patchValue(
        (this.subAccounts.get('0') as FormGroup).get('loanTerm')?.value
      );
    this.subAccounts.push(subAccountFormGroup);
  }

  addMember() {
    this.members = this.serviceabilityFormGroup.get('members') as FormArray;
    let memberFormGroup = this.createMemberFormGroup();
    this.members.push(memberFormGroup);
    this.serviceabilityFormGroup.setControl('members', this.members);
    this.updateApplicantType();
    this.addMemberNotification.emit(memberFormGroup.get('id')?.value);
  }

  goForward(){
    this.reusableErrorService.openValidationModal(this.serviceabilityFormGroup);
  }

  showCurrentSuperContributionAlert(){
    for(let i = 0; i<this.members.length; i++){
      let memberFormGroup = this.members.at(i);
      if(memberFormGroup.get('currentYearSuperContribution')?.value.currencyValue !== '' && memberFormGroup.get('applicantType')?.value?.name === 'Self-employed'){
        Swal.fire({
          html: '<small>Please acknowledge that the self-employed entity is trading profitably and has the ability to meet existing obligations, including this amount of super contribution.</small>',
          confirmButtonText: 'Confirm',
          customClass: {
            actions: 'my-actions',
            confirmButton: 'order-2',
          }
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire('Saved!', '', 'success')
          } else if (result.isDenied) {
            Swal.fire('Changes are not saved', '', 'info')
          }
        })
      }
    }
  }

  onKeySearch(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.showCurrentSuperContributionAlert();
      }
    }, 1000);
  }

  ngOnInit(): void {

    this.spinner.show();

    this.serviceabilityFormGroup = this.formBuilder.group(
      {
        pageName: SERVICEABILITY,
        id: [],
        loanPurpose: ['', Validators.required],
        preApproval: ['', Validators.required],
        address: ['', Validators.required],
        addressApplicable: [null],
        unitNumber: [''],
        purchasePrice: ['', [Validators.required, Validators.minLength(2)]],
        estimatedWeeklyRent: [
          '',
          [Validators.required, Validators.minLength(2)],
        ],
        stampDuty: ['', Validators.required],
        otherCost: [
          new Amount(3000),
          [Validators.required, Validators.minLength(2)],
        ],
        totalFunds: ['', [Validators.required, Validators.minLength(2)]],
        subAccounts: this.formBuilder.array([
          this.createSubAccountFormGroup(true),
        ]),
        members: this.formBuilder.array([]),
        loanDeposit: ['', [Validators.required, Validators.minLength(2)]],
        isIncomeContinuous: ['', Validators.required],
        twoYearLoanRepayment: ['', Validators.required],
        currentEstimatedLoanAmount: [
          '',
          [Validators.required, Validators.minLength(2)],
        ],
        refinanceEstimatedWeeklyRent: [
          '',
          [Validators.required, Validators.minLength(2)],
        ],
        errors: [''],
        totalLoanFromSubAccounts: [''],
        loanValueRatio: ['', Validators.required],
        interestRate: [''],
        refinanceCheckPass: [null],
        loanTerm: [''],
        interestOnlyTerm: [''],
      },
      {
        validators: [
          this.totalLoanMinMaxChecker,
          this.isAreaLendable,
          this.isDepositEmpty,
        ],
      }
    );

    this.subAccounts = this.serviceabilityFormGroup.get(
      'subAccounts'
    ) as FormArray;
    this.members = this.serviceabilityFormGroup.get('members') as FormArray;

    this.serviceAbilityService.currentSecurityAddress.subscribe((val) => {
      this.securityAddress = val.split('/').pop();

      this.serviceabilityFormGroup
        .get('unitNumber')
        ?.valueChanges?.subscribe((newVal) => {
          if (newVal != '') {
            this.serviceAbilityService.setLoanSecurityAddress(
              `${newVal}/${this.securityAddress}`
            );
          } else {
            this.serviceAbilityService.setLoanSecurityAddress(
              this.securityAddress!!
            );
          }
        });
    });
    // isIncomeContinuous
    this.serviceabilityFormGroup
      .get('isIncomeContinuous')
      ?.valueChanges?.subscribe((_) => {
        this.updateApplicantType();
        // this.checkIsExpress();
      });
    // twoYearLoanRepayment
    this.serviceabilityFormGroup
      .get('twoYearLoanRepayment')
      ?.valueChanges?.subscribe((_) => {
        this.updateApplicantType();
        // this.checkIsExpress();
      });
    this.serviceabilityFormGroup
      .get('loanPurpose')
      ?.valueChanges?.subscribe((newValue) => {
        this.serviceAbilityService.updateLoanPurpose(newValue);
        this.updatePurchaseControls(newValue);
        this.updateRefinanceControls(newValue);
        this.debsDataService.loanPurpose = newValue;
        this.updateApplicantType();
        if (newValue === 'Purchase') {
          //  this.isRefinanceable.emit(false)
          this.serviceAbilityService.nextMessage(new PlaceAddress());
          this.serviceAbilityService.setSecurityValue(this.serviceabilityFormGroup?.get('purchasePrice')?.value as Amount)
        } else {
          // this.isRefinanceable.emit(true)
          if (this.serviceabilityFormGroup.get('address')?.value)
            this.serviceAbilityService.nextMessage(
              this.serviceabilityFormGroup.get('address')?.value
            );
          this.serviceAbilityService.setSecurityValue(this.serviceabilityFormGroup?.get('currentEstimatedLoanAmount')?.value as Amount);
        }
      });
    this.serviceabilityFormGroup
      .get('preApproval')
      ?.valueChanges?.subscribe((newValue) => {
        this.updateControl(newValue === 'No', 'address');
      });
    this.serviceabilityFormGroup
      .get('purchasePrice')
      ?.valueChanges?.subscribe((newValue) => {
        this.calculateTotalFunds();
        this.calculateLVR();
        this.serviceabilityFormGroup
          .get('stampDuty')
          ?.setValue(
            new Amount(Math.round(this.getStampDuty(newValue?.amount)))
          );
        if(this.serviceabilityFormGroup.get('loanPurpose')?.value == 'Purchase') {
            this.serviceAbilityService.setSecurityValue(newValue)
        }
      });
    // this.serviceabilityFormGroup.get('unitNumber')?.valueChanges?.subscribe(newVal => {
    //   this.serviceAbilityService.setLoanSecurityAddress(`${newVal}/${this.securityAddress}`)
    // })

    // isIncomeContinuous
    this.serviceabilityFormGroup.get('isIncomeContinuous')?.valueChanges?.subscribe(newVal => {
      this.updateApplicantType();
      if (newVal === 'No' && this.serviceabilityFormGroup.get('loanPurpose')?.value == 'Refinance') {
        this.calculateTotalFunds();
        this.calculateLVR();
      }
      // this.checkIsExpress();
    });
    // twoYearLoanRepayment
    this.serviceabilityFormGroup.get('twoYearLoanRepayment')?.valueChanges?.subscribe(newVal => {
      this.updateApplicantType();
      // this.checkIsExpress();
      if (newVal === 'No' && this.serviceabilityFormGroup.get('loanPurpose')?.value == 'Refinance') {
        this.calculateTotalFunds();
        this.calculateLVR();
      }
    })
    this.serviceabilityFormGroup.get('loanPurpose')?.valueChanges?.subscribe(newValue => {
      this.serviceAbilityService.updateLoanPurpose(newValue);
      this.updatePurchaseControls(newValue);
      this.updateRefinanceControls(newValue);
      this.debsDataService.loanPurpose = newValue;
      this.updateApplicantType();
      if (newValue === 'Purchase') {
        //  this.isRefinanceable.emit(false)
        this.serviceAbilityService.nextMessage(new PlaceAddress())
      } else {
        // this.isRefinanceable.emit(true)
        if (this.serviceabilityFormGroup.get('address')?.value)
          this.serviceAbilityService.nextMessage(this.serviceabilityFormGroup.get('address')?.value);
      }
    });
    this.serviceabilityFormGroup.get('preApproval')?.valueChanges?.subscribe(newValue => {
      this.updateControl(newValue === 'No', "address")
    });
    this.serviceabilityFormGroup.get('purchasePrice')?.valueChanges?.subscribe(newValue => {
      this.calculateTotalFunds();
      this.calculateLVR();
      this.serviceabilityFormGroup.get('stampDuty')?.setValue(new Amount(Math.round(this.getStampDuty(newValue?.amount))));
    });

    this.serviceabilityFormGroup
      .get('currentEstimatedLoanAmount')
      ?.valueChanges.subscribe(newValue => {
        this.calculateLVR();
        this.calculateTotalFunds();
        if(this.serviceabilityFormGroup.get('loanPurpose')?.value == 'Refinance') {
          this.serviceAbilityService.setSecurityValue(newValue)
      }
      });
    this.serviceabilityFormGroup
      .get('otherCost')
      ?.valueChanges?.subscribe(() => {
        this.calculateTotalFunds();
        this.calculateLVR();
      });
    this.serviceabilityFormGroup
      .get('stampDuty')
      ?.valueChanges?.subscribe(() => {
        this.calculateTotalFunds();
        this.calculateLVR();
      });

    this.serviceabilityFormGroup
      .get('preApproval')
      ?.valueChanges?.subscribe((newValue) => {
        this.isPreapproved.emit(newValue);
      });


    this.subAccounts = this.serviceabilityFormGroup.get(
      'subAccounts'
    ) as FormArray;
    this.members = this.serviceabilityFormGroup.get('members') as FormArray;
    this.getRateTypeList();
    this.getRepaymentTypeList();
    this.getApplicantTypeList();
    this.getPaygTypeList();
    this.getNotEmployedTypeList();
    this.getRetiredTypeList();
    this.getFrequencyList();
    this.addMember();
  
    this.id = this.router.url.split('/').pop()?.split('?')[0];

    this.fetchLoanDetail();

    this.currentLoanApplicationIdSubscription =
      this.serviceAbilityService.currentLoanApplicationId.subscribe(
        (response) => {
          this.currentLoanApplicationId = response;
        }
      );
  }
  ngOnDestroy() {
    this.currentLoanApplicationIdSubscription?.unsubscribe();
  }

  getStampDuty(value: string): number {
    let loanValue = parseFloat((value + '').replace(/\D/g, ''));
    let address = this.serviceabilityFormGroup.get('address')
      ?.value as PlaceAddress;
    if (address?.state)
      return this.stampDutyCalculatorService.calculateStateStampDuty(
        this.stateService.getStateCode(address.state) || '',
        loanValue
      );
    return 0;
  }

  updatedPersonalDetailMember(i: number) {
    let firstName = (this.members.get(i + '') as FormGroup).get(
      'firstName'
    )?.value;
    this.updatedPersonalDetailMemberNotification.emit(i + ',' + firstName);
  }

  createMemberFormGroup(): FormGroup {
    let memberFormGroup = this.formBuilder.group(
      {
        id: [],
        firstName: ['', Validators.required],
        applicantType: ['', Validators.required],
        paygType: ['', Validators.required],
        currentYearSuperContribution: ['', [Validators.required]],
        previousYearSuperContribution: ['', [Validators.required]],
        notEmployedType: ['', Validators.required],
        notEmployedEstimatedAnnualSuperContribution: ['', Validators.required],
        estimatedAnnualSuperContribution: ['', Validators.required],
        employerSuperContribution: [
          '',
          [Validators.required, Validators.minLength(2)],
        ],
        employerSuperContributionFrequency: ['', Validators.required],
        additionalSuperContribution: ['', [Validators.minLength(2)]],
        additionalSuperContributionFrequency: [''],
        paygStartDate: ['', Validators.required],
        selfEmployedAbnNumber: ['', Validators.required],
        retiredType: [''],
        employerAbn: [''],
        employerName: [''],
        selfEmployedCompanyName: [''],
        selfEmployedBusinessStartDate: [''],
      },
      {
        validators: [
          this.isMemberSuperContributionEmpty,
          this.maximumSuperContributionCheck,
        ],
      }
    );
    memberFormGroup
      .get('applicantType')
      ?.valueChanges?.subscribe((newValue) => {
        this.updateNotEmployedControls(memberFormGroup, newValue?.name);
        this.updatePAYGControls(memberFormGroup, newValue?.name);
        this.updateSelfEmployedControls(memberFormGroup, newValue?.name);
      });
    memberFormGroup
      .get('currentYearSuperContribution')
      ?.valueChanges.subscribe((newValue) => {
        memberFormGroup
          .get('estimatedAnnualSuperContribution')
          ?.setValue(newValue);
      });
    return memberFormGroup;
  }

  createSubAccountFormGroup(isMainAccount: boolean = false): FormGroup {
    let subFormGroup = this.formBuilder.group({
      id: [],
      loanAmount: ['', Validators.required],
      rateType: ['', Validators.required],
      loanTerm: ['', Validators.required],
      loanValueRatio: ['', Validators.required],
      offset: ['', Validators.required],
      repaymentType: ['', Validators.required],
      interestOnlyPeriod: ['', Validators.required],
      fixedInterestRatePeriod: ['', Validators.required],
      interestRate: [3.83, Validators.required],
      isMainAccount: [isMainAccount],
    });

    subFormGroup.get('rateType')?.valueChanges?.subscribe((newValue) => {
      this.updateFormControl(
        subFormGroup,
        newValue?.name === 'Fixed',
        'fixedInterestRatePeriod'
      );
      this.updateFormControl(
        subFormGroup,
        newValue?.name === 'Variable',
        'offset'
      );
    });
    subFormGroup.get('repaymentType')?.valueChanges?.subscribe((newValue) => {
      this.updateFormControl(
        subFormGroup,
        newValue?.name === 'Interest only',
        'interestOnlyPeriod'
      );
    });
    subFormGroup.get('loanAmount')?.valueChanges?.subscribe(() => {
      this.calculateLVR();
    });

    subFormGroup
      .get('fixedInterestRatePeriod')
      ?.valueChanges?.subscribe((newValue) => {
        subFormGroup.get('interestOnlyPeriod')?.setValue(newValue);
      });
    return subFormGroup;
  }

  updateNotEmployedControls(formGroup: FormGroup, applicantType: string) {
    this.updateFormControl(
      formGroup,
      applicantType === 'Not employed' && !this.isExpress,
      'notEmployedType'
    );
    this.updateFormControl(
      formGroup,
      applicantType === 'Not employed' && !this.isExpress,
      'notEmployedEstimatedAnnualSuperContribution'
    );
  }

  /**
   * DO NOT DELETE COMMENTED CODE WILL BE USED ONCE PERSISTING HAPPENS
   */
  calculateLVR() {
    let value: number;
    if (
      this.serviceabilityFormGroup.get('loanPurpose')?.value === 'Refinance'
    ) {
      value = this.serviceabilityFormGroup.get('currentEstimatedLoanAmount')
        ?.value?.amount; // this.getNumber(this.serviceabilityFormGroup, 'currentEstimatedLoanAmount');
    } else {
      value = this.serviceabilityFormGroup.get('purchasePrice')?.value?.amount; //this.getNumber(this.serviceabilityFormGroup, 'purchasePrice')
    }

    // let loanTerm: number = 0;
    // let interestOnlyTerm: number = 0;
    let loanAmountTotal = 0;
    this.subAccounts.controls.forEach((subAccount) => {
      loanAmountTotal += parseFloat(
        subAccount.get('loanAmount')?.value?.amount
      );
    });
    
    let lvr = (loanAmountTotal / value) * 100;
    this.serviceabilityFormGroup
      .get('loanValueRatio')
      ?.setValue(isNumeric(lvr) ? lvr.toFixed(2) : 0);
    this.serviceabilityFormGroup
      .get('totalLoanFromSubAccounts')
      ?.setValue(new Amount(loanAmountTotal));
    this.subAccounts.controls.forEach((subAccount) => {
      if (isNumeric(lvr)) {
        (subAccount as FormGroup)
          .get('loanValueRatio')
          ?.setValue(lvr.toFixed(2));
        this.setInterestRate(subAccount as FormGroup, lvr);
      } else {
        (subAccount as FormGroup).get('loanValueRatio')?.setValue(0);
        this.setInterestRate(subAccount as FormGroup, 0);
      }
    });
    this.serviceabilityFormGroup.get('loanValueRatio')?.setValue(lvr);
    this.serviceabilityFormGroup
      .get('interestRate')
      ?.setValue(this.interestRateService.getRate(lvr));
  }

  updateFormControl(
    formGroup: FormGroup,
    activateRequired: Boolean = true,
    controlName: string
  ) {
    if (
      activateRequired &&
      controlName !== 'additionalSuperContribution' &&
      controlName !== 'additionalSuperContributionFrequency'
    ) {
      formGroup.get(controlName)?.setValidators(Validators.required);
    } else {
      formGroup.get(controlName)?.setValidators([]);
    }
    formGroup.setControl(
      controlName,
      <AbstractControl>formGroup.get(controlName)
    );
    this.serviceabilityFormGroup.setControl('subAccounts', this.subAccounts);
    this.serviceabilityFormGroup.setControl('members', this.members);
  }

  getNumber(formGroup: FormGroup, formControlName: string): number {
    let controleValue = formGroup.get(formControlName)?.value?.amount
      ? formGroup.get(formControlName)?.value?.amount
      : formGroup.get(formControlName)?.value;
    let value = (controleValue + '').replace(/\D/g, '');
    if (value && isNumeric(value)) {
      return parseFloat(`${value}`);
    } else return 0;
  }

  updatePAYGControls(formGroup: FormGroup, applicantType: string) {
    this.updateFormControl(
      formGroup,
      applicantType === 'PAYG' && !this.isExpress,
      'paygType'
    );
    this.updateFormControl(
      formGroup,
      applicantType === 'PAYG' && !this.isExpress,
      'employerSuperContributionFrequency'
    );
    this.updateFormControl(
      formGroup,
      applicantType === 'PAYG' && !this.isExpress,
      'additionalSuperContribution'
    );
    this.updateFormControl(
      formGroup,
      applicantType === 'PAYG' && !this.isExpress,
      'additionalSuperContributionFrequency'
    );
    this.updateFormControl(
      formGroup,
      applicantType === 'PAYG' && !this.isExpress,
      'paygStartDate'
    );
    this.updateFormControl(
      formGroup,
      applicantType === 'PAYG' && !this.isExpress,
      'employerSuperContribution'
    );
    this.updateFormControl(
      formGroup,
      applicantType === 'PAYG' && !this.isExpress,
      'employerAbn'
    );
    this.updateFormControl(
      formGroup,
      applicantType === 'PAYG' && !this.isExpress,
      'employerName'
    );
  }

  updateSelfEmployedControls(formGroup: FormGroup, applicantType: string) {
    this.updateFormControl(
      formGroup,
      applicantType === 'Self-employed' && !this.isExpress,
      'selfEmployedAbnNumber'
    );
    this.updateFormControl(
      formGroup,
      applicantType === 'Self-employed' && !this.isExpress,
      'selfEmployedCompanyName'
    );
    this.updateFormControl(
      formGroup,
      applicantType === 'Self-employed' && !this.isExpress,
      'currentYearSuperContribution'
    );
    this.updateFormControl(
      formGroup,
      applicantType === 'Self-employed' && !this.isExpress,
      'previousYearSuperContribution'
    );
    this.updateFormControl(
      formGroup,
      applicantType === 'Self-employed' && !this.isExpress,
      'estimatedAnnualSuperContribution'
    );
  }

  deleteSubAccount(i: number, subAccount: any) {
    this.showConfirmationDialog(
      `Are you sure you want to delete Sub Account at ${i}?`
    );
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.subAccounts.removeAt(i);
        this.serviceabilityFormGroup.setControl(
          'subAccounts',
          this.subAccounts
        );
        this.calculateLVR();
        this.deleteSub(subAccount);
      }
    });
  }

  showConfirmationDialog(message: String) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        message: message,
      },
      panelClass: ['animate__animated', 'animate__slideInLeft'],
    });
  }

  calculateTotalFunds() {
    if (this.serviceabilityFormGroup.get('loanPurpose')?.value === 'Purchase') {
      let totalFunds =
        this.getNumber(this.serviceabilityFormGroup, 'purchasePrice') +
        this.getNumber(this.serviceabilityFormGroup, 'stampDuty') +
        this.getNumber(this.serviceabilityFormGroup, 'otherCost');
      this.serviceabilityFormGroup
        .get('totalFunds')
        ?.setValue(new Amount(totalFunds));
    } else if (
      this.serviceabilityFormGroup.get('loanPurpose')?.value === 'Refinance' &&
      (this.serviceabilityFormGroup.get('isIncomeContinuous')?.value === 'No' ||
        this.serviceabilityFormGroup.get('twoYearLoanRepayment')?.value ===
        'No')
    ) {
      let totalFunds =
        this.getNumber(
          this.serviceabilityFormGroup,
          'currentEstimatedLoanAmount'
        ) + this.getNumber(this.serviceabilityFormGroup, 'otherCost');
      this.serviceabilityFormGroup
        .get('totalFunds')
        ?.setValue(new Amount(totalFunds));
    } else {
    }
  }

  /**
   * TODO
   * Make the addresses run in parralle
   * @param address
   */
  updatedAddressValues(address: PlaceAddress) {
    let addressValue = address.getSearchAddress();
    console.log(this.serviceabilityFormGroup.get('unitNumber'));
    this.serviceAbilityService.setLoanSecurityAddress(
      this.serviceabilityFormGroup.get('unitNumber')?.value == '' ? `${this.addressService.formatAddress(address)}` : `${this.serviceabilityFormGroup.get('unitNumber')?.value}/${this.addressService.formatAddress(address)}`
    );
    this.serviceabilityFormGroup.get('address')?.patchValue(address);
    if (
      this.serviceabilityFormGroup.get('loanPurpose')?.value === 'Refinance'
    ) {
      this.serviceAbilityService.nextMessage(address);
    }
    if (addressValue.length > 2) {
      this.loading = true;
      this.debsDataService.coreLogicSearch(addressValue).subscribe(
        (response) => {
          this.loading = false;
          let data = this.debsDataService.parseCoreLogicData(response.data);

          let price = data?.price;

          if (price) {
            this.serviceabilityFormGroup
              .get('currentEstimatedLoanAmount')
              ?.setValue(new Amount(parseInt(price || '')));
          }
          console.log(data);
          let rentAmount = data?.rentAmount;
          console.log(rentAmount);
          if (rentAmount) {
            this.serviceabilityFormGroup
              .get('refinanceEstimatedWeeklyRent')
              ?.setValue(new Amount(parseInt(rentAmount || '')));
            this.serviceabilityFormGroup
              .get('estimatedWeeklyRent')
              ?.setValue(new Amount(parseInt(rentAmount || '')));
          }
        },
        (_) => {
          this.loading = false;
        }
      );
    }

    this.debsDataService.postCodeCheck(address?.postalCode).subscribe(response => {

      if (response.status !== 200 || response.data.Data.length === 0) {
        //this.addressApplicable.next(false);
        this.addressApplicable=false;
        this.serviceabilityFormGroup.get('addressApplicable')?.setValue(false);
      } else {
        this.addressApplicable = true;
        //this.addressApplicable.next(true);
        this.serviceabilityFormGroup.get('addressApplicable')?.setValue(true);
      }
      this.cdr.detectChanges();
    });
  }

  updatePurchaseControls(loanPurpose: string) {
    this.updateControl(
      this.serviceabilityFormGroup.get('preApproval')?.value === 'No',
      'address'
    );
    this.updateControl(loanPurpose === 'Purchase', 'loanDeposit');
    this.updateControl(loanPurpose === 'Purchase', 'preApproval');
    this.updateControl(loanPurpose === 'Purchase', 'purchasePrice');
    this.updateControl(loanPurpose === 'Purchase', 'estimatedWeeklyRent');
    this.updateControl(loanPurpose === 'Purchase', 'stampDuty');
    this.updateControl(loanPurpose === 'Purchase', 'otherCost');
    this.updateControl(loanPurpose === 'Purchase', 'totalFunds');
  }

  updateControl(activateRequired: Boolean = true, controlName: string) {
    if (activateRequired) {
      this.serviceabilityFormGroup
        .get(controlName)
        ?.setValidators(Validators.required);
    } else {
      this.serviceabilityFormGroup.get(controlName)?.setValidators([]);
    }
    this.serviceabilityFormGroup.setControl(
      controlName,
      <AbstractControl>this.serviceabilityFormGroup.get(controlName)
    );
  }

  updateRefinanceControls(loanPurpose: string) {
    this.updateControl(
      loanPurpose === 'Refinance' ||
      this.serviceabilityFormGroup.get('preApproval')?.value === 'No',
      'address'
    );
    this.updateControl(loanPurpose === 'Refinance', 'isIncomeContinuous');
    this.updateControl(loanPurpose === 'Refinance', 'twoYearLoanRepayment');
    this.updateControl(
      loanPurpose === 'Refinance',
      'currentEstimatedLoanAmount'
    );
    this.updateControl(
      loanPurpose === 'Refinance',
      'refinanceEstimatedWeeklyRent'
    );
  }

  logLoanTerm(subForm: AbstractControl) { }

  deleteMember(i: number) {
    this.showConfirmationDialog(
      `Are you sure you want to delete member at ${i}?`
    );
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.members.removeAt(i);
        this.serviceabilityFormGroup.setControl('members', this.members);
        this.deleteMemberNotification.emit(i);
      }
    });
  }

  updateApplicantType() {
    this.members.controls.forEach((member) => {
      let memberFormGroup = member as FormGroup;
      this.updateFormControl(memberFormGroup, !this.isExpress, 'applicantType');
      this.updateNotEmployedControls(
        memberFormGroup,
        memberFormGroup.get('applicantType')?.value
      );
      this.updatePAYGControls(
        memberFormGroup,
        memberFormGroup.get('applicantType')?.value
      );
      this.updateSelfEmployedControls(
        memberFormGroup,
        memberFormGroup.get('applicantType')?.value
      );
    });
  }

  setSelfEmployed(
    abnSearchDetails: AbnSearchDetails,
    memberIncomeDetailFormGroup: AbstractControl
  ): void {
    (memberIncomeDetailFormGroup as FormGroup)
      .get('selfEmployedCompanyName')
      ?.setValue(abnSearchDetails.EntityName);
    (memberIncomeDetailFormGroup as FormGroup)
      .get('selfEmployedBusinessStartDate')
      ?.setValue(abnSearchDetails.activeDate);
  }

  setEmployedAbn(
    abnSearchDetails: AbnSearchDetails,
    memberIncomeDetailFormGroup: AbstractControl
  ): void {
    (memberIncomeDetailFormGroup as FormGroup)
      .get('employerName')
      ?.setValue(abnSearchDetails.EntityName);
  }

  setInterestRate(loanAccountFormGroup: FormGroup, lvr: number) {
    loanAccountFormGroup
      .get('interestRate')
      ?.setValue(this.interestRateService.getRate(lvr));
  }

  /**
   *
   * Loan validator function
   * @param control
   * @returns
   */

  totalLoanMinMaxChecker: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const loanAmount: any = control.get('totalLoanFromSubAccounts')
      ?.value as Amount;
    if (!loanAmount) {
      return null;
    }
    let totalLoan: number = loanAmount ? loanAmount.amount : 0;
    const loanValueRatio: any = control.get('loanValueRatio')?.value;
    if (totalLoan < 50000) {
      return {
        loanAmountError: true,
        loanAmountErrorMessage: 'Sorry. Total loan is below $50,000 *',
      };
    }

    if (loanValueRatio > this.maximumLVR) {
      return {
        loanAmountError: true,
        loanAmountErrorMessage:
          'Sorry. This LVR is above maximum allowed LVR *',
      };
    }

    if (loanValueRatio <= 70 && totalLoan > 1250000) {
      return {
        loanAmountError: true,
        loanAmountErrorMessage:
          'Sorry. Loan cannot be more than $1,250,000 when LVR is below 70 *',
      };
    }

    if (loanValueRatio <= this.maximumLVR && totalLoan > 1000000) {
      return {
        loanAmountError: true,
        loanAmountErrorMessage:
          'Sorry. Loan cannot be more than $1,000,000 when LVR is above 70 *',
      };
    }

    return null;
  };

  isAreaLendable: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const lendable: any = control.get('addressApplicable')?.value;

    if (lendable == false) {
      return { cannotLend: true };
    }

    return null;
  };

  isDepositEmpty: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const amount = control.get('loanDeposit')?.value as Amount;

    if (control.get('loanPurpose')?.value === 'Purchase') {
      return amount.amount == 0 ? { depositError: true } : null;
    }

    return null;
  };
  // checking the maximum value of the super contribution for both refinance and purchase
  maximumSuperContributionCheck: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (
      this.serviceabilityFormGroup.get('loanPurpose')?.value === 'Purchase' ||
      (this.serviceabilityFormGroup.get('loanPurpose')?.value === 'Refinance' &&
        (this.serviceabilityFormGroup.get('isIncomeContinuous')?.value ===
          'No' ||
          this.serviceabilityFormGroup.get('twoYearLoanRepayment')?.value ===
          'No'))
    ) {
      if (control.get('applicantType')?.value?.name === 'Self-employed') {
        const currentYearSuperContributionValue: any = control.get(
          'currentYearSuperContribution'
        )?.value as Amount;
        let currentYearSuperContributionAmount: number =
          currentYearSuperContributionValue.amount;
        if (currentYearSuperContributionAmount > 27500) {
          return {
            superContributionValueError: true,
            superContributionValueErrorMessage:
              'Current Year Super Contribution should not exceed $27,500',
          };
        }
      }

      if (control.get('applicantType')?.value?.name === 'Not employed') {
        const notEmployedEstimatedAnnualSuperContributionValue: any =
          control.get('notEmployedEstimatedAnnualSuperContribution')
            ?.value as Amount;
        let notEmployedEstimatedAnnualSuperContributionAmount: number =
          notEmployedEstimatedAnnualSuperContributionValue.amount;
        if (notEmployedEstimatedAnnualSuperContributionAmount > 27500) {
          return {
            superContributionValueError: true,
            superContributionValueErrorMessage:
              'Estimated Annual Super Contribution should not exceed $27,500',
          };
        }
      }



      const employerSuperContributionValue: any = control.get(
        'employerSuperContribution'
      )?.value as Amount;
      let employerSuperContributionAmount: number =
        employerSuperContributionValue?.amount;
      if (control.get('applicantType')?.value?.name === 'PAYG') {
        if (
          control.get('employerSuperContributionFrequency')?.value?.name ===
          'Annually'
        ) {
          let annualEmployerSupperContribution =
            employerSuperContributionAmount;
          if (annualEmployerSupperContribution > 27500) {
            return {
              superContributionValueError: true,
              superContributionValueErrorMessage:
                'Employer Super contribution should not exceed $27,500',
            };
          }
        } else if (
          control.get('employerSuperContributionFrequency')?.value?.name ===
          'Monthly'
        ) {
          let monthlyEmployerSupperContribution =
            employerSuperContributionAmount * 12;
          if (monthlyEmployerSupperContribution > 27500) {
            return {
              superContributionValueError: true,
              superContributionValueErrorMessage:
                'Employer Super contribution should not exceed $27,500',
            };
          }
        } else if (
          control.get('employerSuperContributionFrequency')?.value?.name ===
          'Fortnight'
        ) {
          let fortnightEmployerSupperContribution =
            employerSuperContributionAmount * 26;
          if (fortnightEmployerSupperContribution > 27500) {
            return {
              superContributionValueError: true,
              superContributionValueErrorMessage:
                'Employer Super contribution should not exceed $27,500',
            };
          }
        } else if (
          control.get('employerSuperContributionFrequency')?.value?.name ===
          'Weekly'
        ) {
          let weeklyEmployerSupperContribution =
            employerSuperContributionAmount * 52;
          if (weeklyEmployerSupperContribution > 27500) {
            return {
              superContributionValueError: true,
              superContributionValueErrorMessage:
                'Employer Super contribution should not exceed $27,500',
            };
          }
        }
      }
    }
    return null;
  };

  isMemberSuperContributionEmpty: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const currentYearSuperContribution = control.get(
      'currentYearSuperContribution'
    )?.value as Amount;

    if (this.serviceabilityFormGroup.get('loanPurpose')?.value === 'Purchase') {
      if (
        currentYearSuperContribution.amount == 0 &&
        control.get('applicantType')?.value?.name === 'Self-employed'
      ) {
        return { currentYearSuperContributionError: true };
      }
      const previousYearSuperContribution = control.get(
        'previousYearSuperContribution'
      )?.value as Amount;

      if (
        previousYearSuperContribution.amount == 0 &&
        control.get('applicantType')?.value?.name === 'Self-employed'
      ) {
        return { previousYearSuperContributionError: true };
      }

      const notEmployedEstimatedAnnualSuperContribution = control.get(
        'notEmployedEstimatedAnnualSuperContribution'
      )?.value as Amount;

      if (
        notEmployedEstimatedAnnualSuperContribution.amount == 0 &&
        control.get('applicantType')?.value?.name === 'Not employed' && control.get('notEmployedType')?.value?.name !=='Home duties'
      ) {
        return { notEmployedEstimatedAnnualSuperContributionError: true };
      }

      const estimatedAnnualSuperContribution = control.get(
        'estimatedAnnualSuperContribution'
      )?.value as Amount;

      if (
        (estimatedAnnualSuperContribution.amount == 0 &&
          control.get('applicantType')?.value?.name === 'Self-employed') ||
        (estimatedAnnualSuperContribution.amount == 0 &&
          control.get('applicantType')?.value?.name === 'Not employed' && control.get('notEmployedType')?.value?.name !=='Home duties')
      ) {
        return { estimatedAnnualSuperContributionError: true };
      }

      const employerSuperContribution = control.get('employerSuperContribution')
        ?.value as Amount;

      if (
        employerSuperContribution.amount == 0 &&
        control.get('applicantType')?.value?.name === 'PAYG'
      ) {
        return { employerSuperContributionError: true };
      }
    }

    return null;
  };

  getRateTypeList() {
    this.rateTypeService.rateTypeList.subscribe((response) => {


      this.rateTypeList = response;
      this.updateSubAccountRateType();
    });
  }

  getRepaymentTypeList() {
    this.repaymentService.searchRepaymentType().subscribe((response) => {
      this.repaymentTypeList = response.content;
      this.updateSubAccountRepaymentType();
    });
  }

  getApplicantTypeList() {
    this.applicantTypeService.applicantTypeList.subscribe((response) => {
      this.applicantTypeList = response;
      this.updateMemberFormGroupApplicantType();
    });
  }

  getPaygTypeList() {
    this.paygTypeService.paygTypeList.subscribe((response) => {
      this.paygTypeList = response;
    });
  }

  getNotEmployedTypeList() {

    this.notEmployedTypeService
      .searchNotEmployedType()
      .subscribe((response) => {
        console.log('Not Employed');

        this.notEmployedTypeList = response.content;
        this.updateMemberFormGroupNotEmployedType();
      });
  }


  getAPIData(): Observable<string> {

    return new Observable<string>((observer: Observer<string>) => {
       setTimeout(() => observer.next("This is a data From API Response"), 3000);
  });
 }

  getRetiredTypeList() {
    this.retiredTypeService.retiredTypeList.subscribe((response) => {
      this.retiredTypeList = response;
    });
  }

  getFrequencyList() {
    this.frequencyService.frequencyList.subscribe((response) => {
      this.frequencyList = response;
    });
  }

  saveData() {
    if (this.serviceabilityFormGroup.valid) {
      if (this.currentLoanApplicationId) {
        let serviceAbility = this.loanDetailService.formatDataForLoanPage(
          this.serviceabilityFormGroup.value
        );

        serviceAbility.loanApplicationId = this.id;
        this.updateSubAccountsData(
          this.serviceabilityFormGroup.get('subAccounts') as FormArray
        );
        this.updatePersonalDetailsData(
          this.serviceabilityFormGroup.get('members') as FormArray
        );
        this.updateLoanDetail(serviceAbility);
      } else {

        let serviceAbility = this.loanDetailService.formatDataForLoanPage(
          this.serviceabilityFormGroup.value
        );

        this.createLoanDetail(serviceAbility) 

      }
    }
  }

  /**
   * Update SubAccounts
   * USES LOOP
   * TODO: to optimize
   */
  updateSubAccountsData(subAccounts: FormArray) {
    console.log(subAccounts);

    for (let i = 0; i < subAccounts.length; i++) {
      let subAccount = subAccounts.at(i) as FormGroup;
      let id = subAccount.get('id')?.value;
      console.log(id, subAccount);

      if (id && id !== '' && id != null) {
        this.loanDetailService.updateSubAccount(id, subAccount.value).subscribe(
          (res) => {
          },
          (err) => {
          }
        );
      } else {
        this.loanDetailService
          .createSubAccount(this.currentLoanApplicationId!!, subAccount.value)
          .subscribe(
            (res) => {
              subAccount.get('id')?.setValue(res.data.id)
            },
            (err) => {
            }
          );
      }
    }
  }

  updatePersonalDetailsData(subAccounts: FormArray) {

    for (let i = 0; i < subAccounts.length; i++) {
      let subAccount = subAccounts.at(i) as FormGroup;
      let id = subAccount.get('id')?.value;
      console.log(id, subAccount);

      if (id && id != '' && id != null) {
        this.loanDetailService
          .updateApplicantList(id, subAccount.value)
          .subscribe(
            (res) => {
            },
            (err) => {
            }
          );
      } else {
        this.loanDetailService
          .createApplicantList(
            this.currentLoanApplicationId!!,
            subAccount.value
          )
          .subscribe(
            (res) => {
              subAccount.get('id')?.setValue(res.data.id)
              this.updateApplicantIdToApplicantDetailsFormGroup.next({name: res.data.applicantPersonalInformation.firstName, applicantId: res.data.id})
            },
            (err) => {
            }
          );
      }
    }
  }

  createLoanDetail(serviceAbility: ServiceAbilityForLoanDetailPage) {
    this.loanDetailService.createLoanDetail(serviceAbility).subscribe(
      (response) => {
        if (this.currentLoanApplicationId === response?.loanApplicationId) {
          this.serviceAbilityService.updateCurrentLoanApplication(response);
          serviceAbility.loanApplicationId = response?.loanApplicationId;
          this.serviceAbilityService.updateLoanRouteAfterLoanDetailCreate(
            response?.loanApplicationId
          );
          this.moveToPersonalDetails.next(true);
        } else {
          this.serviceAbilityService.updateCurrentLoanApplication(response);
          serviceAbility.loanApplicationId = response?.loanApplicationId;
          this.serviceAbilityService.updateLoanRouteAfterLoanDetailCreate(
            response?.loanApplicationId
          );
          this.moveToPersonalDetails.next(true);
        }

        this.updatePersonalDetailsData(
          this.serviceabilityFormGroup.get('members') as FormArray
        );

        this.updateSubAccountsData(this.serviceabilityFormGroup.get('') as FormArray);
      },
      (err) => {
      }
    );
  }
  /**
   * TO cater for new ids
   */
  updateLoanDetail(serviceAbility: ServiceAbilityForLoanDetailPage) {
    this.loanDetailService
      .updateLoanDetail(serviceAbility)
      .subscribe((response) => {
        if (this.currentLoanApplicationId === response.loanApplicationId) {
          this.serviceAbilityService.updateCurrentLoanApplication(response);
        }
      });
  }

  updateValues() {
    if (!this.currentLoanApplicationPage) {
      return;
    }
    let loanDetail = this.currentLoanApplicationPage;
    if (loanDetail) {
      this.serviceabilityFormGroup
        ?.get('loanPurpose')
        ?.setValue(
          this.loanDetailService.mapToLoanPurposeString(
            loanDetail.loanPurpose || ''
          )
        );
      this.serviceabilityFormGroup
        ?.get('preApproval')
        ?.setValue(loanDetail.preApproval);
      this.serviceabilityFormGroup
        ?.get('purchasePrice')
        ?.setValue(new Amount(loanDetail.purchasePrice));
      this.serviceabilityFormGroup
        ?.get('estimatedWeeklyRent')
        ?.setValue(new Amount(loanDetail.estimatedWeeklyRent));
      this.serviceabilityFormGroup
        ?.get('stampDuty')
        ?.setValue(new Amount(loanDetail.stampDuty));
      this.serviceabilityFormGroup
        ?.get('otherCost')
        ?.setValue(new Amount(loanDetail.otherCost));
      this.serviceabilityFormGroup
        ?.get('totalLoanFromSubAccounts')
        ?.setValue(new Amount(loanDetail.requestedLoanAmount));
      this.serviceabilityFormGroup
        ?.get('totalFunds')
        ?.setValue(new Amount(loanDetail.totalFunds));
      this.serviceabilityFormGroup
        ?.get('loanDeposit')
        ?.setValue(new Amount(loanDetail.loanDeposit));
      this.serviceabilityFormGroup
        ?.get('address')
        ?.setValue(loanDetail.loanDetailAddress?.[0]);
      this.serviceabilityFormGroup
        ?.get('unitNumber')
        ?.setValue(loanDetail.loanDetailAddress?.[0]?.unitNumber);
      this.serviceAbilityService.setLoanSecurityAddress(

        loanDetail.loanDetailAddress?.[0]?.unitNumber == '' ?
          this.addressService.formatAddress(loanDetail.loanDetailAddress?.[0] as unknown as PlaceAddress) :
          `${loanDetail.loanDetailAddress?.[0]?.unitNumber
          }/${this.addressService.formatAddress(
            loanDetail.loanDetailAddress?.[0] as unknown as PlaceAddress
          )}`
      );
      this.serviceabilityFormGroup
        ?.get('currentEstimatedLoanAmount')
        ?.setValue(new Amount(loanDetail.currentPropertyValue));
      this.serviceabilityFormGroup
        .get('refinanceEstimatedWeeklyRent')
        ?.setValue(new Amount(loanDetail.estimatedWeeklyRent));
      this.serviceabilityFormGroup
        ?.get('isIncomeContinuous')
        ?.setValue(loanDetail.incomeContinuous);
      this.serviceabilityFormGroup
        .get('twoYearLoanRepayment')
        ?.setValue(loanDetail.loanPaidForTwoYears);
    }
    let j = 0;
    loanDetail?.applicantList
      ?.sort((a, b) => a.id.localeCompare(b.id))
      ?.forEach((applicant) => {
        let memberFormGroup = this.members?.at(j);
        if (!memberFormGroup) {
          this.addMember();
          memberFormGroup = this.members.at(j);
        }

        let newIdUpdateObject = { newId: '', memberPosition: 0 };

        if (applicant) {
          if (applicant.id) {
            memberFormGroup?.get('id')?.setValue(applicant.id);
            newIdUpdateObject.newId = applicant.id;
            newIdUpdateObject.memberPosition = j;
          } else {
            //TODO: generate id
          }
          memberFormGroup
            ?.get('firstName')
            ?.setValue(applicant.applicantPersonalInformation?.firstName);
          memberFormGroup
            ?.get('estimatedAnnualSuperContribution')
            ?.setValue(new Amount(applicant.estimatedAnnualSuperContribution));
          memberFormGroup
            ?.get('notEmployedEstimatedAnnualSuperContribution')
            ?.setValue(
              new Amount(applicant.notEmployedEstimatedAnnualSuperContribution)
            );
          memberFormGroup
            ?.get('previousYearSuperContribution')
            ?.setValue(new Amount(applicant.previousYearSuperContribution));
          memberFormGroup
            ?.get('currentYearSuperContribution')
            ?.setValue(new Amount(applicant.currentYearSuperContribution));
          memberFormGroup
            ?.get('selfEmployedCompanyName')
            ?.setValue(applicant.selfEmployedCompanyName);
          memberFormGroup
            ?.get('selfEmployedAbnNumber')
            ?.setValue(applicant.selfEmployedAbnNumber);
          memberFormGroup
            ?.get('employerSuperContributionFrequency')
            ?.setValue(
              this.frequencyList.find(
                (d) => d.id == applicant?.employerSuperContributionFrequencyId
              )
            );
          memberFormGroup
            ?.get('additionalSuperContributionFrequency')
            ?.setValue(
              this.frequencyList.find(
                (d) => d.id == applicant?.additionalSuperContributionFrequencyId
              )
            );
          memberFormGroup
            ?.get('employerSuperContribution')
            ?.setValue(new Amount(applicant.employerSuperContribution));
          memberFormGroup
            ?.get('additionalSuperContribution')
            ?.setValue(new Amount(applicant.additionalSuperContribution));
          memberFormGroup
            ?.get('paygStartDate')
            ?.patchValue(applicant.paygStartDate);
          memberFormGroup?.get('employerAbn')?.setValue(applicant.employerAbn);
          memberFormGroup
            ?.get('employerName')
            ?.setValue(applicant.employerName);
          memberFormGroup
            ?.get('applicantType')
            ?.setValue(
              this.applicantTypeList.find(
                (d) => d.id == applicant?.applicantTypeId
              )
            );
          memberFormGroup
            ?.get('paygType')
            ?.setValue(
              this.paygTypeList.find((d) => d.id == applicant?.paygTypeId)
            );
          memberFormGroup
            ?.get('retiredType')
            ?.setValue(
              this.retiredTypeList.find((d) => d.id == applicant?.retiredTypeId)
            );
          this.updateMemberId.next(newIdUpdateObject);
        }
        j++;
      });
    let subAccountFormGroup = this.subAccounts?.at(0);
    let subAccount = loanDetail?.subAccountList?.find((d) => d.isMainAccount);
    if (subAccount) {
      this.updateSubAccountFormGroup(subAccountFormGroup, subAccount);
    }
    j = 1;
    loanDetail?.subAccountList
      ?.filter((d) => !d.isMainAccount)
      ?.sort((a, b) => a.id.localeCompare(b.id))
      ?.forEach((subAccount) => {
        let subAccountFormGroup = this.subAccounts?.at(j);
        if (!subAccountFormGroup) {
          this.addSubAccount();
          subAccountFormGroup = this.subAccounts.at(j);
        }
        this.updateSubAccountFormGroup(subAccountFormGroup, subAccount);
        j++;
      });
    this.updateMemberFormGroupNotEmployedType();
    this.updateMemberFormGroupApplicantType();
    // this.updateMemberFormGroupApplicantType();
    this.updateSubAccountRepaymentType();
    this.updateSubAccountRateType();
  }
  updateSubAccountRateType() {
    for (let i = 0; i < this.subAccounts.length; i++) {
      let subAccountFormGroup = this.subAccounts.at(i);
      let subAccount = this.currentLoanApplicationPage?.subAccountList?.find(
        (d) => d.id == subAccountFormGroup.get('id')?.value
      );
      if (subAccount) {
        subAccountFormGroup
          ?.get('rateType')
          ?.setValue(
            this.rateTypeList.find((d) => d.id == subAccount?.rateTypeId)
          );
      } else {
        // subAccountFormGroup?.get('rateType')?.setValue(undefined);
      }
    }
  }
  updateSubAccountRepaymentType() {
    for (let i = 0; i < this.subAccounts.length; i++) {
      let subAccountFormGroup = this.subAccounts.at(i);
      let subAccount = this.currentLoanApplicationPage?.subAccountList?.find(
        (d) => d.id == subAccountFormGroup.get('id')?.value
      );
      if (subAccount) {
        subAccountFormGroup
          ?.get('repaymentType')
          ?.setValue(
            this.repaymentTypeList.find(
              (d) => d.id == subAccount?.repaymentTypeId
            )
          );
      } else {
        subAccountFormGroup?.get('repaymentType')?.setValue(undefined);
      }
    }
  }

  updateMemberFormGroupApplicantType() {
    for (let i = 0; i < this.members.length; i++) {
      let memberFormGroup = this.members.at(i);
      let applicant = this.currentLoanApplicationPage?.applicantList?.find(
        (d) => d.id == memberFormGroup.get('id')?.value
      );
      if (applicant) {
        memberFormGroup
          ?.get('applicantType')
          ?.setValue(
            this.applicantTypeList.find(
              (d) => d.id == applicant?.applicantTypeId
            )
          );
      } else {
        memberFormGroup?.get('applicantType')?.setValue(undefined);
      }
    }
  }
  updateMemberFormGroupNotEmployedType() {
    for (let i = 0; i < this.members.length; i++) {
      let memberFormGroup = this.members.at(i);
      let applicant = this.currentLoanApplicationPage?.applicantList?.find(
        (d) => d.id == memberFormGroup.get('id')?.value
      );
      if (applicant) {
        memberFormGroup
          ?.get('notEmployedType')
          ?.setValue(
            this.notEmployedTypeList.find(
              (d) => d.id == applicant?.notEmployedTypeId
            )
          );
      } else {
        memberFormGroup?.get('notEmployedType')?.setValue(undefined);
      }
    }
  }
  updateSubAccountFormGroup(
    subAccountFormGroup: AbstractControl,
    subAccount: LoanDetailPageSubAccout
  ) {
    subAccountFormGroup?.get('id')?.setValue(subAccount.id);
    subAccountFormGroup
      ?.get('loanAmount')
      ?.setValue(new Amount(subAccount.loanAmount));
    subAccountFormGroup?.get('loanTerm')?.setValue(subAccount.loanTerm);
    subAccountFormGroup
      ?.get('loanValueRatio')
      ?.setValue(this.currentLoanApplicationPage?.loanValueRatio?.toFixed(2));
    subAccountFormGroup?.get('offset')?.setValue(subAccount.hasOffset);
    if (subAccount.fixedInterestRatePeriod) {
      subAccountFormGroup
        ?.get('fixedInterestRatePeriod')
        ?.setValue('' + subAccount.fixedInterestRatePeriod);
    }
    subAccountFormGroup
      ?.get('interestOnlyPeriod')
      ?.setValue('' + subAccount.interestOnlyPeriod);
    subAccountFormGroup
      ?.get('interestRate')
      ?.setValue(this.currentLoanApplicationPage?.interestRate);
  }

  /**
   * Ezy Refinanche check only (for now)
   */
  serviceabilityCheck() {
    let serviceability = this.serviceabilityFormGroup;
    let loanPurpose = serviceability.get('loanPurpose')?.value == 'Refinance';
    let isIncomeContinuous =
      serviceability.get('isIncomeContinuous')?.value == 'Yes';
    let twoYearLoanRepayment =
      serviceability.get('twoYearLoanRepayment')?.value == 'Yes';

    if (loanPurpose && isIncomeContinuous && twoYearLoanRepayment) {
      this.isLoading.emit(true);
      this.loanDetailService
        .refinanceServiceabilityCheck(serviceability)
        .subscribe((res) => {
          if (res?.data?.Data?.ResultValue >= 1) {
            this.isRefinanceable.emit(true);
            serviceability.get('refinanceCheckPass')?.setValue(true);
            this.updateWhyCalcFailed.next('');
            this.serviceAbilityService.setCalculatorResult(res.data?.Data);
          } else {
            this.isRefinanceable.emit(false);
            serviceability.get('refinanceCheckPass')?.setValue(false);
            this.updateWhyCalcFailed.next(res?.data?.Data?.ResultMsgError);
            this.serviceAbilityService.setCalculatorResult(res.data?.Data);
          }
        });
    } else {
      this.isRefinanceable.emit(false);
    }
  }

  deleteSub(subAccount: FormGroup) {
    let id = subAccount.get('id')?.value;

    if (id !== null && id !== '' && id !== undefined) {

      this.http
        .makeHttpRequest(
          'DELETE',
          `${environment.baseUrl}/api/v1/sub-accounts/sub-account/${id}/delete`, { responseType: 'text' }
        )
        .subscribe((res) => {
        });

    }

  }

  /**
   * ABN Error Message
   * @param errorMessage
   */
   setLoanDetailsAbnSearchErrorMessage(errorMessage: string): void {
    this.loanDetailsABNSearchErrorMessage = errorMessage;
  }


    // PAYG DATE FORMATTER
    paygDateFormatter(event: any, index: number): void {
      let membersGroup = (this.serviceabilityFormGroup?.get('members') as FormArray).at(index) as FormGroup;

      let lengthOfText = this.dateStr.length + 1;
      let domRef: ElementRef = this.paygStartDate.get(index)!;

        if (event.data.includes('null')) {
          domRef.nativeElement.value = '';
          return;
        }

        if (isNaN(event.data) && lengthOfText < 10) {
          membersGroup.get('paygStartDate')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.dateStr;

          return;
        }

        if (!isNaN(event.data) && lengthOfText == 2 || !isNaN(event.data) && lengthOfText== 5 ) {
          this.dateStr += event.data;
          this.dateStr += '/';
          membersGroup.get('paygStartDate')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.dateStr;

          return;

        }

        if (!isNaN(event.data) && lengthOfText < 10) {
          this.dateStr += event.data;
          membersGroup.get('paygStartDate')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.dateStr;

          return;
        }

        if (lengthOfText == 10) {
            this.dateStr += event.data;
            membersGroup.get('paygStartDate')?.setValue(this.dateStr)
            domRef.nativeElement.value = this.dateStr;
            this.dateStr = "";
          return
        }
      }

      fetchLoanDetail() {

        console.log(this.id)
        if (this.id == '' || this.id === undefined || this.id == null) {
          return
        }
        this.loanDetailService
      .loanDetailJourneyfetch(LoanPage.LOAN_DETAIL, this.id)
      .subscribe(
        (response) => {

          if (response.status !== 200) {
            console.log('Not working');
          } else {
            this.currentLoanApplicationId = this.id
            this.serviceAbilityService.setCurrentLoanDetailPageData(
              response.data
            );
            this.serviceAbilityService
              .getCurrentLoanDetailPageData()
              .subscribe((response: LoanDetailPage) => {
                this.currentLoanApplicationPage = response;
                this.serviceAbilityService.setAppNumber(
                  response?.applicationNumber
                );
                this.updateValues();
                this.loanDetailService.autoPopulateUnsavedValues(
                  this.serviceabilityFormGroup
                );
              });
          }

          this.spinner.hide();
        },
        (err) => {
          this.spinner.hide();
        }
      );
      }


}
