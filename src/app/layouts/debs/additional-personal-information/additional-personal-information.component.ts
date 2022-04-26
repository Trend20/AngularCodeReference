import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmploymentService} from "../services/employment.service";
import { IncomeService} from "../services/income.service";
import {EntityType, EntityTypeService} from "../services/entity-type.service";
import {PlaceAddress} from "../models/PlaceAddress";
import {formatDate} from "@angular/common";
import {
  isNetProfitEmpty,
  previousAddressFromNotGreaterThanPreviousAddressTo,
  previousAddressFromNotGreaterThanToday,
  previousAddressToNotGreaterThanToday,
  previousEmployerFromNotGreaterThanPreviousEmployerTo,
  previousEmployerFromNotGreaterThanToday,
  previousEmployerToNotGreaterThanToday,
  validCurrentAddressStay,
  employerABNAndEmployerName
} from "../utils/custom-validators";
import {ServiceAbilityService} from "../services/service-ability.service";
import {Subscription} from "rxjs";
import {AbnSearchDetails} from "../../shared/abn/abn.component";
import {MaritalStatus, MaritalStatusService} from "../services/marital-status.service";
import {ResidentialStatus, ResidentialStatusService} from "../services/residential-status.service";
import {Occupation, OccupationService} from "../services/occupation.service";
import {PaygIncomeSource, PaygIncomeSourceService} from "../services/payg-income-source.service";
import {ApplicantType, ApplicantTypeService} from "../services/applicant-type.service";
import {PaygType, PaygTypeService} from "../services/payg-type.service";
import {
  SupplementaryIncomeSource,
  SupplementaryIncomeSourceService
} from "../services/supplementary-income-source.service";
import {Frequency, FrequencyService} from "../services/frequency.service";
import {NotEmployedIncomeSource, NotEmployedIncomeSourceService} from "../services/not-employed-income-source.service";
import {AddBackIncomeSource, AddBackIncomeSourceService} from "../services/add-back-income-source.service";
import {LoanApplication} from "../models/loan-application.model";
import {
  AdditionalPersonalInformationService
} from "../services/additional-personal-information.service";
import {Amount} from "../../shared/currency/currency.component";
import {AddressService} from "../services/address.service";
import {defKSUID32} from "@thi.ng/ksuid";
import {ADDITIONAL_PERSONAL_INFORMATION} from "../../../../environments/environment";

@Component({
  selector: 'additional-personal-information',
  templateUrl: './additional-personal-information.component.html',
  styleUrls: ['./additional-personal-information.component.css']
})
export class AdditionalPersonalInformationComponent implements OnInit, OnDestroy {
  maxDate!: Date;
  currentLoanApplication: LoanApplication | undefined;
  currentLoanApplicationId: string | undefined;
  numberOfDependantList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  private _personalDetailFormGroup !: FormGroup;
  get personalDetailFormGroup(): FormGroup {
    return this._personalDetailFormGroup;
  }

  @Input()
  set personalDetailFormGroup(value: FormGroup) {
    this._personalDetailFormGroup = value
  }

  private _serviceabilityFormGroup !: FormGroup;
  get serviceabilityFormGroup(): FormGroup {
    return this._serviceabilityFormGroup;
  }

  @Input()
  set serviceabilityFormGroup(value: FormGroup | undefined) {
    if (value) {
      this._serviceabilityFormGroup = value
      this.updateLogic();
    }
  }

  additionalPersonalInformationFormGroup: FormGroup;
  additionalPersonalInformationMemberList: FormArray;
  maritalStatusList: MaritalStatus[] = [];
  monthList = [{index: 1, name: "January"}, {index: 2, name: 'February'}, {
    index: 3,
    name: 'March'
  }, {index: 4, name: 'April'}, {index: 5, name: 'May'}, {index: 6, name: 'June'}, {
    index: 7,
    name: 'July'
  }, {index: 8, name: 'August'}, {index: 9, name: 'September'}, {index: 10, name: 'October'}, {
    index: 11,
    name: 'November'
  }, {index: 12, name: 'December'}];
  currentResidentialStatusList: ResidentialStatus[] = [];
  occupationList: Occupation[] = [];
  probationPeriodList = Array(12);
  paygIncomeSourceList: PaygIncomeSource[] = [];
  incomeFrequencyList: Frequency[] = []
  employmentTypeList: ApplicantType[] = []
  paygStatusList: PaygType[] = [];
  notEmployedIncomeSourceList: NotEmployedIncomeSource[] = [];
  entityTypeList: EntityType[] = [];
  addBacksIncomeList: AddBackIncomeSource[] = [];
  supplementaryIncomeList: SupplementaryIncomeSource[] = [];

  private deleteMemberSubscription: Subscription | undefined;
  private addMemberSubscription: Subscription | undefined;

  constructor(private formBuilder: FormBuilder, private employmentTypeService: EmploymentService,
              private incomeService: IncomeService, private entityTypeService: EntityTypeService,
              private serviceAbilityService: ServiceAbilityService, private paygIncomeSourceService: PaygIncomeSourceService,
              private maritalStatusService: MaritalStatusService, private residentialStatusService: ResidentialStatusService, private occupationService: OccupationService,
              private applicantTypeService: ApplicantTypeService, private paygTypeService: PaygTypeService,  private frequencyService: FrequencyService,
              private notEmployedIncomeSourceService: NotEmployedIncomeSourceService, private supplementaryIncomeSourceService: SupplementaryIncomeSourceService,
              private addBackIncomeSourceService: AddBackIncomeSourceService, private additionalPersonalInformationService: AdditionalPersonalInformationService,
              private addressService: AddressService) {
                this.maxDate = new Date();
    this.additionalPersonalInformationFormGroup = this.formBuilder.group({
      pageName: ADDITIONAL_PERSONAL_INFORMATION,
      additionalPersonalInformationMemberList: this.formBuilder.array([this.creatAdditionalInformationMemberFormGroup('')]),
    });
    this.additionalPersonalInformationMemberList = this.additionalPersonalInformationFormGroup.get('additionalPersonalInformationMemberList') as FormArray;
    this.getPaygList();
    this.getPaygStatus();
    this.getFrequencyList();
    this.getNotEmployedIncomeSourceList();
    this.getEntityTypeList();
    this.getAddBacksIncomeSourceList();
    this.getSupplementaryIncomeSourceList();
    this.getPaygIncomeSourceList();
    this.getResidentialStatusList();
    this.getMaritalStatusList();
    this.getOccupationList();
  }
 
