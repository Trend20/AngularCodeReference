import { RateType } from '../services/rate-type.service';
import { RepaymentType } from '../services/repayment-type.service';

export interface SubAccount {
  loanAmount: number;
  rateTypeId: string;
  loanTerm: number;
  hasOffset: string;
  repaymentTypeId: string;
  interestOnlyPeriod: number;
  fixedInterestRatePeriod: number;
  isMainAccount: boolean;
  id: string;
  interestRate: number;
  loanValueRatio: number;
}

export interface PersonalDetailsUpdate {
  applicantPersonalInformation: {
    firstName: string;
  };
  estimatedAnnualSuperContribution: number;
  currentYearSuperContribution: number;
  previousYearSuperContribution: number;
  selfEmployedCompanyName: string;
  employerSuperContribution: number;
  additionalSuperContribution: number;
  paygStartDate: string;
  employerName: string;
  applicantTypeId: string;
  notEmployedTypeId: string;
  employerSuperContributionFrequencyId: string;
  additionalSuperContributionFrequencyId: string;
  retiredTypeId: string;
  selfEmployedAbnNumber: string;
  employerAbn: number;
  paygTypeId: string;
  notEmployedEstimatedAnnualSuperContribution: number;
  selfEmployedBusinessStartDate: string;
}




