export interface SendEmailModel {
  recipient: String;
  name: String;
  applicantId: String;
  loanId: String;
  middleName: String;
  lastName: String;
}

export interface EditAfterSign {
  
   id: String;  
   applicantId: String;  
   loanApplicationId: String;  
   createdAt: Date;  
   unsatisfiedJudgement: String;  
   unsatisfiedJudgementIfYes: String;  
   legalAction: String;  
   legalActionIfYes: String;  
   declaredBankrupt: String;  
   declaredBankruptIfYes: String;  
   bankruptDischargeDate: String;  
   shareHolderOrOfficer: String;  
   shareHolderOrOfficerIfYes: String;  
   borrowingDeposit: String;  
   borrowingDepositIfYes: String;  
   anotherLender: String;  
   anotherLenderIfYes: String;  
   guaranteedLoan: String;  
   guaranteedLoanIfYes: String;  
   adverseChange: String;  
   adverseChangeIfYes: String;  
   ifYesDetails: String;  
   applicantNameChange: Boolean;  
   applicantReasonForFormerName: String;  
   applicantDateOfNameChange: String;  
   guarantorNameChange: Boolean;  
   guarantorReasonForFormerName: String;  
   guarantorDateOfNameChange: String;  
   deliveryEmailMyself:  String;  
   deliveryEmailSolicitor: Boolean;  
   deliveryEmailBroker: Boolean;  
   postedAddress:  String;  
   postedSolicitor: Boolean;  
   confirmCheckBox:  Boolean;  
   over18CheckBox:  Boolean;  
   eSignatureCheckBox:  Boolean;  
   signatureApplicant:  String;  
   dateSignatureApplicant:  Date;  
   signatureGuarantor:  String;  
   dateSignatureGuarantor:  String;  
   applicantFirstName: String;  
   applicantMiddleName: String;  
   applicantLastName: String;  
   applicantEmailAddress: String;  
   applicantSignDate: Date;  
   applicantEmailSentDate: Date;  
   userFirstName: String;  
   checkBoxOne: Boolean;  
   checkBoxTwo: Boolean;  
   checkBoxThree: Boolean;  

}