  ngOnInit() {
    this.addMemberSubscription = this.serviceAbilityService.addedMember.subscribe((applicantId) => {
      this.addMemberGroup(applicantId);
    });
    this.deleteMemberSubscription = this.serviceAbilityService.deletedMember.subscribe(newValue => {
      this.deleteMemberGroup(newValue);
    });
    this.serviceAbilityService.currentLoanApplication.subscribe(response => {
      this.currentLoanApplication = response;
      this.updateValues();
    });
    this.serviceAbilityService.currentLoanApplicationId.subscribe(response => {
      this.currentLoanApplicationId = response;
    });

  }
  ngOnDestroy() {
    this.deleteMemberSubscription?.unsubscribe();
    this.addMemberSubscription?.unsubscribe()
  }

  updateLogic() {
    let membersInfoList = this.serviceabilityFormGroup?.get('members') as FormArray
    let personalDetailInfoList = this.personalDetailFormGroup?.get('memberDetailList') as FormArray
    for (let i = 0; i < membersInfoList?.length; i++) {
      let memberFormGroup = membersInfoList.at(i) as FormGroup;
      let memberAdditionalInfoFormGroup = this.additionalPersonalInformationMemberList.at(i) as FormGroup
      if (memberAdditionalInfoFormGroup && memberFormGroup) {
        memberFormGroup?.get('applicantType')?.valueChanges.subscribe(newValue => {
          memberAdditionalInfoFormGroup.get('employmentType')?.setValue(newValue?.name);
          this.updatePAYGControls(memberAdditionalInfoFormGroup, memberAdditionalInfoFormGroup.get('employmentType')?.value);
          this.updateSelfEmployedControls(memberAdditionalInfoFormGroup, memberAdditionalInfoFormGroup.get('employmentType')?.value);
          this.updateNotEmployedControls(memberAdditionalInfoFormGroup, memberAdditionalInfoFormGroup.get('employmentType')?.value);
          this.updatePreviousEmployerControls(memberAdditionalInfoFormGroup, memberAdditionalInfoFormGroup.get('employmentType')?.value, this.isStartDateLessThan2Years(memberAdditionalInfoFormGroup));
          let incomeList = memberAdditionalInfoFormGroup.get('incomeList') as FormArray
          if (newValue?.name == 'PAYG') {
            if (incomeList.length == 0) {
              // this.addAnotherIncome(i)
            }
          } else {
            memberAdditionalInfoFormGroup.setControl('incomeList', this.formBuilder.array([]));
            this.additionalPersonalInformationFormGroup.setControl('additionalPersonalInformationMemberList', this.additionalPersonalInformationMemberList);
          }
        });
        memberFormGroup?.get('notEmployedType')?.valueChanges.subscribe(newValue => {
          memberAdditionalInfoFormGroup.get('notEmployedType')?.setValue(newValue?.name);
        });
        let personalDetailFormGroup = personalDetailInfoList.at(i) as FormGroup;
        personalDetailFormGroup.get('address')?.valueChanges.subscribe((newValue: PlaceAddress) => {
          memberAdditionalInfoFormGroup.get('residentialAddress')?.setValue(this.addressService.formatAddress(newValue));
        });
        personalDetailFormGroup.get('dateOfBirth')?.valueChanges.subscribe((newValue: Date) => {
          memberAdditionalInfoFormGroup.get('dateOfBirth')?.setValue(formatDate(newValue, 'dd/MM/yyyy', 'en-AU'));
        });
        personalDetailFormGroup.get('dataEntryOption')?.valueChanges.subscribe((newValue: number) => {
          memberAdditionalInfoFormGroup.get('identificationType')?.setValue(newValue == 1 || newValue == 3 ? "Driver Licence" : "Passport");
        });
        memberFormGroup?.get('paygStartDate')?.valueChanges.subscribe(newValue => {
          memberAdditionalInfoFormGroup.get('paygStartDate')?.setValue(newValue);
          this.updatePreviousEmployerControls(memberAdditionalInfoFormGroup, memberAdditionalInfoFormGroup.get('employmentType')?.value, this.isStartDateLessThan2Years(memberAdditionalInfoFormGroup));
        });
        memberFormGroup.get('employerName')?.valueChanges.subscribe(newValue => {
          memberAdditionalInfoFormGroup.get('employerName')?.setValue(newValue);
        });
        memberFormGroup.get('paygType')?.valueChanges.subscribe(newValue => {
          memberAdditionalInfoFormGroup.get('employmentStatus')?.setValue(newValue?.name);
        });
        memberFormGroup.get('selfEmployedCompanyName')?.valueChanges.subscribe(newValue => {
          memberAdditionalInfoFormGroup.get('selfEmployedName')?.setValue(newValue);
        });
        memberFormGroup.get('selfEmployedBusinessStartDate')?.valueChanges.subscribe(newValue => {
          memberAdditionalInfoFormGroup.get('businessStartDate')?.setValue(newValue);
        });
        memberFormGroup.get('id')?.valueChanges.subscribe((newValue) => {
          memberAdditionalInfoFormGroup.get('applicantId')?.setValue(newValue);
        });
      }
    }
    this.additionalPersonalInformationFormGroup.setControl('additionalPersonalInformationMemberList', this.additionalPersonalInformationMemberList);
  }
  deleteMemberGroup(index: number) {
    this.additionalPersonalInformationMemberList.removeAt(index);
    this.additionalPersonalInformationFormGroup.setControl('additionalPersonalInformationMemberList', this.additionalPersonalInformationMemberList);
  }
  addMemberGroup(applicantId: string) {
    if ((this.serviceabilityFormGroup.get('members') as FormArray).length != (this.additionalPersonalInformationMemberList.length)){
      this.additionalPersonalInformationMemberList.push(this.creatAdditionalInformationMemberFormGroup(applicantId));
      this.additionalPersonalInformationFormGroup.setControl('additionalPersonalInformationMemberList', this.additionalPersonalInformationMemberList);
      this.updateLogic();
    }
  }
  creatAdditionalInformationMemberFormGroup(applicantId: string) {
    let formGroup = this.formBuilder.group({
      currentAddressMonth: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      dependantAge: [''],
      numberOfDependants: [''],
      residentialAddress: [''],
      currentAddressYear: ['', Validators.required],
      previousAddressYearFrom: [''],
      previousAddressMonthFrom: [''],
      previousAddressYearTo: [''],
      previousAddressMonthTo: [''],
      previousAddress: [null],
      to: ['to'],
      currentResidentialStatus: ['', Validators.required],
      otherResidentialStatus: [''],
      otherPostalAddress: [''],
      postalAddress: ['', Validators.required],
      employmentType: [''],
      occupation: [''],
      employmentStatus: [''],
      employerName: [''],
      onProbation: [''],
      probationPeriod: [''],
      paygStartDate: [''],
      amount: [''],
      incomeList: this.formBuilder.array([this.createIncomeFormGroup()]),
      frequency: [''],
      paygStatus: [''],
      previousEmployerName: [''],
      previousEmployerAbn: [''],
      workCarProvided: [''],
      secondJobList: this.formBuilder.array([]),
      notEmployedIncomeSource: [''],
      notEmployedIncomeAmount: [''],
      notEmployedType: [''],
      entityType: [''],
      businessActivity: [''],
      selfEmployedName: [''],
      businessStartDate: [''],
      netProfit: [''],
      trustDistribution: [''],
      abnormalExpenses: [''],
      abnormalIncome: [''],
      otherIncome: [''],
      addBacksList: this.formBuilder.array([]),
      supplementaryIncomeList: this.formBuilder.array([]),
      identificationType: [''],
      dateOfBirth: [''],
      previousEmployerYearFrom: [''],
      previousEmployerMonthFrom: [''],
      previousEmployerYearTo: [''],
      previousEmployerMonthTo: [''],
      previousEmployerOccupation: [''],
      previousEmployerEmploymentType: [''],
      previousEmployerPaygStatus: [''],
      applicantId: [applicantId],
      currentAddressId: ['']
    }, {
      validators: [validCurrentAddressStay, previousAddressToNotGreaterThanToday, previousAddressFromNotGreaterThanToday, previousAddressFromNotGreaterThanPreviousAddressTo,
        previousEmployerToNotGreaterThanToday, previousEmployerFromNotGreaterThanToday, previousEmployerFromNotGreaterThanPreviousEmployerTo, isNetProfitEmpty]
    });
    formGroup.get('currentAddressYear')?.valueChanges.subscribe(() => {
      this.currentStayLessThanThreeYears(formGroup);
    });
    formGroup.get('currentAddressMonth')?.valueChanges.subscribe(() => {
      this.currentStayLessThanThreeYears(formGroup);
    });

    formGroup.get('postalAddress')?.valueChanges.subscribe(newVal => {
        if (newVal == "Other") {
          formGroup.get('otherPostalAddress')?.setValidators(Validators.required)
        }else {
          formGroup.get('otherPostalAddress')?.clearValidators()
        }
    })

    formGroup.get('numberOfDependants')?.valueChanges.subscribe(newVal => {
      if (newVal > 0) {
        formGroup.get('dependantAge')?.setValidators(Validators.required)
      }else {
        formGroup.get('dependantAge')?.clearValidators()
      }
     })

    return formGroup;
  }

