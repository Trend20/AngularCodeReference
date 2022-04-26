import { AfterViewInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddressService } from '../services/address.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit, AfterViewInit {
  private _personalDetailFormGroup!: FormGroup;
  loanPurpose: string = '';
  summaryContent: string = 'service';

  @Input() assetLiabilityFormGroup?: FormGroup;
  assetColumns: string[] = [
    'address',
    'rentalIncome',
    'rentalFrequency',
    'amount',
  ];
  savingsColumns: string[] = [
    'assetType',
    'financialInstitution',
    'currentBalance',
  ];
  depositColumns: string[] = ['amount'];
  liabilitiesColumns: string[] = [
    'lenderName',
    'outstandingBalance',
    'minimumMonthlyPayment',
  ];
  expensesColumns: string[] = ['expenseType', 'annualRunningCosts'];

  get personalDetailFormGroup(): FormGroup {
    return this._personalDetailFormGroup;
  }
  memberDetailsColumns: string[] = [
    'firstName',
    'dateOfBirth',
    'address',
    'passportNumber',
    'licenseNumber',
    'countryOfIssue',
  ];

  @Input()
  set personalDetailFormGroup(value: FormGroup) {
    this._personalDetailFormGroup = value;
  }

  subAccountsColumns: string[] = [
    'loanAmount',
    'rateType',
    'loanTerm',
    'repaymentType',
    'interestOnlyPeriod',
  ];

  @Input() serviceabilityFormGroup?: FormGroup;
  membersColumns: string[] = [
    'firstName',
    'applicantType',
    'paygType',
    'abnNumber',
    'notEmployedType',
    'paygStartDate',
    'employerSuperContribution',
    'employerSuperContributionFrequency',
    'additionalSuperContributionFrequency',
    'additionalSuperContribution',
  ];

  @Output()
  selectedIndex: EventEmitter<number> = new EventEmitter();

  constructor(private addressService: AddressService) {}

  getCorrectAddress(address: any) {
    return this.addressService.formatAddress(address);
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {}

  setSelectedIndex(): void {
    let key = this.summaryContent;

    switch (key) {
      case 'service':
        this.selectedIndex.emit(0);
        return;
      case 'loan':
        this.selectedIndex.emit(0);
        return;
      case 'app':
        this.selectedIndex.emit(1);
        return;
      case 'personal':
        this.selectedIndex.emit(1);
        return;
      case 'asset':
        if(this.checkIfAnyAssetorLiabilityIsPresent()) {
          this.selectedIndex.emit(2);
        }
        return;
      default:
        return;
    }
  }

  checkIfAnyAssetorLiabilityIsPresent() {
    if (
      this.assetLiabilityFormGroup?.value?.realEstateList?.length > 0 ||
      this.assetLiabilityFormGroup?.value?.financialAssetList?.length > 0 ||
      this.assetLiabilityFormGroup?.value?.depositPaidList?.length > 0 ||
      this.assetLiabilityFormGroup?.value?.liabilityList?.length > 0 ||
      this.assetLiabilityFormGroup?.value?.expenseList?.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  showSummary(summaryKey: any) {
    console.log(this.serviceabilityFormGroup?.value);
    this.summaryContent = summaryKey;
  }
}
