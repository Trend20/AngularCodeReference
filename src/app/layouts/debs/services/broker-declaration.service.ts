import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {formatDate} from "@angular/common";
import {BaseService} from "../../../services/base.service";


@Injectable({providedIn: 'root'})
export class BrokerDeclarationService extends BaseService {

  constructor(private httpClient: HttpClient) {
    super();
  }

  save(brokerDeclaration: BrokerDeclaration): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/broker-declaration`, brokerDeclaration, {headers: this.getHeaders()});
  }

  formatData(brokerDeclarationData: any): BrokerDeclaration {
    return {
      loanApplicationId: '',
      id: brokerDeclarationData.id,
      firstDateOfChange: brokerDeclarationData.firstDateOfChange ? formatDate(brokerDeclarationData.firstDateOfChange, 'yyyy-MM-dd', 'en-AU') : null,
      secondDateOfChange: brokerDeclarationData.secondDateOfChange ? formatDate(brokerDeclarationData.secondDateOfChange, 'yyyy-MM-dd', 'en-AU') : null,
      accreditationNumber: brokerDeclarationData.accreditationNumber,
      creditRepresentativeName: brokerDeclarationData.creditRepresentativeName,
      licenceNumber: brokerDeclarationData.licenceNumber,
      licenceHolderNumber: brokerDeclarationData.licenceHolderNumber,
      aclNumber: brokerDeclarationData.aclNumber,
      contactPhoneNumber: brokerDeclarationData.contactPhoneNumber,
      dateOfSignature: brokerDeclarationData.dateOfSignature ? formatDate(brokerDeclarationData.dateOfSignature, 'yyyy-MM-dd', 'en-AU') : null,
      formerNameReason: brokerDeclarationData.formerNameReason,
      applicantFormerName: brokerDeclarationData.applicantFormerName,
      alternativeDocumentPost: brokerDeclarationData.alternativeDocumentPost,
      electronicDelivery: brokerDeclarationData.electronicDelivery,
      questionsDetails: brokerDeclarationData.questionsDetails,
      expectSignificantChange: brokerDeclarationData.expectSignificantChange,
      clientJudgement: brokerDeclarationData.clientJudgement,
      defaultLegalAction: brokerDeclarationData.defaultLegalAction,
      creditorBenefit: brokerDeclarationData.creditorBenefit,
      dischargeDate: brokerDeclarationData.dischargeDate,
      liquidatorAppointment: brokerDeclarationData.liquidatorAppointment,
      transactionBalance: brokerDeclarationData.transactionBalance,
      lenderApplication: brokerDeclarationData.lenderApplication,
      loanGuarantee: brokerDeclarationData.loanGuarantee,
      lastCheckBoxDeclaration: brokerDeclarationData.lastCheckBoxDeclaration,
      bankruptcyDischargeDate: brokerDeclarationData.bankruptcyDischargeDate ? formatDate(brokerDeclarationData.bankruptcyDischargeDate,'yyyy-MM-dd', 'en-AU') : null,
      firstCheckboxDeclaration: brokerDeclarationData.firstCheckboxDeclaration,
      preferredSignatureFont: brokerDeclarationData.preferredSignatureFont,
      lenderApplicationDetails: brokerDeclarationData.lenderApplicationDetails,
      transactionBalanceDetails: brokerDeclarationData.transactionBalanceDetails,
      expectSignificantChangeDetails: brokerDeclarationData.expectSignificantChangeDetails,

    }
  }
}


export class BrokerDeclaration {
  constructor(
    public id: string,
    public firstDateOfChange: any,
    public secondDateOfChange: any,
    public accreditationNumber: string,
    public creditRepresentativeName: string,
    public licenceNumber: string,
    public licenceHolderNumber: string,
    public aclNumber: string,
    public contactPhoneNumber: string,
    public dateOfSignature: any,
    public formerNameReason: string,
    public applicantFormerName: string,
    public alternativeDocumentPost: string,
    public electronicDelivery: string,
    public questionsDetails: string,
    public expectSignificantChange: string,
    public clientJudgement: string,
    public defaultLegalAction: string,
    public creditorBenefit: string,
    public dischargeDate: any,
    public liquidatorAppointment: string,
    public transactionBalance: string,
    public lenderApplication: string,
    public loanGuarantee: string,
    public lastCheckBoxDeclaration: string,
    public bankruptcyDischargeDate: any,
    public firstCheckboxDeclaration: string,
    public preferredSignatureFont: string,
    public lenderApplicationDetails: string,
    public transactionBalanceDetails: string,
    public expectSignificantChangeDetails: string,
    public loanApplicationId: string) {
  }
}

