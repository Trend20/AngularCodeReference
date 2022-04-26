import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DebsDataService } from '../services/debs-data.service';
import { isNumeric } from "rxjs/internal-compatibility";
import { HttpUtilService } from '../utils/http-util.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import {PlaceAddress} from "../models/PlaceAddress";
import {ServiceAbilityService} from "../services/service-ability.service";
import { Amount } from '../../shared/currency/currency.component';
import {Expense, ExpenseTypeService} from "../services/expense-type.service";
import {FinancialInstitution, FinancialInstitutionService} from "../services/financial-institution.service";
import {Frequency, FrequencyService} from "../services/frequency.service";
import {AssetType, AssetTypeService} from "../services/asset-type.service";
import {AddressService} from "../services/address.service";
import {LoanApplication} from "../models/loan-application.model";
import {AssetsAndLiabilitiesService} from "../services/assets-and-liabilities.service";
import {defKSUID32} from "@thi.ng/ksuid";
import {ASSET_LIABILITY} from "../../../../environments/environment";
import { BehaviorSubject, Observable, forkJoin} from 'rxjs';
import { LoanDetailService, LoanPage } from '../services/loan-detail.service';
import { DropDownServiceService } from '../services/drop-down-service.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssetAndLiabilitiesPage } from '../models/asset-and-liability-model-revised';
import { ReusableErrorService } from 'src/app/services/reusable-error.service';
@Component({
  selector: 'app-assets-and-liabilities',
  templateUrl: './assets-and-liabilities.component.html',
  styleUrls: ['./assets-and-liabilities.component.css']
})
export class AssetsAndLiabilitiesComponent implements OnInit, AfterViewInit {
  // currentLoanApplication: LoanApplication | undefined;
  currentAssetAndLiabilityPage: AssetAndLiabilitiesPage | undefined;
  currentLoanApplicationId: string | undefined;
  assetLiabilityFormGroup !: FormGroup;
  realEstateList!: FormArray;
  depositPaidList!: FormArray;
  financialAssetList!: FormArray;
  // placeAddress =  [new PlaceAddress()];
  frequencyList: Frequency[] = [];
  financialInstitutionList: FinancialInstitution[] = [];
  assetTypeList: AssetType[] = []
  liabilityList !: FormArray;
  expenseTypeList: Expense[] = [];
  // otherExpenseType: Expense = {id: "other", description: "Other"}
  expenseList !: FormArray;
  dialogRef !: MatDialogRef<ConfirmationDialogComponent>;
  loading = false;
  addressArray: any[] = [];
  selectedAddress: string = '';
  private _updatedLoanPurpose = new BehaviorSubject<string>('');
  @Output() updateWhyCalcFailed: EventEmitter<string> = new EventEmitter;
  @Output() isServiceable: EventEmitter<boolean> = new EventEmitter;
  @Output() isServiceableReason: EventEmitter<string> = new EventEmitter;
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter;
  @Input()
  set updatedLoanPurpose(val: string){this._updatedLoanPurpose.next(val);}
  get updatedLoanPurpose(){return this._updatedLoanPurpose.getValue()}

  private _serviceabilityFormGroup !: FormGroup;
  get serviceabilityFormGroup(): FormGroup {
    return this._serviceabilityFormGroup;
  }

  @Input()
  set serviceabilityFormGroup(value: FormGroup | undefined) {
    if (value) {
      this._serviceabilityFormGroup = value
    }
  }

  private _personalDetailFormGroup !: FormGroup;
  get personalDetailFormGroup(): FormGroup {
    return this._personalDetailFormGroup;
  }

  @Input()
  set personalDetailFormGroup(value: FormGroup | undefined) {
    if (value) {
      this._personalDetailFormGroup = value
    }
  }


