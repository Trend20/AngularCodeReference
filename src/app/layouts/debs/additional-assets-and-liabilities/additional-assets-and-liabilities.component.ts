import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DebsDataService } from '../services/debs-data.service';
import { MatDialog} from '@angular/material/dialog';
import {PlaceAddress} from "../models/PlaceAddress";
import {ServiceAbilityService} from "../services/service-ability.service";
import { Amount } from '../../shared/currency/currency.component';
import {FinancialInstitution, FinancialInstitutionService} from "../services/financial-institution.service";
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AddExpenseTypeDialogComponent } from './add-expense-type-dialog/add-expense-type-dialog.component';
import {AssetType, AssetTypeService} from "../services/asset-type.service";
import {Frequency, FrequencyService} from "../services/frequency.service";
import {ApplicantAssetType, ApplicantAssetTypeService} from "../services/applicant-asset-type.service";
import {
  ApplicantOtherLiabilityType,
  ApplicantOtherLiabilityTypeService
} from "../services/applicant-other-liability-type.service";
import {ApplicantExpenseType, ApplicantExpenseTypeService} from "../services/applicant-expense-type.service";
import {AddressService} from "../services/address.service";
import {LoanApplication} from "../models/loan-application.model";
import {AdditionalAssetLiabilityService} from "../services/additional-asset-liability.service";
import {ApplicantPersonalInformation} from "../models/applicant-personal-information.model";
import {ADDITIONAL_ASSET_LIABILITY} from "../../../../environments/environment";
import {defKSUID32} from "@thi.ng/ksuid";

@Component({
  selector: 'additional-assets-and-liabilities',
  templateUrl: './additional-assets-and-liabilities.component.html',
  styleUrls: ['./additional-assets-and-liabilities.component.css']
})
export class AdditionalAssetsAndLiabilitiesComponent implements OnInit, OnChanges {
  currentLoanApplication: LoanApplication | undefined;
  currentLoanApplicationId: string | undefined;

  @Input()
  memberNames !: ApplicantPersonalInformation[];

  financialInstitutionList: FinancialInstitution[] = [];

  // @Input()
  smsfRealEstateList?: any[] = [];

  additionalALFormGroup !: FormGroup;

  frequencyList: Frequency[] = [];
  assetTypeList: AssetType[] = []
  applicantAssetTypeList: ApplicantAssetType[] = []
  applicantOtherLiabilityTypeList: ApplicantOtherLiabilityType[] = []
  placeAddress =  [new PlaceAddress()];

  // Assets
  realEstateAssetsFormArray !: FormArray;
  savingsAndInvestmentsFormArray !: FormArray;
  superannuationFormGroup !: FormGroup;
  otherAssetsFormArray !: FormArray;

  // Liabilities
  realEstateLiabilitiesFormArray !: FormArray;
  personalLoansBankFacilitiesOverdraftsFormGroup !: FormGroup;
  creditCardsStoreCardsFormGroup !: FormGroup;
  hirePurchaseLeasesFormGroup !: FormGroup;
  otherLiabilitiesFormGroup !: FormGroup;

  // Expenses
  expensesFormArray !: FormArray;

  displayedExpenseColumns = ['Category', 'Amount', 'Frequency'];
  applicantExpenseTypeList: ApplicantExpenseType[] = []
  dataSource: MatTableDataSource<ApplicantExpenseType>  = new MatTableDataSource(this.applicantExpenseTypeList);

  @ViewChild(MatSort) sort !: MatSort;


  constructor(private fb: FormBuilder, private dialog: MatDialog, private financialInstitutionService: FinancialInstitutionService, private dataService: DebsDataService,
    private serviceAbilityService: ServiceAbilityService, private frequencyService: FrequencyService, private assetTypeService: AssetTypeService,
              private applicantAssetTypeService: ApplicantAssetTypeService, private applicantOtherLiabilityTypeService: ApplicantOtherLiabilityTypeService,
              private applicantExpenseTypeService: ApplicantExpenseTypeService, private addressService: AddressService,
              private additionalAssetLiabilityService: AdditionalAssetLiabilityService){
    this.getFrequencyList();
    this.getAssetTypeList();
    this.getApplicantAssetTypeList();
    this.getApplicantOtherLiabilityTypeList();
    this.getApplicantExpenseTypeList();
  }


