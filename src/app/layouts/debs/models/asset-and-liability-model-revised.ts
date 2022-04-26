import { LoanDetailPageAddress } from "./LoanDetailModelPageRevised";

export interface AssetAndLiabilitiesPage{
  id: string;
  smsfDepositPaidList: AssetAndLiabilityPageDepositPaid[];
  smsfExpenseList: AssetAndLiabilityPageExpense[];
  smsfFinancialAssetList: AssetAndLiabilityPageFinancialAsset[];
  smsfLiabilityList: AssetAndLiabilityPageLiability[];
  smsfRealEstateList: AssetAndLiabilityPageRealEstate[];
}

interface AssetAndLiabilityPageDepositPaid{
  amount: number;
  id: string
}

interface AssetAndLiabilityPageExpense{
  annualRunningCost: number;
  expenseTypeId: string;
  id: string;
  otherExpenseType: string;
}

interface AssetAndLiabilityPageFinancialAsset{
  currentBalance: number;
  currentInterestRate: number;
  financialInstitutionId: string;
  id: string;
  otherAsset: string;
  assetTypeId: string;
}

interface AssetAndLiabilityPageLiability{
   addressToBeRefinanced: boolean;
   currentInterestRate: number;
   id: string;
   lenderId: string,
   liabilityLimit: number;
   minimumMonthlyPayment: number;
   otherLender: string;
   outstandingBalance: number;
   remainingTerm: number;
   smsfRealEstateAddressId: string
}

interface AssetAndLiabilityPageRealEstate{
  currentValue: number;
  id: string;
  rentAmount: number;
  rentFrequencyId: string,
  smsfRealEstateAddress: LoanDetailPageAddress[]
  unitNumber: number;
}

