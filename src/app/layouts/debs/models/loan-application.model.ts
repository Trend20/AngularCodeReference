import {LoanDetail} from "../services/loan-detail.service";
import {
  SmsfDepositPaid,
  SmsfExpense,
  SmsfFinancialAsset,
  SmsfLiability,
  SmsfRealEstate
} from "../services/assets-and-liabilities.service";
import {Applicant} from "./applicant.model";
import {SubAccount} from "./sub-account.model";
import {
  ApplicantCreditStoreCard, ApplicantExpense, ApplicantHirePurchaseLease,
  ApplicantOtherAsset, ApplicantOtherLiability, ApplicantPersonalLoan,
  ApplicantRealEstate,
  ApplicantSavingInvestment, ApplicantSuperannuation
} from "../services/additional-asset-liability.service";
import {PropertyValuation} from "../services/valuation.service";
import {BusinessPartner} from "../services/business-partner.service";
import {BrokerDeclaration} from "../services/broker-declaration.service";

export interface LoanApplication {
  id: string,
  loanDetail: LoanDetail;
  applicantList: Applicant[];
  subAccountList: SubAccount[];
  applicationNumber: number;
  smsfAbn: {
    abn: string,
    address: string,
    name: string
    registrationDate: string
  };
  propertyTrusteeAcn: {
    acn: string,
    address: string,
    name: string
    registrationDate: string
    otherName: string
  };
  smsfTrusteeAcn: {
    acn: string,
    address: string,
    name: string
    registrationDate: string
  };
  smsfRealEstateList: SmsfRealEstate[];
  smsfFinancialAssetList: SmsfFinancialAsset[];
  smsfDepositPaidList: SmsfDepositPaid[];
  smsfLiabilityList: SmsfLiability[];
  smsfExpenseList: SmsfExpense[];
  applicantRealEstateList: ApplicantRealEstate[];
  applicantSavingAndInvestmentList: ApplicantSavingInvestment[];
  applicantOtherAssetList: ApplicantOtherAsset[];
  applicantSuperannuation: ApplicantSuperannuation;
  applicantPersonalLoan: ApplicantPersonalLoan;
  applicantCreditStoreCard: ApplicantCreditStoreCard;
  applicantHirePurchaseLease: ApplicantHirePurchaseLease;
  applicantOtherLiability: ApplicantOtherLiability;
  applicantExpenseList: ApplicantExpense[];
  propertyValuation: PropertyValuation;
  businessPartner: BusinessPartner;
  brokerDeclaration: BrokerDeclaration;
}