  ngOnChanges(changes: SimpleChanges): void {
    // this.realEstateAddresses?.forEach(value => {
    //   console.warn(JSON.stringify(value))
    // })
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    this.additionalALFormGroup = this.fb.group({
      pageName: ADDITIONAL_ASSET_LIABILITY,
      realEstateAssetsFormArray: this.fb.array([this.buildRealEstateAssets()]),
      savingsAndInvestmentsFormArray: this.fb.array([this.buildSavingsAndInvestmentFormGroup()]),
      superannuationFormGroup: this.buildSuperannuationFormGroup(),
      otherAssetsFormArray: this.fb.array([this.buildOtherAssetFormGroup()]),
      realEstateLiabilitiesFormArray : this.fb.array([this.buildRealEstateLiabilityFormGroup()]),
      personalLoansBankFacilitiesOverdraftsFormGroup: this.buildPersonalLoansBankFacilitiesOverdraftsFormGroup(),
      creditCardsStoreCardsFormGroup: this.buildCreditCardsStoreCardsFormGroup(),
      hirePurchaseLeasesFormGroup: this.buildHirePurchaseLeasesFormGroup(),
      otherLiabilitiesFormGroup: this.buildOtherFormGroup(),
      expensesFormArray: this.fb.array([]),
      totalLiabilities: ['', Validators.required],
      totalAssets: ['', Validators.required],
      realEstate:[]
    });

    this.realEstateAssetsFormArray = (this.additionalALFormGroup.get('realEstateAssetsFormArray') as FormArray);
    this.savingsAndInvestmentsFormArray = (this.additionalALFormGroup.get('savingsAndInvestmentsFormArray') as FormArray);
    this.superannuationFormGroup = (this.additionalALFormGroup.get('superannuationFormGroup') as FormGroup);
    this.otherAssetsFormArray = (this.additionalALFormGroup.get('otherAssetsFormArray') as FormArray);
    this.realEstateLiabilitiesFormArray = (this.additionalALFormGroup.get('realEstateLiabilitiesFormArray') as FormArray);
    this.personalLoansBankFacilitiesOverdraftsFormGroup = (this.additionalALFormGroup.get('personalLoansBankFacilitiesOverdraftsFormGroup') as FormGroup);
    this.creditCardsStoreCardsFormGroup = (this.additionalALFormGroup.get('creditCardsStoreCardsFormGroup') as FormGroup);
    this.hirePurchaseLeasesFormGroup = (this.additionalALFormGroup.get('hirePurchaseLeasesFormGroup') as FormGroup);
    this.otherLiabilitiesFormGroup = (this.additionalALFormGroup.get('otherLiabilitiesFormGroup') as FormGroup);
    this.expensesFormArray = (this.additionalALFormGroup.get('expensesFormArray') as FormArray);

    // this.applicantExpenseTypeList.forEach(data => {
    //   this.expensesFormArray.push(this.buildExpensesFormGroup(data.description));
    // })

    this.additionalALFormGroup.setControl('expensesFormArray', this.expensesFormArray);

    this.financialInstitutionService.financialInstitutionList.subscribe(response =>{
      this.financialInstitutionList = response;
    });

    this.serviceAbilityService.propertyAddress.subscribe(response => {
      this.realEstateAssetsFormArray?.at(0)?.get('address')?.patchValue(response, {emitEvent: false});
      this.placeAddress = [];
      this.placeAddress.push(response);
      this.searchRealEstate(this.realEstateAssetsFormArray?.at(0), response);
    });
    this.serviceAbilityService.currentLoanApplication.subscribe(response => {
      this.currentLoanApplication = response;
      this.updateValues();
    });
    this.serviceAbilityService.currentLoanApplicationId.subscribe(response => {
      this.currentLoanApplicationId = response;
    });
  }

  buildSavingsAndInvestmentFormGroup() : FormGroup {
    let formGroup: FormGroup = this.fb.group({
      id: [''],
      financialAssetType: ['', Validators.required],
      otherFinancialAsset: [''],
      financialInstitution: ['', Validators.required],
      currentBalance: ['', Validators.required],
      ownership: ['', Validators.required]
    });

    formGroup.get('financialAssetType')?.valueChanges?.subscribe( newValue => {
      this.updateFormControlsOnFinancialAssetTypeChange(newValue, formGroup);
    })

    formGroup.get('currentBalance')?.valueChanges.subscribe(() => {
      this.calculateTotalAssets();
    })

    return formGroup;
  }