  currentStayLessThanThreeYears(formGroup: AbstractControl): boolean {
    if (!formGroup.get('currentAddressMonth')?.value || !formGroup.get('currentAddressYear')?.value) {
      return false;
    }
    const today = new Date();
    const currentAddressStart = new Date(parseInt(formGroup.get('currentAddressYear')?.value), parseInt(formGroup.get('currentAddressMonth')?.value.index) - 1, 1);
    const time = today.getTime() - currentAddressStart.getTime();
    const years = time / (1000 * 3600 * 24 * 365);
    let currentStayLessThanThreeYears = years < 3;
    this.updatePreviousAddressControls(formGroup as FormGroup, currentStayLessThanThreeYears);
    return currentStayLessThanThreeYears
  }

  currentPAYGStartDateLessThanTwoYears(formGroup: AbstractControl): boolean {
    let startLessThan2Years = this.isStartDateLessThan2Years(formGroup);
    this.updatePreviousEmployerControls(formGroup as FormGroup, formGroup.get('employmentType')?.value, startLessThan2Years);
    return startLessThan2Years
  }
  isStartDateLessThan2Years(formGroup: AbstractControl) {
    if (!formGroup.get('paygStartDate')?.value) {
      return false;
    }
    const today = new Date();
    let paygStartDate = formGroup.get('paygStartDate')?.value;
    try{
      const time = today.getTime() - paygStartDate.getTime();
      const years = time / (1000 * 3600 * 24 * 365);
      return  years < 2;
    }catch (e){
      try{
        let parts = paygStartDate.toString().split("-");
        paygStartDate = new Date(parseInt(parts[0]),parseInt(parts[1]),parseInt(parts[2]))
        const time = today.getTime() - paygStartDate.getTime();
        const years = time / (1000 * 3600 * 24 * 365);
        return  years < 2;
      }catch (e) {
        return false;
      }
    }

  }
  getDependantsRange(index: number) {
    let fg = (this.additionalPersonalInformationFormGroup.get('additionalPersonalInformationMemberList') as FormArray).at(index);
    let numberOfDependants = fg.get('numberOfDependants')?.value || '0';
    return new Array(parseFloat(numberOfDependants))
  }

