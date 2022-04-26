/**
 * Interface is dealing with loan detail page Models
 */
 export interface LoanDetailPage {
    id: string;
    applicationNumber: number;
    loanPurpose: string | undefined;
    currentPropertyValue: number;
    estimatedWeeklyRent: number;
    incomeContinuous: string | undefined;
    loanDeposit: number;
    otherCost: number;
    preApproval: string;
    purchasePrice: number;
    requestedLoanAmount: number;
    stampDuty: number;
    totalFunds: number;
    loanPaidForTwoYears: string | undefined;
    loanValueRatio: 10.08;
    interestRate: 3.69;
    loanDetailAddress: LoanDetailPageAddress[];
    applicantList: LoanDetailPageApplicant[];
    subAccountList: LoanDetailPageSubAccout[];
  }
  
  /**
   * Interface is dealing with loan detail Adrress page Models
   */
  export interface LoanDetailPageApplicant {
    id: string;
    applicantTypeId: string | undefined;
    currentYearSuperContribution: number;
    previousYearSuperContribution: number;
    estimatedAnnualSuperContribution: number;
    notEmployedTypeId: string | undefined;
    employerSuperContribution: number;
    employerSuperContributionFrequencyId: string | undefined;
    additionalSuperContribution: number;
    additionalSuperContributionFrequencyId: string | undefined;
    retiredTypeId: string | undefined;
    applicantPersonalInformation: {
      id: string | undefined;
      firstName: string | undefined;
    };
    selfEmployedAbnNumber: number;
    selfEmployedCompanyName: string | undefined;
    paygStartDate: string | undefined;
    employerAbn: number;
    employerName: string | undefined;
    paygTypeId: string | undefined;
    notEmployedEstimatedAnnualSuperContribution: number;
  }
  
  /**
   * Interface is dealing with loan detail Adrress page Models
   */
  export interface LoanDetailPageSubAccout {
    loanAmount: number;
    rateTypeId: string | undefined;
    loanTerm: number;
    hasOffset: string | undefined;
    repaymentTypeId: string | undefined;
    interestOnlyPeriod: number;
    fixedInterestRatePeriod: number;
    isMainAccount: boolean;
    id: string;
  }
  
  /**
   * Interface is dealing with loan detail Adrress page Models
   */
  export interface LoanDetailPageAddress {
    streetNumber: string | undefined;
    route: string | undefined;
    locality: string | undefined;
    city: string | undefined;
    state: string | undefined;
    country: string | undefined;
    postalCode: string | undefined;
    isCurrent: string | undefined;
    suburb: string | undefined;
    dwellingName: string | undefined;
    dwellingType: string | undefined;
    dwellingNumber: string | undefined;
    stateCode: string | undefined;
    unitNumber: string | undefined;
    streetType: string | undefined;
    streetName: string | undefined;
    addressType: string | undefined;
    formattedAddress: string | undefined;
    id: string | undefined;
  }
  