  updateFormControlsOnFinancialAssetTypeChange(assetType: string, formGroup: FormGroup){
    this.updateFormControl(assetType === 'Other', 'otherFinancialAsset', formGroup);
    this.updateFormControl(assetType != 'Other', 'financialInstitution', formGroup);
  }

  updateFormControl(activateRequired: Boolean = true, controlName: string, formGroup: FormGroup) {
    if (activateRequired) {
      formGroup.get(controlName)?.setValidators(Validators.required);
    } else {
      formGroup.get(controlName)?.setValidators([]);
    }

    formGroup.setControl(controlName, <AbstractControl>formGroup.get(controlName));

    this.additionalALFormGroup.setControl('savingsAndInvestmentsFormArray', this.savingsAndInvestmentsFormArray);
    this.additionalALFormGroup.setControl('otherAssetsFormArray', this.otherAssetsFormArray);
  }

  buildRealEstateAssets(): FormGroup{
    let formGroup: FormGroup = this.fb.group({
      id: [defKSUID32().next()],
      address: ['', Validators.required],
      valueOfProperty: ['', Validators.required],
      rentalAmount: ['', Validators.required],
      rentalFrequency: ['', Validators.required],
      ownership: ['', Validators.required]
    })

    formGroup.get('valueOfProperty')?.valueChanges?.subscribe(_ => {
      this.calculateTotalAssets();
    })

    return formGroup;
  }


  // buildSavingsAndInvestmentsFormGroup(): FormGroup{
  //   return this.fb.group({
  //     financialAssetType: ['', Validators.required],
  //     financialInstitution: ['', Validators.required],
  //     currentBalance: ['', Validators.required],
  //     ownership: ['', Validators.required]
  //   });
  // }

  buildSuperannuationFormGroup(): FormGroup {
    let formGroup: FormGroup = this.fb.group({
      id: [defKSUID32().next()],
      fundManagerName: ['', Validators.required],
      currentBalance: ['', Validators.required],
      ownership: ['', Validators.required]
    })

    formGroup.get('currentBalance')?.valueChanges?.subscribe(_ => {
      this.calculateTotalAssets();
    })

    return formGroup;
  }

  buildOtherAssetFormGroup(): FormGroup {
    let formGroup = this.fb.group({
      id: [defKSUID32().next()],
      financialAssetType: ['', Validators.required],
      otherFinancialAsset: [''],
      financialInstitution: ['', Validators.required],
      currentBalance: ['', Validators.required],
      ownership: ['', Validators.required]
    })

    formGroup.get('financialAssetType')?.valueChanges?.subscribe( newValue => {
      this.updateFormControlsOnFinancialAssetTypeChange(newValue, formGroup);
    });

    formGroup.get('currentBalance')?.valueChanges?.subscribe(_ => {
      this.calculateTotalAssets()
    })

    return formGroup;
  }

  buildRealEstateLiabilityFormGroup(): FormGroup {
    let formGroup: FormGroup = this.fb.group({
      id: [defKSUID32().next()],
      realEstate: ['', Validators.required],
      lenderName: ['', Validators.required],
      outstandingBalance: ['', Validators.required],
      limit: ['', Validators.required],
      minMonthlyPayment: ['', Validators.required],
      currentInterestRate: ['', Validators.required],
      remainingTermOutstanding: ['', Validators.required]
    })

    formGroup.get('outstandingBalance')?.valueChanges?.subscribe(_ => {
      this.calculateTotalLiabilities()
    })

    return formGroup;
  }

  buildPersonalLoansBankFacilitiesOverdraftsFormGroup(): FormGroup {
    let formGroup: FormGroup = this.fb.group({
      id: [defKSUID32().next()],
      lenderName: ['', Validators.required],
      outstandingBalance: ['', Validators.required],
      limit: ['', Validators.required],
      minMonthlyPayment: ['', Validators.required],
    });

    formGroup.get('outstandingBalance')?.valueChanges?.subscribe(_ => {
      this.calculateTotalLiabilities();
    })

    return formGroup;
  }