  getYearRange(): number[] {
    let years = []
    let endYear = (new Date()).getFullYear();
    for (let i = endYear; i >= endYear - 70; i--) {
      years.push(i);
    }
    return years;
  }

  getPaygList() {
    this.applicantTypeService.applicantTypeList.subscribe(response => {
      this.employmentTypeList = response;
    });
  }

  getPaygStatus() {
    this.paygTypeService.paygTypeList.subscribe(response => {
      this.paygStatusList = response;
    });
  }

  addSecondJob(index: number) {
    let memberInfoFormGroup = this.additionalPersonalInformationMemberList.at(index) as FormGroup
    let secondJobList = memberInfoFormGroup.get('secondJobList') as FormArray;
    secondJobList.push(this.createSecondJobGroup());
    (this.additionalPersonalInformationMemberList.at(index) as FormGroup)?.setControl('secondJobList', secondJobList);
    this.additionalPersonalInformationFormGroup.setControl('additionalPersonalInformationMemberList', this.additionalPersonalInformationMemberList);
  }

  deleteSecondJob(index: number, k: number) {
    let memberInfoFormGroup = this.additionalPersonalInformationMemberList.at(index) as FormGroup
    let secondJobList = memberInfoFormGroup.get('secondJobList') as FormArray;
    secondJobList.removeAt(k);
    (this.additionalPersonalInformationMemberList.at(index) as FormGroup)?.setControl('secondJobList', secondJobList);
    this.additionalPersonalInformationFormGroup.setControl('additionalPersonalInformationMemberList', this.additionalPersonalInformationMemberList);
  }

  createSecondJobGroup() {
    let formGroup = this.formBuilder.group({
      id: [defKSUID32().next()],
      employmentType: [''],
      occupation: ['', Validators.required],
      employmentStatus: [''],
      employerName: [''],
      employerAbn: [''],
      onProbation: ['', Validators.required],
      probationPeriod: [''],
      paygStartDate: [''],
      incomeList: this.formBuilder.array([this.createIncomeFormGroup()]),
      previousEmployerName: [''],
      previousEmployerAbn: [''],
      previousEmployerEmploymentType:[''],
      previousEmployerYearFrom: [''],
      previousEmployerStatus:[''],
      previousEmployerMonthFrom: [''],
      previousEmployerYearTo: [''],
      previousEmployerMonthTo: ['']
    }, {validators: [previousEmployerFromNotGreaterThanToday, previousEmployerToNotGreaterThanToday, previousEmployerFromNotGreaterThanPreviousEmployerTo, employerABNAndEmployerName]});
    return formGroup;
  }

  createIncomeFormGroup() {
    return this.formBuilder.group({
      id: [defKSUID32().next()],
      amount: ['', Validators.required],
      income: ['', Validators.required],
      frequency: ['', Validators.required],
      workCarProvided: ['']
    });
  }

  createAddBacksIncomeFormGroup() {
    return this.formBuilder.group({
      id: [defKSUID32().next()],
      amount: ['', Validators.required],
      income: ['', Validators.required],
      otherIncome: ['']
    });
  }

  createSupplementaryIncomeFormGroup() {
    return this.formBuilder.group({
      id: [defKSUID32().next()],
      amount: ['', Validators.required],
      income: ['', Validators.required]
    });
  }

  getFrequencyList() {
    this.frequencyService.frequencyList.subscribe(response => {
      this.incomeFrequencyList = response;
    });
  }

  getNotEmployedIncomeSourceList() {
    this.notEmployedIncomeSourceService.searchNotEmployedIncomeSource().subscribe(response => {
      this.notEmployedIncomeSourceList = response.content;
    });
  }

  getEntityTypeList() {
    this.entityTypeService.entityTypeList.subscribe(response => {
      this.entityTypeList = response;
    });
  }

  getAddBacksIncomeSourceList() {
    this.addBackIncomeSourceService.searchAddBackIncomeSource().subscribe(response => {
      this.addBacksIncomeList = response.content;
    });
  }

  getSupplementaryIncomeSourceList() {
    this.supplementaryIncomeSourceService.searchSupplementaryIncomeSource().subscribe(response => {
      this.supplementaryIncomeList = response.content;
    });
  }

  addAnotherIncome(index: number) {
    let memberInfoFormGroup = this.additionalPersonalInformationMemberList.at(index) as FormGroup
    let incomeList = memberInfoFormGroup.get('incomeList') as FormArray;
    incomeList?.push(this.createIncomeFormGroup());
    (this.additionalPersonalInformationMemberList.at(index) as FormGroup)?.setControl('incomeList', incomeList);
    this.additionalPersonalInformationFormGroup.setControl('additionalPersonalInformationMemberList', this.additionalPersonalInformationMemberList);
  }

  deleteIncome(index: number, k: number) {
    let memberInfoFormGroup = this.additionalPersonalInformationMemberList.at(index) as FormGroup
    let incomeList = memberInfoFormGroup.get('incomeList') as FormArray;
    incomeList?.removeAt(k);
    (this.additionalPersonalInformationMemberList.at(index) as FormGroup)?.setControl('incomeList', incomeList);
    this.additionalPersonalInformationFormGroup.setControl('additionalPersonalInformationMemberList', this.additionalPersonalInformationMemberList);
  }

  addAnotherSecondJobIncome(index: number, j: number) {
    let memberInfoFormGroup = this.additionalPersonalInformationMemberList.at(index) as FormGroup
    let secondJobList = memberInfoFormGroup.get('secondJobList') as FormArray;
    let secondJobFG = secondJobList.at(j) as FormGroup
    let incomeList = secondJobFG.get('incomeList') as FormArray;
    incomeList.push(this.createIncomeFormGroup());
    secondJobFG.setControl('incomeList', incomeList);
    (this.additionalPersonalInformationMemberList.at(index) as FormGroup)?.setControl('secondJobList', secondJobList);
    this.additionalPersonalInformationFormGroup.setControl('additionalPersonalInformationMemberList', this.additionalPersonalInformationMemberList);
  }

