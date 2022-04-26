import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {PlaceAddress} from "../models/PlaceAddress";
import {BaseService} from "../../../services/base.service";


@Injectable({providedIn: 'root'})
export class AdditionalAssetLiabilityService extends BaseService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  save(additionalAssetLiability: AdditionalAssetLiability): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/additional-asset-liability`, additionalAssetLiability, {headers: this.getHeaders()});
  }

  formatData(additionalAssetLiabilityData: any): AdditionalAssetLiability {
    return {
      loanApplicationId: '',
      applicantRealEstateList: additionalAssetLiabilityData.realEstateAssetsFormArray.map((realEstate: any) => ({
        id: realEstate.id,
        valueOfProperty: realEstate.valueOfProperty?.amount,
        rentalAmount: realEstate.rentalAmount?.amount,
        rentFrequencyId: realEstate.rentalFrequency?.id,
        applicantRealEstateAddress: realEstate.address,
        applicantRealEstateOwnershipList: realEstate.ownership?.owners?.map((owner: any) => ({
          applicantId: owner.applicantId == 'Other' ? '' : owner.applicantId,
          percentage: owner.stake,
          otherName: owner.otherOwner
        }))
      })),
      applicantSavingAndInvestmentList: additionalAssetLiabilityData.savingsAndInvestmentsFormArray.map((savingInvestment: any) => ({
        id: savingInvestment.id,
        otherFinancialAsset: savingInvestment.otherFinancialAsset,
        currentBalance: savingInvestment.currentBalance?.amount,
        financialAssetTypeId: savingInvestment.financialAssetType?.id,
        financialInstitutionId: savingInvestment.financialInstitution?.id,
        applicantSavingInvestmentOwnershipList: savingInvestment.ownership?.owners?.map((owner: any) => ({
          applicantId: owner.applicantId == 'Other' ? '' : owner.applicantId,
          percentage: owner.stake,
          otherName: owner.otherOwner
        }))
      })),
      applicantOtherAssetList: additionalAssetLiabilityData.otherAssetsFormArray.map((assetLiability: any) => ({
        id: assetLiability.id,
        otherFinancialAsset: assetLiability.otherFinancialAsset,
        currentBalance: assetLiability.currentBalance?.amount,
        assetTypeId: assetLiability.financialAssetType?.id,
        financialInstitutionId: assetLiability.financialInstitution?.id,
        applicantOtherAssetOwnershipList: assetLiability.ownership?.owners?.map((owner: any) => ({
          applicantId: owner.applicantId == 'Other' ? '' : owner.applicantId,
          percentage: owner.stake,
          otherName: owner.otherOwner
        }))
      })),
      applicantSuperannuation: {
        id: additionalAssetLiabilityData.superannuationFormGroup.currentBalance?.id,
        fundManagerName: additionalAssetLiabilityData.superannuationFormGroup.fundManagerName,
        currentBalance: additionalAssetLiabilityData.superannuationFormGroup.currentBalance?.amount,
        applicantSuperannuationOwnershipList: additionalAssetLiabilityData.superannuationFormGroup.ownership?.owners?.map((owner: any) => ({
          applicantId: owner.applicantId == 'Other' ? '' : owner.applicantId,
          percentage: owner.stake,
          otherName: owner.otherOwner
        }))
      },
      applicantPersonalLoan: {
        id: additionalAssetLiabilityData.personalLoansBankFacilitiesOverdraftsFormGroup.id,
        lenderId: additionalAssetLiabilityData.personalLoansBankFacilitiesOverdraftsFormGroup.lenderName?.id,
        outstandingBalance: additionalAssetLiabilityData.personalLoansBankFacilitiesOverdraftsFormGroup.outstandingBalance?.amount,
        limitValue: additionalAssetLiabilityData.personalLoansBankFacilitiesOverdraftsFormGroup.limit?.amount,
        minMonthlyPayment: additionalAssetLiabilityData.personalLoansBankFacilitiesOverdraftsFormGroup.minMonthlyPayment?.amount
      },
      applicantCreditStoreCard: {
        id: additionalAssetLiabilityData.creditCardsStoreCardsFormGroup.id,
        lenderId: additionalAssetLiabilityData.creditCardsStoreCardsFormGroup.lenderName?.id,
        outstandingBalance: additionalAssetLiabilityData.creditCardsStoreCardsFormGroup.outstandingBalance?.amount,
        limitValue: additionalAssetLiabilityData.creditCardsStoreCardsFormGroup.limit?.amount,
        minMonthlyPayment: additionalAssetLiabilityData.creditCardsStoreCardsFormGroup.minMonthlyPayment?.amount
      },
      applicantHirePurchaseLease: {
        id: additionalAssetLiabilityData.hirePurchaseLeasesFormGroup.id,
        lenderId: additionalAssetLiabilityData.hirePurchaseLeasesFormGroup.lenderName?.id,
        outstandingBalance: additionalAssetLiabilityData.hirePurchaseLeasesFormGroup.outstandingBalance?.amount,
        limitValue: additionalAssetLiabilityData.hirePurchaseLeasesFormGroup.limitValue?.amount,
        minMonthlyPayment: additionalAssetLiabilityData.hirePurchaseLeasesFormGroup.minMonthlyPayment?.amount
      },
      applicantOtherLiability: {
        id: additionalAssetLiabilityData.otherLiabilitiesFormGroup.id,
        otherLiabilityTypeId: additionalAssetLiabilityData.otherLiabilitiesFormGroup.otherLiabilityType?.id,
        outstandingBalance: additionalAssetLiabilityData.otherLiabilitiesFormGroup.outstandingBalance?.amount,
        minMonthlyPayment: additionalAssetLiabilityData.otherLiabilitiesFormGroup.minMonthlyPayment?.amount
      },
      smsfRealEstateLiabilityList: additionalAssetLiabilityData.realEstateLiabilitiesFormArray.map((realEstateLiability: any) => ({
        id: realEstateLiability.id,
        lenderId: realEstateLiability.lenderName?.id,
        outstandingBalance: realEstateLiability.outstandingBalance?.amount,
        limitValue: realEstateLiability.limit?.amount,
        minMonthlyPayment: realEstateLiability.minMonthlyPayment?.amount,
        currentInterestRate: realEstateLiability.currentInterestRate,
        remainingTermOutstanding: realEstateLiability.remainingTermOutstanding,
        realEstateId: realEstateLiability.realEstate?.id
      })),
      applicantExpenseList: additionalAssetLiabilityData.expensesFormArray.map((applicantExpense: any) => ({
        expenseTypeId: applicantExpense.expenseTypeId,
        frequencyId: applicantExpense.frequency?.id,
        amount: applicantExpense.amount?.amount
      }))
    }
  }
}


export interface AdditionalAssetLiability {
  loanApplicationId: string | undefined;
  applicantRealEstateList: ApplicantRealEstate[],
  applicantSavingAndInvestmentList: ApplicantSavingInvestment[],
  applicantOtherAssetList: ApplicantOtherAsset[],
  applicantSuperannuation: ApplicantSuperannuation,
  applicantPersonalLoan: ApplicantPersonalLoan,
  applicantCreditStoreCard: ApplicantCreditStoreCard,
  applicantHirePurchaseLease: ApplicantHirePurchaseLease,
  applicantOtherLiability: ApplicantOtherLiability,
  smsfRealEstateLiabilityList: SmsfRealEstateLiability[],
  applicantExpenseList: ApplicantExpense[]
}

export class ApplicantRealEstate {
  constructor(
    public id: string,
    public valueOfProperty: number,
    public rentalAmount: number,
    public rentFrequencyId: string,
    public applicantRealEstateAddress: PlaceAddress,
    public applicantRealEstateOwnershipList: Ownership[]
  ) {
  }
}

export class ApplicantSavingInvestment {
  constructor(
    public id: string,
    public financialInstitutionId: string,
    public financialAssetTypeId: string,
    public currentBalance: number,
    public otherFinancialAsset: string,
    public applicantSavingInvestmentOwnershipList: Ownership[]) {
  }
}

export class Ownership {
  constructor(public percentage: number, public applicantId: string, public otherName: string) {
  }
}

export class ApplicantOtherAsset {
  constructor(public id: string,
              public financialInstitutionId: string,
              public assetTypeId: string,
              public currentBalance: number,
              public otherFinancialAsset: string,
              public applicantOtherAssetOwnershipList: Ownership[]) {
  }
}

export class ApplicantSuperannuation {
  constructor(public id: string,
              public fundManagerName: string,
              public currentBalance: number,
              public applicantSuperannuationOwnershipList: Ownership[]) {
  }
}

export class ApplicantPersonalLoan {
  constructor(
    public id: string,
    public lenderId: string,
    public outstandingBalance: number,
    public limitValue: number,
    public minMonthlyPayment: number) {
  }
}

export class ApplicantCreditStoreCard {
  constructor(
    public id: string,
    public lenderId: string,
    public outstandingBalance: number,
    public limitValue: number,
    public minMonthlyPayment: number) {
  }
}

export class ApplicantHirePurchaseLease {
  constructor(
    public id: string,
    public lenderId: string,
    public outstandingBalance: number,
    public limitValue: number,
    public minMonthlyPayment: number) {
  }
}

export class ApplicantOtherLiability {
  constructor(
    public id: string,
    public otherLiabilityTypeId: string,
    // public otherLiabilityType: string,
    public outstandingBalance: number,
    public minMonthlyPayment: number) {
  }
}

export class SmsfRealEstateLiability {
  constructor(
    public id: string,
    public lenderId: string,
    public outstandingBalance: number,
    public limitValue: number,
    public minMonthlyPayment: number,
    public currentInterestRate: number,
    public remainingTermOutstanding: number,
    public realEstateId: string
  ) {
  }
}

export class ApplicantExpense {
  constructor(
    public id: string,
    public expenseTypeId: string,
    public frequencyId: string,
    public amount: number
  ) {
  }
}