  buildCreditCardsStoreCardsFormGroup(): FormGroup {
    let formGroup: FormGroup = this.fb.group({
      id: [defKSUID32().next()],
      lenderName: ['', Validators.required],
      outstandingBalance: ['', Validators.required],
      limit: ['', Validators.required],
      minMonthlyPayment: ['', Validators.required],
    });

    formGroup.get('outstandingBalance')?.valueChanges?.subscribe(_ => {
      this.calculateTotalLiabilities();
    })

    return formGroup;
  }

  buildHirePurchaseLeasesFormGroup(): FormGroup {
    let formGroup: FormGroup = this.fb.group({
      id: [defKSUID32().next()],
      lenderName: ['', Validators.required],
      outstandingBalance: ['', Validators.required],
      minMonthlyPayment: ['', Validators.required],
    });

    formGroup.get('outstandingBalance')?.valueChanges?.subscribe(_ => {
      this.calculateTotalLiabilities();
    })

    return formGroup;
  }

  buildOtherFormGroup(): FormGroup {
    let formGroup: FormGroup = this.fb.group({
      id: [defKSUID32().next()],
      otherLiabilityType: ['', Validators.required],
      outstandingBalance: ['', Validators.required],
      minMonthlyPayment: ['', Validators.required],
    });

    formGroup.get('outstandingBalance')?.valueChanges?.subscribe(_ => {
      this.calculateTotalLiabilities();
    });

    return formGroup;
  }

  buildExpensesFormGroup(applicantExpenseType: ApplicantExpenseType): FormGroup {
    return this.fb.group({
      amount: ['', Validators.required],
      frequency: ['', Validators.required],
      expenseTypeId: [applicantExpenseType.id]
    });
  }

  addAnotherProperty() {
    this.realEstateAssetsFormArray.push(this.buildRealEstateAssets())
    this.additionalALFormGroup.setControl('realEstateAssetsFormArray', this.realEstateAssetsFormArray);
  }

  addSavingsAndInvestment(){
    this.savingsAndInvestmentsFormArray.push(this.buildSavingsAndInvestmentFormGroup());
    this.additionalALFormGroup.setControl('savingsAndInvestmentsFormArray', this.savingsAndInvestmentsFormArray);
  }

  addOtherAssetType(){
    this.otherAssetsFormArray.push(this.buildOtherAssetFormGroup())
    this.additionalALFormGroup.setControl('otherAssetsFormArray', this.otherAssetsFormArray);
  }

  addAnotherLiability(){
    this.realEstateLiabilitiesFormArray.push(this.buildRealEstateLiabilityFormGroup());
    this.additionalALFormGroup.setControl('realEstateLiabilitiesFormArray', this.realEstateLiabilitiesFormArray);
  }