  deleteSecondJobIncome(index: number, j: number, k: number) {
    let memberInfoFormGroup = this.additionalPersonalInformationMemberList.at(index) as FormGroup
    let secondJobList = memberInfoFormGroup.get('secondJobList') as FormArray;
    let secondJobFG = secondJobList.at(j) as FormGroup
    let incomeList = secondJobFG.get('incomeList') as FormArray;
    incomeList.removeAt(k);
    secondJobFG.setControl('incomeList', incomeList);
    (this.additionalPersonalInformationMemberList.at(index) as FormGroup)?.setControl('secondJobList', secondJobList);
    this.additionalPersonalInformationFormGroup.setControl('additionalPersonalInformationMemberList', this.additionalPersonalInformationMemberList);
  }

  getFormArray(formGroup: AbstractControl, formArrayName: string): FormArray {
    return formGroup.get(formArrayName) as FormArray
  }

  isEntity(formGroup: AbstractControl): boolean {
    let memberInfo = formGroup?.value;
    return memberInfo.entityType?.name == 'Sole Trader' || memberInfo.entityType?.name == 'Partnership' || memberInfo.entityType?.name == 'Trust'
  }

  addAddBacksIncome(index: number) {
    let memberInfoFormGroup = this.additionalPersonalInformationMemberList.at(index) as FormGroup
    let addBacksList = memberInfoFormGroup.get('addBacksList') as FormArray;
    addBacksList.push(this.createAddBacksIncomeFormGroup());
    memberInfoFormGroup.setControl('addBacksList', addBacksList);
    this.additionalPersonalInformationFormGroup.setControl('additionalPersonalInformationMemberList', this.additionalPersonalInformationMemberList);
  }

  addAddSupplementaryIncome(index: number) {
    let memberInfoFormGroup = this.additionalPersonalInformationMemberList.at(index) as FormGroup
    let supplementaryIncomeList = memberInfoFormGroup.get('supplementaryIncomeList') as FormArray;
    supplementaryIncomeList.push(this.createSupplementaryIncomeFormGroup());
    memberInfoFormGroup.setControl('supplementaryIncomeList', supplementaryIncomeList);
    this.additionalPersonalInformationFormGroup.setControl('additionalPersonalInformationMemberList', this.additionalPersonalInformationMemberList);
  }

  deleteAddBacksIncome(index: number, k: number) {
    let memberInfoFormGroup = this.additionalPersonalInformationMemberList.at(index) as FormGroup
    let addBacksList = memberInfoFormGroup.get('addBacksList') as FormArray;
    addBacksList.removeAt(k);
    memberInfoFormGroup.setControl('addBacksList', addBacksList);
    this.additionalPersonalInformationFormGroup.setControl('additionalPersonalInformationMemberList', this.additionalPersonalInformationMemberList);
  }

  deleteSupplementaryIncome(index: number, k: number) {
    let memberInfoFormGroup = this.additionalPersonalInformationMemberList.at(index) as FormGroup
    let supplementaryIncomeList = memberInfoFormGroup.get('supplementaryIncomeList') as FormArray;
    supplementaryIncomeList.removeAt(k);
    memberInfoFormGroup.setControl('supplementaryIncomeList', supplementaryIncomeList);
    this.additionalPersonalInformationFormGroup.setControl('additionalPersonalInformationMemberList', this.additionalPersonalInformationMemberList);
  }

  getMemberInformationFormGroupArray(formGroup: AbstractControl | undefined, formArrayName: string, formControlName: string, index: number): any {
    try {
      return ((formGroup as FormGroup)?.get(formArrayName) as FormArray)?.at(index).get(formControlName)?.value || null
    } catch (e) {}
    return ''
  }

  updatePAYGControls(formGroup: FormGroup, applicantType: string) {
    this.updateFormControl(formGroup, applicantType === 'PAYG', 'employmentStatus')
    this.updateFormControl(formGroup, applicantType === 'PAYG', 'employmentType')
    this.updateFormControl(formGroup, applicantType === 'PAYG', 'occupation')
    this.updateFormControl(formGroup, applicantType === 'PAYG', 'employerName')
    this.updateFormControl(formGroup, applicantType === 'PAYG', 'paygStartDate')
    this.updateFormControl(formGroup, applicantType === 'PAYG', 'onProbation')
  }
  updatePreviousEmployerControls(formGroup: FormGroup, applicantType: string, currentStartLessThan2Years: boolean) {
    this.updateFormControl(formGroup, applicantType === 'PAYG' && currentStartLessThan2Years, 'previousEmployerAbn')
    this.updateFormControl(formGroup, applicantType === 'PAYG' && currentStartLessThan2Years, 'previousEmployerName')
    this.updateFormControl(formGroup, applicantType === 'PAYG' && currentStartLessThan2Years, 'previousEmployerEmploymentType')
    this.updateFormControl(formGroup, applicantType === 'PAYG' && currentStartLessThan2Years, 'previousEmployerOccupation')
    this.updateFormControl(formGroup, applicantType === 'PAYG' && currentStartLessThan2Years, 'previousEmployerMonthFrom')
    this.updateFormControl(formGroup, applicantType === 'PAYG' && currentStartLessThan2Years, 'previousEmployerYearFrom')
    this.updateFormControl(formGroup, applicantType === 'PAYG' && currentStartLessThan2Years, 'previousEmployerMonthTo')
    this.updateFormControl(formGroup, applicantType === 'PAYG' && currentStartLessThan2Years, 'previousEmployerYearTo')
    // TOBE updated when employment type changes
    // this.updateFormControl(formGroup, applicantType === 'PAYG' && currentStartLessThan2Years, 'previousEmployerPaygStatus')
  }
  updatePreviousAddressControls(formGroup: FormGroup, isLessThanThreeYears: boolean) {
    this.updateFormControl(formGroup, isLessThanThreeYears , 'previousAddress')
    this.updateFormControl(formGroup, isLessThanThreeYears , 'previousAddressMonthFrom')
    this.updateFormControl(formGroup, isLessThanThreeYears , 'previousAddressYearFrom')
    this.updateFormControl(formGroup, isLessThanThreeYears , 'previousAddressMonthTo')
    this.updateFormControl(formGroup, isLessThanThreeYears , 'previousAddressYearTo')
  }