  constructor(private dataService: DebsDataService, private formBuilder: FormBuilder, private _snackBar: MatSnackBar,
              private dialog: MatDialog, private httpUtil: HttpUtilService, private serviceAbilityService: ServiceAbilityService,
              private expenseTypeService: ExpenseTypeService, private financialInstitutionService: FinancialInstitutionService,
      private frequencyService: FrequencyService, private assetTypeService: AssetTypeService, private addressService: AddressService,
              private assetsAndLiabilitiesService: AssetsAndLiabilitiesService, private loanDetailService: LoanDetailService, private cdr: ChangeDetectorRef, private dropdownService: DropDownServiceService, private router: Router, private spinner: NgxSpinnerService, private reusableErrorService: ReusableErrorService) { }
  get loanPurpose() : string | null | undefined {
    return this.dataService.loanPurpose;
  }

  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');

  }

  get smsfRealEstateList() : any[] {
    let realEstateList: any[] = [];
    (this.assetLiabilityFormGroup.get('realEstateList') as FormArray).controls.forEach( realEstate => {
      realEstateList.push(realEstate.value);
    })
    return realEstateList;
  }

  checkAssetAndLiabilitiesFormValidity(){
    this.reusableErrorService.openValidationModal(this.assetLiabilityFormGroup);
  }

  ngOnInit(): void {
    // this.spinner.show();
    this.assetLiabilityFormGroup = this.formBuilder.group({
      pageName: ASSET_LIABILITY,
      totalAssets: ['', Validators.required],
      totalLiabilities: [''],
      totalExpenses: ['', Validators.required],
      realEstateList: this.formBuilder.array([]),
      financialAssetList: this.formBuilder.array([]),
      depositPaidList: this.formBuilder.array([]),
      liabilityList: this.formBuilder.array([]),
      expenseList: this.formBuilder.array([this.createExpenseFormGroup()]),
      fullServicingPassed: [true]
    });

    this._updatedLoanPurpose.subscribe(val => {
      let currentArray = this.assetLiabilityFormGroup.get('realEstateList') as FormArray;

      if (currentArray.length == 0 && val == 'Refinance' ) {
        currentArray.push(this.createAssetFormGroup());
      }

    })


    this.realEstateList = this.assetLiabilityFormGroup.get("realEstateList") as FormArray;
    this.financialAssetList = this.assetLiabilityFormGroup.get("financialAssetList") as FormArray;
    this.depositPaidList = this.assetLiabilityFormGroup.get("depositPaidList") as FormArray;
    this.liabilityList = this.assetLiabilityFormGroup.get("liabilityList") as FormArray;
    this.expenseList = this.assetLiabilityFormGroup.get("expenseList") as FormArray;
    this.serviceAbilityService.propertyAddress.subscribe(response => {
      this.realEstateList?.at(0)?.get('address')?.patchValue(response, {emitEvent: false});
       this.searchRealEstate(this.realEstateList?.at(0), response);
    });
    this.assetLiabilityFormGroup.setControl('realEstateList', this.realEstateList);

    this.dropdownService.getAssetAndFrequencyList().subscribe(
      next => {

        console.log(next)
        this.frequencyList = next[0].content;
        this.assetTypeList = next[1].content;
        this.currentAssetAndLiabilityPage = next[2].data;
        this.currentLoanApplicationId = next[3].value;
        this.financialInstitutionList = next[4].content;
        this.expenseTypeList = next[5].content;
        this.updateValues();
        // this.spinner.hide();

      },
      err  => {
        console.log(err)
        // this.spinner.hide();
      }
    )

    // // get loan id
    // let id = this.router.url.split('/').pop();
    // console.log(id)

    // //fetch assets data
    // if (id !== undefined) {
    //   this.loanDetailService.loanDetailJourneyfetch(LoanPage.ASSET_LIABILITY, id ).subscribe(response => {
    //     console.log(response.data);
    //     this.serviceAbilityService.setCurrentAssetLiabilityPageData(response.data);
    //     this.spinner.hide();
    //   })
    // }


    this.serviceAbilityService.currentLoanApplicationId.subscribe(
      (response) => {
        console.log('Assets and LiabilitiesID = ', response);
        this.currentLoanApplicationId = response;
      }
    );

  }

  deleteRealEstate(i: number) {
    this.showConfirmationDialog(`Are you sure you want to delete Real Estate at ${i}?`);
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.realEstateList.removeAt(i);
      this.assetLiabilityFormGroup.setControl("realEstateList", this.realEstateList);
      this.calculateTotalAssets();
      }
    });
  }
  calculateTotalAssets() {

    let assetsTotal : number = 0;
    this.depositPaidList.controls.forEach(formGroup => {
      let depositPaid: number = 0;
      if(isNumeric(formGroup.get('amount')?.value?.amount)) {
        depositPaid = parseInt(formGroup.get('amount')?.value?.amount);
      }
      assetsTotal = (depositPaid + assetsTotal);//<number>formGroup.get('amount')?.value?.amount;  //this.getNumber((formGroup as FormGroup), 'amount')

    });
    this.realEstateList.controls.forEach(formGroup => {
      let realEstateAmount: number = 0;
      if(isNumeric(formGroup.get('amount')?.value?.amount)){
        realEstateAmount = parseInt(formGroup.get('amount')?.value?.amount);
      }
      assetsTotal = (realEstateAmount + assetsTotal);//<number>formGroup.get('amount')?.value?.amount; // this.getNumber((formGroup as FormGroup), 'amount')
    });
    this.financialAssetList.controls.forEach(formGroup => {
      let financialAmount: number = 0;
      if(isNumeric(formGroup.get('currentBalance')?.value?.amount)){
        financialAmount = parseInt(formGroup.get('currentBalance')?.value?.amount);
      }
      assetsTotal = (financialAmount + assetsTotal);//<number>formGroup.get('currentBalance')?.value?.amount;//this.getNumber((formGroup as FormGroup), 'currentBalance')
    });
    this.assetLiabilityFormGroup.get('totalAssets')?.setValue(new Amount(assetsTotal));
  }

  addAsset() {
    this.realEstateList = this.assetLiabilityFormGroup.get("realEstateList") as FormArray;
    this.realEstateList.push(this.createAssetFormGroup());
  }

  createAssetFormGroup(): FormGroup {
    let assetFormGroup = this.formBuilder.group({
      id: [defKSUID32().next()],
      address: [new PlaceAddress()],
      unitNumber: [''],
      amount: ['', Validators.required],
      rentAmount: ['', Validators.required],
      rentFrequency: ['', Validators.required]
    });

    assetFormGroup.get('rentAmount')?.valueChanges?.subscribe(() => {
      this.calculateTotalAssets();
    });
    assetFormGroup.get('amount')?.valueChanges?.subscribe(() => {
      this.calculateTotalAssets();
    });
    return assetFormGroup
  }

  deleteFinancialAsset(i: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: { message:  `Are you sure you want to delete Financial Asset at ${i}?`,
            dialogHeader: 'Delete Financial Asset'
      },
      panelClass: ['animate__animated', 'animate__slideInLeft']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.financialAssetList.removeAt(i);
        this.assetLiabilityFormGroup.setControl("financialAssetList", this.financialAssetList);
        this.calculateTotalAssets();
        this.openSnackbar('Financial asset deleted');
      }
    });
  }

  addFinancialAsset() {
    this.financialAssetList = this.assetLiabilityFormGroup.get("financialAssetList") as FormArray;
    this.financialAssetList.push(this.createFinancialAssetFormGroup());
  }

  createFinancialAssetFormGroup(): FormGroup {
    let financialAssetFormGroup = this.formBuilder.group({
      id: [defKSUID32().next()],
      financialInstitution: ['', Validators.required],
      assetType: ['', Validators.required],
      currentBalance: ['', Validators.required],
      currentInterestRatePA: [''],
      otherAssetType:['']
    });
    financialAssetFormGroup.get('currentBalance')?.valueChanges?.subscribe(() => {
      this.calculateTotalAssets();
    });
    financialAssetFormGroup.get('assetType')?.valueChanges?.subscribe(newValue => {
      financialAssetFormGroup.get('financialInstitution')?.clearValidators();
      if (newValue?.name!=='Other') {
        financialAssetFormGroup.get('financialInstitution')?.setValidators(Validators.required);
      }
      this.assetLiabilityFormGroup.setControl('financialAssetList',this.financialAssetList);
    });
    return financialAssetFormGroup
  }

  deleteDepositPaid(i: number) {
    this.showConfirmationDialog(`Are you sure you want to delete Deposit Paid at ${i}?`);

    this.dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);
      if (result) {
        this.depositPaidList.removeAt(i);
        this.assetLiabilityFormGroup.setControl("depositPaidList", this.depositPaidList);
        this.calculateTotalAssets();
        this.openSnackbar('Financial asset deleted');
      }
    });
  }

  addDepositPaid() {
    this.depositPaidList = this.assetLiabilityFormGroup.get("depositPaidList") as FormArray;
    this.depositPaidList.push(this.createDepositPaidFormGroup());
  }

  createDepositPaidFormGroup(): FormGroup {
    let depositPaidFormGroup = this.formBuilder.group({
      id: [defKSUID32().next()],
      amount: ['', Validators.required]
    });
    depositPaidFormGroup.get('amount')?.valueChanges?.subscribe(() => {
      this.calculateTotalAssets();
    });
    return depositPaidFormGroup
  }

  deleteLiability(i: number) {
   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: { message:  `Are you sure you want to delete Liability?`,
            dialogHeader: 'Delete Liability'
      },
      panelClass: ['animate__animated', 'animate__slideInLeft']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.liabilityList.removeAt(i);
      this.assetLiabilityFormGroup.setControl("liabilityList", this.liabilityList);
      this.calculateTotalLiabilities();
        this.openSnackbar('Liability deleted');
      }
    });

  
  }

  calculateTotalLiabilities() {
    let total: number = 0;
    this.liabilityList.controls.forEach(formGroup => {
      total += parseInt(formGroup.get('outstandingBalance')?.value?.amount); //this.getNumber((formGroup as FormGroup), 'outstandingBalance')
    });
    this.assetLiabilityFormGroup.get('totalLiabilities')?.setValue(new Amount(total));
  }

  addLiability() {
    this.liabilityList = this.assetLiabilityFormGroup.get("liabilityList") as FormArray;
    this.liabilityList.push(this.createLiabilityFormGroup());
  }

  createLiabilityFormGroup(): FormGroup {
    let liabilityFormGroup = this.formBuilder.group({
      id: [],
      lenderName: ['', Validators.required],
      outstandingBalance: ['', Validators.required],
      minimumMonthlyPayment: ['', Validators.required],
      otherLender:[''],
      liabilityAddress: [''],
      smsfRealEstateAddressId: [''],
      smsfRealEstateTextName: [''],
      addressToBeRefinanced: [false, Validators.required],
      propertyValue: [''],
      limit: [''],
      currentInterestRate: ['', Validators.required],
      remainingTerm: ['']
    });
    liabilityFormGroup.get('outstandingBalance')?.valueChanges?.subscribe(() => {
      this.calculateTotalLiabilities()
    });

    return liabilityFormGroup
  }

  addExpense() {
    this.expenseList = this.assetLiabilityFormGroup.get("expenseList") as FormArray;
    this.expenseList.push(this.createExpenseFormGroup());
  }

  createExpenseFormGroup(): FormGroup {
    let expenseFormGroup = this.formBuilder.group({
      id: [defKSUID32().next()],
      annualRunningCosts: ['', [Validators.required, Validators.minLength(2)]],
      expenseType: [null, [Validators.required]],
      otherExpenseType:['']
    });
    expenseFormGroup.get('annualRunningCosts')?.valueChanges?.subscribe(() => {
      this.calculateTotalExpenses();
    });
    return expenseFormGroup
  }

  calculateTotalExpenses() {
    let expensesTotal : number = 0;
    this.expenseList.controls.forEach(formGroup => {
      expensesTotal += parseInt(formGroup.get('annualRunningCosts')?.value?.amount);// this.getNumber((formGroup as FormGroup), 'annualRunningCosts')
    });
    this.assetLiabilityFormGroup.get('totalExpenses')?.setValue(new Amount(expensesTotal));
  }

  deleteExpense(i: number) {
    this.showConfirmationDialog(`Are you sure you want to delete Expense at ${i}?`);
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.expenseList.removeAt(i);
      this.assetLiabilityFormGroup.setControl("expenseList", this.expenseList);
      this.calculateTotalAssets();
      }
    });
  }

  openSnackbar(message: string) {
    this._snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  showConfirmationDialog(message: String) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: { message: message
      },
      panelClass: ['animate__animated', 'animate__slideInLeft']
    });
  }

  setPlaceAddress(realEstateGroup: AbstractControl, placeAddress: PlaceAddress) {
    (realEstateGroup as FormGroup).get('address')?.patchValue(placeAddress, {emitEvent: false} );
    let newId = defKSUID32().next()
    placeAddress.id = newId;
    this.searchRealEstate(realEstateGroup, placeAddress);

  }

  searchRealEstate(realEstateGroup: AbstractControl, placeAddress: PlaceAddress) {
    let addressValue = this.addressService.getSearchAddress(placeAddress)

    if (addressValue.length > 2) {
      this.loading =true;
      this.dataService.coreLogicSearch(addressValue).subscribe(response => {
        this.loading = false;
        let realEstate = this.dataService.parseCoreLogicData(response.data);
        let price = realEstate?.price;
        let rentAmount = realEstate?.rentAmount

        if (price) {
          (realEstateGroup as FormGroup)?.get('amount')?.setValue(new Amount(parseInt( price || '')));
        }

        if (rentAmount){
          (realEstateGroup as FormGroup)?.get('rentAmount')?.setValue(new Amount(parseInt( rentAmount || '')));
        }

        let firstVal = placeAddress.id!!;
        let lastVal = placeAddress.formattedAddress!! == null || placeAddress.formattedAddress!! == '' ? this.addressService.formatAddress(placeAddress) : placeAddress.formattedAddress!!;
        (realEstateGroup as FormGroup)?.get('address')?.setValue(placeAddress);

        (realEstateGroup as FormGroup)?.get('unitNumber')?.valueChanges?.subscribe(newVal => {

          this.addressArray.push({
            value: firstVal,
            addressVal: `${newVal}/${lastVal}`
          });

        })

      }, error => {
        console.log(error);
        this.loading = false;
      });
    }
  }


  getAssetAndFrequencyList(): Observable<any>  {
    let freq = this.frequencyService.getFrequencyList();
    let asse =  this.assetTypeService.getAssetTypeList()
    let app = this.serviceAbilityService.currentLoanApplication
    let appId = this.serviceAbilityService.currentLoanApplicationId
    let fin = this.financialInstitutionService.getFinancialInstitutionList()
    return forkJoin([freq, asse, app, appId, fin]);
}



  saveData() {
    if (this.assetLiabilityFormGroup.valid) {
      let assetsAndLiabilities = this.assetsAndLiabilitiesService.formatData(this.assetLiabilityFormGroup.value);
      assetsAndLiabilities.loanApplicationId = this.currentLoanApplicationId;
      this.assetsAndLiabilitiesService.saveAssetsAndLiabilities(assetsAndLiabilities).subscribe((response=>{
        this.serviceAbilityService.updateCurrentLoanApplication(response);
      }));
    }
  }

  updateValues() {

    let estateAddressObject: any = {}
    let j = 0;
    this.currentAssetAndLiabilityPage?.smsfRealEstateList?.sort((a,b) => a.id.localeCompare(b.id))?.forEach(smsfRealEstate => {
      let realEstateFormGroup = this.realEstateList?.at(j);
      if (!realEstateFormGroup) {
        this.addAsset();
        realEstateFormGroup = this.realEstateList?.at(j);
      }
      realEstateFormGroup?.get('id')?.setValue(smsfRealEstate.id);
      realEstateFormGroup?.get('amount')?.setValue(new Amount(smsfRealEstate.currentValue))
      realEstateFormGroup?.get('rentAmount')?.setValue(new Amount(smsfRealEstate.rentAmount))
      realEstateFormGroup?.get('rentFrequency')?.setValue(this.frequencyList.find(d => d.id == smsfRealEstate?.rentFrequencyId))
      realEstateFormGroup?.get('address')?.setValue(smsfRealEstate.smsfRealEstateAddress?.[0])
      realEstateFormGroup?.get('unitNumber')?.setValue(smsfRealEstate.smsfRealEstateAddress?.[0].unitNumber)

      smsfRealEstate.smsfRealEstateAddress[0].formattedAddress = this.addressService.formatAddress(smsfRealEstate.smsfRealEstateAddress as unknown as PlaceAddress)

      estateAddressObject[smsfRealEstate.smsfRealEstateAddress?.[0].id!!] = {place: smsfRealEstate.smsfRealEstateAddress, value: smsfRealEstate.currentValue}
      this.addressArray.push({
        value: smsfRealEstate.smsfRealEstateAddress?.[0].id,
        addressVal: `${smsfRealEstate.smsfRealEstateAddress?.[0].unitNumber}/${smsfRealEstate.smsfRealEstateAddress?.[0].formattedAddress}`
      });

      j++;
    });
    j = 0;
    this.currentAssetAndLiabilityPage?.smsfFinancialAssetList?.sort((a,b) => a.id.localeCompare(b.id))?.forEach(financialAsset => {
      let financialAssetFormGroup = this.financialAssetList?.at(j);
      if (!financialAssetFormGroup) {
        this.addFinancialAsset();
        financialAssetFormGroup = this.financialAssetList?.at(j);
      }

      financialAssetFormGroup?.get('id')?.setValue(financialAsset.id);
      financialAssetFormGroup?.get('currentBalance')?.setValue(new Amount(financialAsset.currentBalance))
      financialAssetFormGroup?.get('otherAssetType')?.setValue(financialAsset.otherAsset)
      financialAssetFormGroup?.get('assetType')?.setValue(this.assetTypeList.find(d => d.id == financialAsset?.assetTypeId));
      financialAssetFormGroup?.get('financialInstitution')?.setValue(this.financialInstitutionList.find(d => d.id == financialAsset?.financialInstitutionId));
      financialAssetFormGroup?.get('currentInterestRatePA')?.setValue(financialAsset.currentInterestRate)
      j++;
    });
    j = 0;
    this.currentAssetAndLiabilityPage?.smsfDepositPaidList?.sort((a,b) => a.id.localeCompare(b.id))?.forEach(depositPaid => {
      let depositPaidFormGroup = this.depositPaidList?.at(j);
      if (!depositPaidFormGroup) {
        this.addDepositPaid();
        depositPaidFormGroup = this.depositPaidList?.at(j);
      }
      depositPaidFormGroup?.get('id')?.setValue(depositPaid.id);
      depositPaidFormGroup?.get('amount')?.setValue(new Amount(depositPaid.amount));
      j++;
    });

    j = 0;
    this.currentAssetAndLiabilityPage?.smsfLiabilityList?.sort((a,b) => a.id.localeCompare(b.id))?.forEach(liability => {
      let liabilityFormGroup = this.liabilityList?.at(j);
      if (!liabilityFormGroup) {
        this.addLiability();
        liabilityFormGroup = this.liabilityList?.at(j);
      }


      let address = estateAddressObject[liability.smsfRealEstateAddressId].place.formattedAddress;
      let value = estateAddressObject[liability.smsfRealEstateAddressId].value


      liabilityFormGroup?.get('limit')?.setValue(new Amount(liability.liabilityLimit));
      liabilityFormGroup?.get('currentInterestRate')?.setValue(liability.currentInterestRate);
      liabilityFormGroup?.get('remainingTerm')?.setValue(liability.remainingTerm);
      liabilityFormGroup?.get('propertyValue')?.setValue(value);
      liabilityFormGroup?.get('smsfRealEstateTextName')?.setValue(address);
      liabilityFormGroup?.get('smsfRealEstateAddressId')?.setValue(liability.smsfRealEstateAddressId)
      liabilityFormGroup?.get('addressToBeRefinanced')?.setValue(liability.addressToBeRefinanced)
      liabilityFormGroup?.get('id')?.setValue(liability.id);
      liabilityFormGroup?.get('lenderName')?.setValue(this.financialInstitutionList.find(d => d.id == liability?.lenderId));
      liabilityFormGroup?.get('otherLender')?.setValue(liability.otherLender);
      liabilityFormGroup?.get('minimumMonthlyPayment')?.setValue(new Amount(liability.minimumMonthlyPayment))
      liabilityFormGroup?.get('outstandingBalance')?.setValue(new Amount(liability.outstandingBalance))

      j++;
    });
    j = 0;

    this.currentAssetAndLiabilityPage?.smsfExpenseList?.sort((a,b) => a.id.localeCompare(b.id))?.forEach(expense => {
      let expenseFormGroup = this.expenseList?.at(j);
      if (!expenseFormGroup) {
        this.addExpense();
        expenseFormGroup = this.expenseList?.at(j);
      }
      expenseFormGroup?.get('id')?.setValue(expense.id);
      expenseFormGroup?.get('expenseType')?.setValue(this.expenseTypeList.find(d => d.id == expense?.expenseTypeId));
      expenseFormGroup?.get('otherExpenseType')?.setValue(expense.otherExpenseType);
      expenseFormGroup?.get('annualRunningCosts')?.setValue(new Amount(expense.annualRunningCost))
      j++;
    });
  }

  finalUniqueArray() {
    return [...new Map(this.addressArray.map((item: any) => [item["value"], item])).values()];
  }

  smsfFullCalcCheck () {

    let serviceability = this.serviceabilityFormGroup
    let personal = this.personalDetailFormGroup
    let assets = this.assetLiabilityFormGroup

    let loanPurpose = serviceability.get('loanPurpose')?.value == 'Refinance'
    let isIncomeContinuous = serviceability.get('isIncomeContinuous')?.value == 'No'
    let twoYearLoanRepayment = serviceability.get('twoYearLoanRepayment')?.value == 'No'

    if (!loanPurpose || loanPurpose && isIncomeContinuous || loanPurpose && twoYearLoanRepayment) {

      this.isLoading.emit(true);
      this.loanDetailService.fullServiceabilityCheck(serviceability, personal, assets).subscribe(res => {

        if (res.data.StatusCode !== 200) {
            this.assetLiabilityFormGroup?.get('fullServicingPassed')?.setValue(false)
            this.isServiceable.emit(false)
            this.updateWhyCalcFailed.next(res?.data?.Msg)
            this.serviceAbilityService.setCalculatorResult(res?.data)
        }else if (res.data.StatusCode === 200 && res.data.Data.ServicebilityOutcome === "Fail") {
            this.assetLiabilityFormGroup?.get('fullServicingPassed')?.setValue(false)
            this.isServiceable.emit(false)
            this.updateWhyCalcFailed.next('Unknown')
            this.serviceAbilityService.setCalculatorResult(res.data?.Data)
        }else {
            this.assetLiabilityFormGroup?.get('fullServicingPassed')?.setValue(true)
            this.isServiceable.emit(true)
            this.updateWhyCalcFailed.next('')
            this.serviceAbilityService.setCalculatorResult(res.data?.Data)
        }

      })

    }
  }

}
function subscribeToAddressChange() {
  throw new Error('Function not implemented.');
}