  addAnotherExpense(){
    const dialogRef = this.dialog.open(AddExpenseTypeDialogComponent, {
      width: '450px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        // push to array
        this.expensesFormArray.push(this.buildExpensesFormGroup(result?.category));
        this.additionalALFormGroup.setControl('expensesFormArray', this.expensesFormArray);
        // expenses.push(result);
        // this.applicantExpenseTypeList.push(result);
        // this.dataSource = new MatTableDataSource(this.applicantExpenseTypeList);
        // this.dataSource = new MatTableDataSource<Expenses>(expenses);
      }
    })
  }

  setPlaceAddress(realEstateGroup: AbstractControl, placeAddress: PlaceAddress) {
    (realEstateGroup as FormGroup).get('address')?.patchValue(placeAddress, {emitEvent: false} );
    this.searchRealEstate(realEstateGroup, placeAddress);
  }

  searchRealEstate(realEstateGroup: AbstractControl, placeAddress: PlaceAddress) {
    let addressValue = this.addressService.getSearchAddress(placeAddress)
    if (addressValue.length > 2) {
      this.dataService.coreLogicSearch(addressValue).subscribe(response => {
        let realEstate = this.dataService.parseCoreLogicData(response.data);
        let price = realEstate?.price
        if (price) {
          (realEstateGroup as FormGroup)?.get('valueOfProperty')?.setValue(new Amount(parseInt(price || '')));
        }
        // let rentFrequency = realEstate.rentFrequency?.trim();
        // if (rentFrequency && rentFrequency.length > 1) {
        //   let frequencyValue = this.frequencyList.find(d => d.name == rentFrequency);
        //   console.log('frequencyValue', rentFrequency);
        //   console.log('Found frequencyValue', frequencyValue);
        //   if (frequencyValue) {
        //     (realEstateGroup as FormGroup)?.get('rentalFrequency')?.setValue(frequencyValue);
        //   }
        // }
      }, error => {
        console.error(JSON.stringify(error));
      });
    }
  }

  calculateTotalAssets(){
    let realEstates: number = this.realEstateAssetsFormArray.getRawValue().reduce((n, {valueOfProperty}) => n + (parseFloat(valueOfProperty?.amount)), 0) | 0;
    let savingsAndInvestments: number = this.savingsAndInvestmentsFormArray.getRawValue().reduce((n, {currentBalance}) => n + (parseInt(currentBalance?.amount)), 0) | 0;
    let superannuationTotal: number = this.superannuationFormGroup.get('currentBalance')?.value?.amount | 0;
    let otherAssets: number = this.otherAssetsFormArray.getRawValue().reduce((n, {currentBalance}) => n + (parseFloat(currentBalance?.amount)), 0) | 0;
    let total: number = realEstates + savingsAndInvestments + superannuationTotal + otherAssets;
    this.additionalALFormGroup.get('totalAssets')?.setValue(new Amount(total))
  }

  calculateTotalLiabilities() {
    let realEstateLiability: number = this.realEstateLiabilitiesFormArray.getRawValue().reduce((n, {outstandingBalance}) => n + (parseFloat(outstandingBalance?.amount)), 0) | 0;
    let personalLoans: number = this.personalLoansBankFacilitiesOverdraftsFormGroup.get('outstandingBalance')?.value?.amount | 0;
    let creditCards: number = this.creditCardsStoreCardsFormGroup.get('outstandingBalance')?.value?.amount | 0;
    let hirePurchases: number = this.hirePurchaseLeasesFormGroup.get('outstandingBalance')?.value?.amount | 0;
    let otherLiabilities: number = this.otherLiabilitiesFormGroup.get('outstandingBalance')?.value?.amount | 0;
    let total: number = realEstateLiability + personalLoans + creditCards + hirePurchases + otherLiabilities;
    this.additionalALFormGroup.get('totalLiabilities')?.setValue(new Amount(total));
  }

  // uicheck() {
  //   Object.keys(this.form.controls).forEach(key => {
  //     console.log(key + ' validity = ' + this.form.get(key)?.valid);
  // });
  // }
  getFrequencyList() {
    this.frequencyService.frequencyList.subscribe((response) => {
      this.frequencyList = response;
    });
  }
  getAssetTypeList() {
    this.assetTypeService.assetTypeList.subscribe((response) => {
      this.assetTypeList = response;
    });
  }
  getApplicantAssetTypeList() {
    this.applicantAssetTypeService.searchApplicantAssetType().subscribe((response) => {
      this.applicantAssetTypeList = response.content;
    });
  }
  getApplicantOtherLiabilityTypeList() {
    this.applicantOtherLiabilityTypeService.searchApplicantOtherLiabilityType().subscribe((response) => {
      this.applicantOtherLiabilityTypeList = response.content;
    });
  }
  getApplicantExpenseTypeList() {
    this.applicantExpenseTypeService.searchApplicantExpenseType().subscribe((response) => {
      this.applicantExpenseTypeList = response.content;
      this.dataSource = new MatTableDataSource<ApplicantExpenseType>(this.applicantExpenseTypeList);
      this.applicantExpenseTypeList.forEach(data => {
        this.expensesFormArray.push(this.buildExpensesFormGroup(data));
      });
      this.updateExpenses();
    });
  }
  saveData() {
    if (this.additionalALFormGroup.valid) {
      let additionalAssetLiability = this.additionalAssetLiabilityService.formatData(this.additionalALFormGroup.value);
      additionalAssetLiability.loanApplicationId = this.currentLoanApplicationId;
      this.additionalAssetLiabilityService.save(additionalAssetLiability).subscribe(() => {
      });
    }
  }
  getFormValidationErrors() {
    console.log('additionalPersonalInformationFormGroup valid?',this.additionalALFormGroup.valid)
    Object.keys(this.additionalALFormGroup.controls).forEach(key => {
      const controlErrors = this.additionalALFormGroup.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          if (controlErrors) {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          }
        });
      }
    });
    this.expensesFormArray.controls.forEach(da => {
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

  updateValues() {
    this.smsfRealEstateList = this.currentLoanApplication?.smsfRealEstateList;
    let i = 0;
    this.currentLoanApplication?.applicantRealEstateList?.sort((a,b) => a.id.localeCompare(b.id))?.forEach(applicantRealEstate => {
      let realEstateFormGroup = this.realEstateAssetsFormArray.at(i);
      if (!realEstateFormGroup) {
        this.addAnotherProperty();
        realEstateFormGroup = this.realEstateAssetsFormArray.at(i);
      }
      realEstateFormGroup?.get('id')?.setValue(applicantRealEstate.id);
      realEstateFormGroup?.get('address')?.setValue(applicantRealEstate.applicantRealEstateAddress);
      realEstateFormGroup?.get('valueOfProperty')?.setValue(new Amount(applicantRealEstate.valueOfProperty));
      realEstateFormGroup?.get('rentalAmount')?.setValue(new Amount(applicantRealEstate.rentalAmount));
      realEstateFormGroup?.get('rentalFrequency')?.setValue(this.frequencyList.find(d => d.id == applicantRealEstate?.rentFrequencyId));
      realEstateFormGroup.get('ownership')?.setValue(applicantRealEstate.applicantRealEstateOwnershipList);
      i++;
    });
    i = 0;
    this.currentLoanApplication?.applicantSavingAndInvestmentList?.sort((a,b) => a.id.localeCompare(b.id))?.forEach(applicantSavingInvestment => {
      let savingInvestmentFormGroup = this.savingsAndInvestmentsFormArray.at(i);
      if (!savingInvestmentFormGroup) {
        this.addSavingsAndInvestment();
        savingInvestmentFormGroup = this.savingsAndInvestmentsFormArray.at(i);
      }
      savingInvestmentFormGroup?.get('id')?.setValue(applicantSavingInvestment.id);
      savingInvestmentFormGroup?.get('otherFinancialAsset')?.setValue(applicantSavingInvestment.otherFinancialAsset);
      savingInvestmentFormGroup?.get('currentBalance')?.setValue(new Amount(applicantSavingInvestment.currentBalance));
      savingInvestmentFormGroup?.get('financialAssetType')?.setValue(this.assetTypeList.find(d => d.id == applicantSavingInvestment?.financialAssetTypeId));
      savingInvestmentFormGroup?.get('financialInstitution')?.setValue(this.financialInstitutionList.find(d => d.id == applicantSavingInvestment?.financialInstitutionId));
      savingInvestmentFormGroup.get('ownership')?.setValue(applicantSavingInvestment.applicantSavingInvestmentOwnershipList);
      i++;
    });
    i = 0;
    this.currentLoanApplication?.applicantOtherAssetList?.sort((a,b) => a.id.localeCompare(b.id))?.forEach(applicantOtherAsset => {
      let otherAssetFormGroup = this.otherAssetsFormArray.at(i);
      if (!otherAssetFormGroup) {
        this.addOtherAssetType()
        otherAssetFormGroup = this.otherAssetsFormArray.at(i);
      }
      otherAssetFormGroup?.get('id')?.setValue(applicantOtherAsset.id);
      otherAssetFormGroup?.get('financialAssetType')?.setValue(this.applicantAssetTypeList.find(d => d.id == applicantOtherAsset?.assetTypeId));
      otherAssetFormGroup?.get('otherFinancialAsset')?.setValue(applicantOtherAsset.otherFinancialAsset);
      otherAssetFormGroup?.get('financialInstitution')?.setValue(this.financialInstitutionList.find(d => d.id == applicantOtherAsset?.financialInstitutionId));
      otherAssetFormGroup?.get('currentBalance')?.setValue(new Amount(applicantOtherAsset.currentBalance));
      otherAssetFormGroup.get('ownership')?.setValue(applicantOtherAsset.applicantOtherAssetOwnershipList);
      i++;
    });

    let applicantSuperannuation = this.currentLoanApplication?.applicantSuperannuation;
    if (applicantSuperannuation) {
      this.superannuationFormGroup.get('id')?.setValue(applicantSuperannuation.id);
      this.superannuationFormGroup.get('fundManagerName')?.setValue(applicantSuperannuation.fundManagerName);
      this.superannuationFormGroup.get('currentBalance')?.setValue(new Amount(applicantSuperannuation.currentBalance));
      this.superannuationFormGroup.get('ownership')?.setValue(applicantSuperannuation.applicantSuperannuationOwnershipList);
    }
    let applicantPersonalLoan = this.currentLoanApplication?.applicantPersonalLoan;
    if (applicantPersonalLoan) {
      this.personalLoansBankFacilitiesOverdraftsFormGroup.get('id')?.setValue(applicantPersonalLoan.id);
      this.updatePersonalLoanLenderName()
      this.personalLoansBankFacilitiesOverdraftsFormGroup.get('outstandingBalance')?.setValue(new Amount(applicantPersonalLoan.outstandingBalance));
      this.personalLoansBankFacilitiesOverdraftsFormGroup.get('limit')?.setValue(new Amount(applicantPersonalLoan.limitValue));
      this.personalLoansBankFacilitiesOverdraftsFormGroup.get('minMonthlyPayment')?.setValue(new Amount(applicantPersonalLoan.minMonthlyPayment));
    }
    let applicantCreditStoreCard = this.currentLoanApplication?.applicantCreditStoreCard;
    if (applicantCreditStoreCard) {
      this.creditCardsStoreCardsFormGroup.get('id')?.setValue(applicantCreditStoreCard.id);
      this.updatePersonalLoanLenderName();
      this.creditCardsStoreCardsFormGroup.get('outstandingBalance')?.setValue(new Amount(applicantCreditStoreCard.outstandingBalance));
      this.creditCardsStoreCardsFormGroup.get('limit')?.setValue(new Amount(applicantCreditStoreCard.limitValue));
      this.creditCardsStoreCardsFormGroup.get('minMonthlyPayment')?.setValue(new Amount(applicantCreditStoreCard.minMonthlyPayment));
    }
    let applicantHirePurchaseLease = this.currentLoanApplication?.applicantHirePurchaseLease;
    if (applicantHirePurchaseLease) {
      this.hirePurchaseLeasesFormGroup.get('id')?.setValue(applicantHirePurchaseLease.id);
      this.hirePurchaseLeasesFormGroup.get('outstandingBalance')?.setValue(new Amount(applicantHirePurchaseLease.outstandingBalance));
      this.hirePurchaseLeasesFormGroup.get('limit')?.setValue(new Amount(applicantHirePurchaseLease.limitValue));
      this.hirePurchaseLeasesFormGroup.get('minMonthlyPayment')?.setValue(new Amount(applicantHirePurchaseLease.minMonthlyPayment));
    }

    let applicantOtherLiability = this.currentLoanApplication?.applicantOtherLiability;
    if (applicantOtherLiability) {
      this.otherLiabilitiesFormGroup.get('id')?.setValue(applicantOtherLiability.id);
      this.otherLiabilitiesFormGroup.get('otherLiabilityType')?.setValue(this.applicantOtherLiabilityTypeList.find(d => d.id == applicantOtherLiability?.otherLiabilityTypeId));
      this.otherLiabilitiesFormGroup.get('outstandingBalance')?.setValue(new Amount(applicantOtherLiability.outstandingBalance));
      this.otherLiabilitiesFormGroup.get('minMonthlyPayment')?.setValue(new Amount(applicantOtherLiability.minMonthlyPayment));
    }
    i = 0;
    this.currentLoanApplication?.smsfRealEstateList?.forEach(smsfRealEstate => {
      smsfRealEstate.smsfRealEstateLiabilityList?.sort((a,b) => a.id.localeCompare(b.id))?.forEach(realEstateLiability => {
        let realEstateLiabilityFormGroup = this.realEstateLiabilitiesFormArray.at(i);
        if (!realEstateLiabilityFormGroup) {
          this.addAnotherLiability();
          realEstateLiabilityFormGroup = this.realEstateLiabilitiesFormArray.at(i);
        }
        realEstateLiabilityFormGroup?.get('id')?.setValue(realEstateLiability.id);
        realEstateLiabilityFormGroup?.get('realEstate')?.setValue(this.smsfRealEstateList?.find(d => d.id == smsfRealEstate.id));
        realEstateLiabilityFormGroup?.get('lenderName')?.setValue(this.financialInstitutionList.find(d=> d.id == realEstateLiability.lenderId));
        realEstateLiabilityFormGroup?.get('outstandingBalance')?.setValue(new Amount(realEstateLiability.outstandingBalance));
        realEstateLiabilityFormGroup?.get('limit')?.setValue(new Amount(realEstateLiability.limitValue));
        realEstateLiabilityFormGroup?.get('minMonthlyPayment')?.setValue(new Amount(realEstateLiability.minMonthlyPayment));
        realEstateLiabilityFormGroup?.get('currentInterestRate')?.setValue(realEstateLiability.currentInterestRate);
        realEstateLiabilityFormGroup?.get('remainingTermOutstanding')?.setValue(realEstateLiability.remainingTermOutstanding);
        i++;
      });
    });
    this.updateExpenses();
    this.updateOtherAssetFinancialInstitution();
    this.updateSavingInvestmentFinancialInstitution();
    this.updatePersonalLoanLenderName();
    this.updateStoreCreditCardLenderName();
    this.updateHirePurchaseLeasesFinancialInstitution();
  }
  updateOtherAssetFinancialInstitution() {
    for (let i = 0; i < this.otherAssetsFormArray.length; i++) {
      let savingInvestmentFormGroup = this.otherAssetsFormArray.at(i);
      let applicantOtherAsset = this.currentLoanApplication?.applicantOtherAssetList?.[i];
      if (applicantOtherAsset) {
        savingInvestmentFormGroup?.get('financialInstitution')?.setValue(this.financialInstitutionList.find(d => d.id == applicantOtherAsset?.financialInstitutionId));
      }
    }
  }
  updateHirePurchaseLeasesFinancialInstitution() {
    this.hirePurchaseLeasesFormGroup.get('lenderName')?.setValue(this.financialInstitutionList.find(d => d.id == this.currentLoanApplication?.applicantHirePurchaseLease?.lenderId));
  }

  updateSavingInvestmentFinancialInstitution() {
    for (let i = 0; i < this.savingsAndInvestmentsFormArray.length; i++) {
      let savingInvestmentFormGroup = this.savingsAndInvestmentsFormArray.at(i);
      let applicantSavingInvestment = this.currentLoanApplication?.applicantSavingAndInvestmentList?.[i];
      if (applicantSavingInvestment) {
        savingInvestmentFormGroup?.get('financialInstitution')?.setValue(this.financialInstitutionList.find(d => d.id == applicantSavingInvestment?.financialInstitutionId));
      }
    }
  }

  updateExpenses() {
    for (let i = 0; i < this.expensesFormArray.length; i++) {
      let applicantExpenseFormGroup = this.expensesFormArray.at(i);
      let applicantExpense = this.currentLoanApplication?.applicantExpenseList?.find(d => d.expenseTypeId == applicantExpenseFormGroup.get('expenseTypeId')?.value);
      if (applicantExpense) {
        applicantExpenseFormGroup?.get('frequency')?.setValue(this.frequencyList.find(d => d.id == applicantExpense?.frequencyId));
        applicantExpenseFormGroup?.get('amount')?.setValue(new Amount( applicantExpense?.amount));
      }
    }
  }
  updatePersonalLoanLenderName() {
    this.personalLoansBankFacilitiesOverdraftsFormGroup.get('lenderName')?.setValue(this.financialInstitutionList.find(d => d.id == this.currentLoanApplication?.applicantPersonalLoan?.lenderId));
  }
  updateStoreCreditCardLenderName() {
    this.creditCardsStoreCardsFormGroup.get('lenderName')?.setValue(this.financialInstitutionList.find(d => d.id == this.currentLoanApplication?.applicantCreditStoreCard?.lenderId));
  }

}
