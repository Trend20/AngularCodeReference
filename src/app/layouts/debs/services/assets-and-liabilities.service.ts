import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {Frequency} from "./frequency.service";
import {PlaceAddress} from "../models/PlaceAddress";
import {FinancialInstitution} from "./financial-institution.service";
import {AssetType} from "./asset-type.service";
import {Expense} from "./expense-type.service";
import {SmsfRealEstateLiability} from "./additional-asset-liability.service";
import {BaseService} from "../../../services/base.service";

@Injectable({providedIn: 'root'})
export class AssetsAndLiabilitiesService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  saveAssetsAndLiabilities(assetsAndLiabilities: AssetsAndLiabilities): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/asset-liability`, assetsAndLiabilities, {headers: this.getHeaders()})
  }

  formatData(assetAndLiabilitiesData: any): AssetsAndLiabilities {
    return {
      loanApplicationId: '',
      smsfRealEstateList: assetAndLiabilitiesData.realEstateList.map((realEstate: any) => ({
        id: realEstate.id,
        currentValue: realEstate.amount.amount,
        rentAmount: realEstate.rentAmount.amount,
        rentFrequencyId: realEstate.rentFrequency?.id,
        smsfRealEstateAddress: { ...realEstate.address, unitNumber: realEstate?.unitNumber}
      })),
      smsfDepositPaidList: assetAndLiabilitiesData.depositPaidList.map((depositPaid: any) => ({
        id: depositPaid.id,
        amount: depositPaid.amount?.amount
      })),
      smsfExpenseList: assetAndLiabilitiesData.expenseList.map((expense: any) => ({
        id: expense.id,
        expenseTypeId: expense.expenseType?.id,
        otherExpenseType: expense.otherExpenseType,
        annualRunningCost: expense.annualRunningCosts?.amount
      })),
      smsfLiabilityList: assetAndLiabilitiesData.liabilityList.map((liability: any) => ({
        id: liability.id,
        lenderId: liability.lenderName?.id,
        otherLender: liability.otherLender,
        minimumMonthlyPayment: liability.minimumMonthlyPayment?.amount,
        outstandingBalance: liability.outstandingBalance?.amount,
        addressToBeRefinanced: liability.addressToBeRefinanced,
        smsfRealEstateAddressId: liability.smsfRealEstateAddressId,
        liabilityLimit: liability.limit?.amount,
        currentInterestRate: liability.currentInterestRate,
        remainingTerm: liability.remainingTerm
      })),
      smsfFinancialAssetList: assetAndLiabilitiesData.financialAssetList.map((financialAsset: any) => ({
        id: financialAsset.id,
        currentBalance: financialAsset.currentBalance?.amount,
        otherAsset: financialAsset.otherAssetType,
        assetTypeId: financialAsset.assetType?.id,
        financialInstitutionId: financialAsset.financialInstitution?.id,
        currentInterestRate: financialAsset.currentInterestRatePA
      })),
    }
  }
}


export interface AssetsAndLiabilities {
  loanApplicationId: string | undefined;
  smsfRealEstateList: SmsfRealEstate[];
  smsfFinancialAssetList: SmsfFinancialAsset[];
  smsfDepositPaidList: SmsfDepositPaid[];
  smsfLiabilityList: SmsfLiability[];
  smsfExpenseList: SmsfExpense[];
}

export class SmsfRealEstate {
  constructor(public id: string, public currentValue: number, public rentAmount: number, public rentFrequency: Frequency,
              public rentFrequencyId: string, public smsfRealEstateAddress: PlaceAddress, public unitNumber: number,  public smsfRealEstateLiabilityList: SmsfRealEstateLiability[]) {
  }
}

export class SmsfExpense {
  constructor(public id: string, public annualRunningCost: number, public expenseTypeId: string, public expenseType: Expense, public otherExpenseType: string) {
  }
}

export class SmsfLiability {
  constructor(
    public id: string,
    public outstandingBalance: number,
    public minimumMonthlyPayment: number,
    public lenderId: string, public lender: FinancialInstitution,
    public  addressToBeRefinanced: string,
    public smsfRealEstateAddressId: string,
    public liabilityLimit: number,
    public currentInterestRate: number,
    public remainingTerm: number,
    public otherLender: string) {
  }
}

export class SmsfFinancialAsset {
  constructor(
    public id: string,
    public financialInstitutionId: string,
    public financialInstitution: FinancialInstitution,
    public assetTypeId: string,
    public assetType: AssetType,
    public currentBalance: number,
    public currentInterestRate: number,
    public otherAsset: string) {
  }
}

export class SmsfDepositPaid {
  constructor(
    public id: string,
    public amount: number) {
  }
}