  updateSelfEmployedControls(formGroup: FormGroup, applicantType: string) {
    this.updateFormControl(formGroup, applicantType === 'Self-employed', 'employmentType')
    this.updateFormControl(formGroup, applicantType === 'Self-employed', 'entityType')
    this.updateFormControl(formGroup, applicantType === 'Self-employed', 'businessActivity')
    this.updateFormControl(formGroup, applicantType === 'Self-employed', 'selfEmployedName')
    // this.updateFormControl(formGroup, applicantType === 'Self-employed', 'businessStartDate')
    this.updateFormControl(formGroup, applicantType === 'Self-employed', 'netProfit')
    this.updateFormControl(formGroup, applicantType === 'Self-employed', 'abnormalExpenses')
    this.updateFormControl(formGroup, applicantType === 'Self-employed', 'abnormalIncome')
    this.updateFormControl(formGroup, applicantType === 'Self-employed', 'otherIncome')
    this.updateFormControl(formGroup, applicantType === 'Self-employed', 'trustDistribution')
  }
  updateNotEmployedControls(formGroup: FormGroup, applicantType: string) {
    this.updateFormControl(formGroup, applicantType === 'Not employed', 'notEmployedIncomeAmount')
    this.updateFormControl(formGroup, applicantType === 'Not employed', 'notEmployedType')
    this.updateFormControl(formGroup, applicantType === 'Not employed', 'notEmployedIncomeSource')
  }
  updateFormControl(formGroup: FormGroup, activateRequired: Boolean = true, controlName: string) {
    if (activateRequired) {
      formGroup.get(controlName)?.setValidators(Validators.required);
    } else {
      formGroup.get(controlName)?.setValidators([]);
    }
    formGroup.setControl(controlName, <AbstractControl>formGroup.get(controlName));
    this.additionalPersonalInformationFormGroup.setControl('additionalPersonalInformationMemberList', this.additionalPersonalInformationMemberList);
  }
  getFormValidationErrors() {
    Object.keys(this.additionalPersonalInformationFormGroup.controls).forEach(key => {
      const controlErrors = this.additionalPersonalInformationFormGroup.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          if (controlErrors) {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          }
        });
      }
    });
    this.additionalPersonalInformationMemberList.controls.forEach(da => {
      Object.keys((da as FormGroup).controls).forEach(key => {
        const controlErrors = (da as FormGroup)?.get(key)?.errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            if (controlErrors) {
              console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
            }
          });
        }
      });
    });

  }
  setPreviousAddress(placeAddress: PlaceAddress, formGroup: AbstractControl){
    formGroup.get('previousAddress')?.patchValue(placeAddress);
  }
  setPreviousEmployer(abnSearchDetails: AbnSearchDetails, formGroup: AbstractControl) {
    formGroup.get('previousEmployerName')?.setValue(abnSearchDetails.EntityName);
  }
  setEmployerName(abnSearchDetails: AbnSearchDetails, formGroup: AbstractControl) {
    formGroup.get('employerName')?.setValue(abnSearchDetails.EntityName);
  }
  getPaygIncomeSourceList() {
    this.paygIncomeSourceService.paygIncomeSourceList.subscribe(response => {
      this.paygIncomeSourceList = response;
    });
  }
  getMaritalStatusList() {
    this.maritalStatusService.maritalStatusList.subscribe(response => {
      this.maritalStatusList = response;
    });
  }
  getResidentialStatusList() {
    this.residentialStatusService.searchResidentialStatus().subscribe(response => {
      this.currentResidentialStatusList = response.content;
    });
  }
  getOccupationList() {
    this.occupationService.occupationList.subscribe(response => {
      this.occupationList = response;
      this.updateMemberFormGroupOccupation();
    });
  }
  saveData() {
    if (this.additionalPersonalInformationFormGroup.valid) {
      let additionalPersonalInformation = this.additionalPersonalInformationService.formatData(this.additionalPersonalInformationFormGroup.value);
      additionalPersonalInformation.loanApplicationId = this.currentLoanApplicationId;
      this.additionalPersonalInformationService.save(additionalPersonalInformation).subscribe(() => {
      });
    }
  }

  updateValues() {
    if (!this.currentLoanApplication?.loanDetail) {
      return
    }
    for (let i = 0; i < this.additionalPersonalInformationMemberList.length; i++) {
      let memberAdditionalInfoFormGroup = this.additionalPersonalInformationMemberList.at(i);
      let applicant = this.currentLoanApplication?.applicantList?.find(app => app.id == memberAdditionalInfoFormGroup.get('applicantId')?.value);
      if (applicant) {
        memberAdditionalInfoFormGroup?.get('currentResidentialStatus')?.setValue(this.currentResidentialStatusList.find(d => d.id == applicant?.applicantPersonalInformation?.currentResidentialStatusId));
        memberAdditionalInfoFormGroup?.get('otherPostalAddress')?.setValue(applicant.applicantPersonalInformation?.otherPostalAddress);
        memberAdditionalInfoFormGroup?.get('probationPeriod')?.setValue(applicant.applicantPersonalInformation?.probationPeriod);
        memberAdditionalInfoFormGroup?.get('maritalStatus')?.setValue(this.maritalStatusList.find(d => d.id == (applicant?.applicantPersonalInformation?.maritalStatusId || '')));
        memberAdditionalInfoFormGroup?.get('postalAddress')?.setValue(applicant.applicantPersonalInformation.postalAddress);
        memberAdditionalInfoFormGroup?.get('notEmployedIncomeSource')?.setValue(this.notEmployedIncomeSourceList.find(d => d.id == (applicant?.notEmployedIncomeSourceId || '')));
        memberAdditionalInfoFormGroup.get('notEmployedIncomeAmount')?.setValue(new Amount(applicant.notEmployedIncome));
        memberAdditionalInfoFormGroup?.get('currentAddressYear')?.setValue(applicant.applicantPersonalInformation.currentAddressFromYear);
        memberAdditionalInfoFormGroup?.get('currentAddressMonth')?.setValue(this.monthList.find(d => applicant?.applicantPersonalInformation?.currentAddressFromMonth == d.name));
        memberAdditionalInfoFormGroup?.get('previousAddressYearFrom')?.setValue(applicant.applicantPersonalInformation.previousAddressFromYear);
        memberAdditionalInfoFormGroup?.get('previousAddressYearTo')?.setValue(applicant.applicantPersonalInformation.previousAddressToYear);
        memberAdditionalInfoFormGroup?.get('previousAddressMonthFrom')?.setValue(this.monthList.find(d => applicant?.applicantPersonalInformation?.previousAddressFromMonth == d.name));
        memberAdditionalInfoFormGroup?.get('previousAddressMonthTo')?.setValue(this.monthList.find(d => applicant?.applicantPersonalInformation?.previousAddressToMonth == d.name));
        memberAdditionalInfoFormGroup.get('occupation')?.setValue(this.occupationList.find(d => d.id == applicant?.occupationId));
        memberAdditionalInfoFormGroup.get('onProbation')?.setValue(applicant.onProbation);
        memberAdditionalInfoFormGroup.get('probationPeriod')?.setValue(applicant.probationPeriod);
        memberAdditionalInfoFormGroup.get('previousEmployerYearFrom')?.setValue(applicant.previousEmployerYearFrom);
        memberAdditionalInfoFormGroup.get('previousEmployerMonthFrom')?.setValue(this.monthList.find(d => d.name==applicant?.previousEmployerMonthFrom));
        memberAdditionalInfoFormGroup.get('previousEmployerYearTo')?.setValue(applicant.previousEmployerYearTo);
        memberAdditionalInfoFormGroup.get('previousEmployerMonthTo')?.setValue(this.monthList.find(d => d.name==applicant?.previousEmployerMonthTo));
        memberAdditionalInfoFormGroup.get('previousEmployerOccupation')?.setValue(this.occupationList.find(d => d.id==applicant?.previousEmployerOccupationId));
        memberAdditionalInfoFormGroup.get('previousEmployerEmploymentType')?.setValue(this.employmentTypeList.find(d => d.id == applicant?.previousEmployerEmploymentTypeId));
        memberAdditionalInfoFormGroup.get('previousEmployerPaygStatus')?.setValue(this.paygStatusList.find(d => d.id==applicant?.previousEmployerPaygStatusId));
        memberAdditionalInfoFormGroup.get('previousEmployerName')?.setValue(applicant.previousEmployerName);
        memberAdditionalInfoFormGroup.get('previousEmployerAbn')?.setValue(applicant.previousEmployerAbn);
        memberAdditionalInfoFormGroup.get('numberOfDependants')?.setValue(applicant.applicantPersonalInformation.numberOfDependants);

        let incomeList = this.getFormArray(memberAdditionalInfoFormGroup, 'incomeList');
        let j = 0;
        applicant.applicantIncomeList?.sort((a,b) => a.id.localeCompare(b.id))?.forEach(applicantIncome => {
          let incomeFormGroup = incomeList.at(j);
          if (!incomeFormGroup) {
            this.addAnotherIncome(i);
            incomeFormGroup = incomeList.at(j);
          }
          if (incomeFormGroup) {
            incomeFormGroup.get('id')?.setValue(applicantIncome.id);
            incomeFormGroup.get('amount')?.setValue(new Amount(applicantIncome.amount));
            incomeFormGroup.get('frequency')?.setValue(this.incomeFrequencyList.find(d => d.id == applicantIncome.frequencyId));
            incomeFormGroup.get('income')?.setValue(this.paygIncomeSourceList.find(d => d.id == applicantIncome.incomeSourceId));
            incomeFormGroup.get('workCarProvided')?.setValue(applicantIncome.workCarProvided);
          }
          j++;

        });

        memberAdditionalInfoFormGroup.get('entityType')?.setValue(this.entityTypeList.find(d => d.id == applicant?.entityTypeId));
        memberAdditionalInfoFormGroup.get('businessActivity')?.setValue(applicant.businessActivity);
        if (applicant.businessStartDate) {
          memberAdditionalInfoFormGroup.get('businessStartDate')?.setValue(applicant.businessStartDate);
        }
        memberAdditionalInfoFormGroup.get('netProfit')?.setValue(new Amount(applicant.netProfit));
        memberAdditionalInfoFormGroup.get('abnormalExpenses')?.setValue(new Amount(applicant.abnormalExpenses));
        memberAdditionalInfoFormGroup.get('abnormalIncome')?.setValue(new Amount(applicant.abnormalIncome));
        memberAdditionalInfoFormGroup.get('otherIncome')?.setValue(new Amount(applicant.otherIncome));
        memberAdditionalInfoFormGroup.get('trustDistribution')?.setValue(new Amount(applicant.trustDistribution));
        let addBackList = this.getFormArray(memberAdditionalInfoFormGroup, 'addBacksList');
        j = 0;
        applicant.applicantAddBackList?.sort((a,b) => a.id.localeCompare(b.id))?.forEach(applicantAddBack => {
          let addBackFormGroup = addBackList.at(j);
          if (!addBackFormGroup) {
            this.addAddBacksIncome(i);
            addBackFormGroup = addBackList.at(j);
          }
          addBackFormGroup.get('id')?.setValue(applicantAddBack.id);
          addBackFormGroup.get('amount')?.setValue(new Amount(applicantAddBack.amount));
          addBackFormGroup.get('income')?.setValue(this.addBacksIncomeList.find(d => d.id == applicantAddBack.incomeSourceId));
          j++;
        });
        j = 0;
        let applicantSupplementaryIncomeList = this.getFormArray(memberAdditionalInfoFormGroup, 'supplementaryIncomeList');
        applicant.applicantSupplementaryIncomeList?.sort((a,b) => a.id.localeCompare(b.id))?.forEach(applicantSupplementaryIncome => {
          let applicantSupplementaryIncomeFormGroup = applicantSupplementaryIncomeList.at(j);
          if (!applicantSupplementaryIncomeFormGroup) {
            this.addAddSupplementaryIncome(i);
            applicantSupplementaryIncomeFormGroup = applicantSupplementaryIncomeList.at(j);
          }
          if (applicantSupplementaryIncomeFormGroup) {
            applicantSupplementaryIncomeFormGroup.get('id')?.setValue(applicantSupplementaryIncome.id);
            applicantSupplementaryIncomeFormGroup.get('amount')?.setValue(new Amount(applicantSupplementaryIncome.amount));
            applicantSupplementaryIncomeFormGroup.get('income')?.setValue(this.supplementaryIncomeList.find(d => d.id == applicantSupplementaryIncome.incomeSourceId));
          }
          j++;
        });
        let otherJobList = this.getFormArray(memberAdditionalInfoFormGroup, 'secondJobList');
        applicant.otherJobList?.sort((a,b) => a.id.localeCompare(b.id))?.forEach(otherJob => {
          let otherJobFormGroup = otherJobList.at(j);
          if (!otherJobFormGroup) {
            this.addSecondJob(i);
            otherJobFormGroup = otherJobList.at(j);
          }
          otherJobFormGroup.get('id')?.setValue(otherJob.id);
          otherJobFormGroup.get('employmentType')?.setValue(this.employmentTypeList.find(d => d.id==otherJob.employmentTypeId));
          otherJobFormGroup.get('occupation')?.setValue(this.occupationList.find(d => d.id==otherJob.occupationId));
          otherJobFormGroup.get('employmentStatus')?.setValue(this.paygStatusList.find(d => d.id==otherJob.paygStatusId));
          otherJobFormGroup.get('employerName')?.setValue(otherJob.employerName);
          otherJobFormGroup.get('employerAbn')?.setValue(otherJob.employerAbn);
          otherJobFormGroup.get('onProbation')?.setValue(otherJob.onProbation);
          otherJobFormGroup.get('probationPeriod')?.setValue(otherJob.probationPeriod);
          otherJobFormGroup.get('paygStartDate')?.setValue(otherJob.paygStartDate);
          let otherJobIncomeList = this.getFormArray(otherJobFormGroup, 'incomeList');
          let k = 0;
          otherJob.otherJobIncomeList?.forEach(otherJobIncome => {
            let incomeFormGroup = otherJobIncomeList.at(k);
            if (!incomeFormGroup) {
              this.addAnotherSecondJobIncome(i, j);
              incomeFormGroup = otherJobIncomeList.at(k);
            }
            incomeFormGroup.get('id')?.setValue(otherJobIncome.id);
            incomeFormGroup.get('amount')?.setValue(new Amount(otherJobIncome.amount));
            incomeFormGroup.get('frequency')?.setValue(this.incomeFrequencyList.find(d => d.id == otherJobIncome.frequencyId));
            incomeFormGroup.get('income')?.setValue(this.paygIncomeSourceList.find(d => d.id == otherJobIncome.incomeSourceId));
            incomeFormGroup.get('workCarProvided')?.setValue(otherJobIncome.workCarProvided);
            k++;
          });
          otherJobFormGroup.get('previousEmployerName')?.setValue(otherJob.previousEmployerName);
          otherJobFormGroup.get('previousEmployerAbn')?.setValue(otherJob.previousEmployerAbn);
          otherJobFormGroup.get('previousEmployerEmploymentType')?.setValue(this.employmentTypeList.find(d => d.id==otherJob.previousEmployerEmploymentTypeId));
          otherJobFormGroup.get('previousEmployerYearFrom')?.setValue(otherJob.previousEmployerYearFrom);
          otherJobFormGroup.get('previousEmployerStatus')?.setValue(this.paygStatusList.find(d => d.id==otherJob.previousEmployerStatusId));
          otherJobFormGroup.get('previousEmployerMonthFrom')?.setValue(this.monthList.find(d => d.name ==otherJob.previousEmployerMonthFrom));
          otherJobFormGroup.get('previousEmployerYearTo')?.setValue(otherJob.previousEmployerYearTo);
          otherJobFormGroup.get('previousEmployerMonthTo')?.setValue(this.monthList.find(d => d.name ==otherJob.previousEmployerMonthTo));
          otherJobFormGroup.get('previousEmployerOccupation')?.setValue(this.occupationList.find(d => d.id==otherJob?.previousEmployerOccupationId));

          j++;
        });
        memberAdditionalInfoFormGroup.get('previousAddress')?.setValue(applicant?.applicantPersonalInformation?.addressList?.find(d => d.isCurrent==false))
      }
    }
  }
  updateMemberFormGroupOccupation() {
    for (let i = 0; i < this.additionalPersonalInformationMemberList.length; i++) {
      let memberAdditionalInfoFormGroup = this.additionalPersonalInformationMemberList.at(i);
      let applicant = this.currentLoanApplication?.applicantList?.find(d => d.id == memberAdditionalInfoFormGroup.get('applicantId')?.value);
      if (applicant) {
        memberAdditionalInfoFormGroup.get('occupation')?.setValue(this.occupationList.find(d => d.id == applicant?.occupationId));
      }
    }
  }

}
