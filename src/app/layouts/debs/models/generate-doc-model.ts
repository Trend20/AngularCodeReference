export interface GenerateDoc {
  applicantName: string | undefined;
  date: string | undefined;
  applicationNumber: number | undefined;
  documentType: string | undefined;
  brokerName: string | undefined;
  brokerNumber: number | undefined;
  loanApprovalStatus: boolean | undefined;
  totalLoanAmount: number | undefined;
  securityAddress: string | undefined;
  securityTitle: string | undefined;
  subAccountList: SubAccount[];
}

export interface SubAccount {
  accountName: string | undefined;
  loanAmount: number | undefined;
  loanValueRatio: number | undefined;
  termInYears: number | undefined;
  offSet: string | undefined;
  paymentType: string | undefined;
  loanPurpose: string | undefined;
  formalApprovalId: string | undefined;
}
